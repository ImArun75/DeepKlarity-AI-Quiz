from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
from dotenv import load_dotenv
import os

load_dotenv()

from app.database import get_db, init_db, QuizRecord
from app.scraper import scrape_wikipedia
from app.llm_service import LLMService

app = FastAPI(title="Wikipedia Quiz Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm_service = LLMService()

@app.on_event("startup")
def on_startup():
    init_db()

class GenerateRequest(BaseModel):
    url: str

class QuizItemResponse(BaseModel):
    question: str
    options: List[str]
    answer: str
    difficulty: str
    explanation: str

class QuizDetailResponse(BaseModel):
    id: int
    url: str
    title: str
    summary: str
    key_entities: dict
    sections: List[str]
    quiz: List[QuizItemResponse]
    related_topics: List[str]

class QuizHistoryItem(BaseModel):
    id: int
    url: str
    title: str
    created_at: str

@app.post("/generate", response_model=QuizDetailResponse)
def generate_quiz(request: GenerateRequest, db: Session = Depends(get_db)):
    url = request.url.strip()
    if "wikipedia.org/wiki/" not in url:
       raise HTTPException(status_code=400, detail="Invalid Wikipedia URL")

    try:
        scraped_data = scrape_wikipedia(url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Scraping failed: {str(e)}")

    try:
        llm_output = llm_service.generate_quiz_from_text(scraped_data["full_text"], scraped_data["summary"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")

    new_quiz = QuizRecord(
        url=url,
        title=scraped_data["title"],
        summary=llm_output.get("summary_refinement", scraped_data["summary"]),
        key_entities=llm_output.get("key_entities", {}),
        sections=scraped_data.get("sections", []),
        quiz_data=llm_output.get("quiz", []),
        related_topics=llm_output.get("related_topics", [])
    )
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    return QuizDetailResponse(
        id=new_quiz.id,
        url=new_quiz.url,
        title=new_quiz.title,
        summary=new_quiz.summary,
        key_entities=new_quiz.key_entities,
        sections=new_quiz.sections,
        quiz=new_quiz.quiz_data,
        related_topics=new_quiz.related_topics
    )

@app.get("/history", response_model=List[QuizHistoryItem])
def get_history(db: Session = Depends(get_db)):
    quizzes = db.query(QuizRecord).order_by(QuizRecord.created_at.desc()).all()
    results = []
    for q in quizzes:
        results.append(QuizHistoryItem(
            id=q.id,
            url=q.url,
            title=q.title,
            created_at=q.created_at.isoformat()
        ))
    return results

@app.get("/history/{quiz_id}", response_model=QuizDetailResponse)
def get_quiz_detail(quiz_id: int, db: Session = Depends(get_db)):
    q = db.query(QuizRecord).filter(QuizRecord.id == quiz_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    return QuizDetailResponse(
        id=q.id,
        url=q.url,
        title=q.title,
        summary=q.summary,
        key_entities=q.key_entities,
        sections=q.sections,
        quiz=q.quiz_data,
        related_topics=q.related_topics
    )
