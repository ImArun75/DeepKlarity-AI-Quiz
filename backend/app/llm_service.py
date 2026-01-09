import os
import json
import google.generativeai as genai
from typing import List, Optional
from pydantic import BaseModel, Field

class QuizOption(BaseModel):
    pass

class QuizQuestion(BaseModel):
    question: str = Field(description="The question text")
    options: List[str] = Field(description="A list of 4 options (A-D)")
    answer: str = Field(description="The correct answer from the options")
    difficulty: str = Field(description="Difficulty level: 'easy', 'medium', or 'hard'")
    explanation: str = Field(description="Short explanation of why the answer is correct")

class KeyEntities(BaseModel):
    people: List[str] = Field(description="List of key people mentioned")
    organizations: List[str] = Field(description="List of key organizations mentioned")
    locations: List[str] = Field(description="List of key locations mentioned")

class QuizOutput(BaseModel):
    summary_refinement: str = Field(description="A refined summary of the text")
    key_entities: KeyEntities = Field(description="Extracted entities")
    quiz: List[QuizQuestion] = Field(description="List of 5-10 quiz questions")
    related_topics: List[str] = Field(description="Suggest related Wikipedia topics for further reading")

class LLMService:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("WARNING: GOOGLE_API_KEY not found in environment variables.")
        
        genai.configure(api_key=api_key)
        
        self.model = genai.GenerativeModel(
            model_name="gemini-2.0-flash-exp",
            generation_config={"response_mime_type": "application/json"}
        )

    def generate_quiz_from_text(self, text: str, original_summary: str) -> dict:
        
        prompt = f"""
        You are an expert educational AI assistant.
        
        Input Text provided from a Wikipedia article:
        {text}
        
        Task:
        1. Analyze the text and generate a quiz with 5 to 10 multiple-choice questions.
        2. Questions should range from easy to hard.
        3. Extract key entities (People, Organizations, Locations).
        4. Suggest related topics.
        5. Refine the provided summary to be concise and engaging.
        
        Output strict JSON that matches this structure:
        {{
            "summary_refinement": "string",
            "key_entities": {{
                "people": ["string"],
                "organizations": ["string"],
                "locations": ["string"]
            }},
            "quiz": [
                {{
                    "question": "string",
                    "options": ["string", "string", "string", "string"],
                    "answer": "string",
                    "difficulty": "easy|medium|hard",
                    "explanation": "string"
                }}
            ],
            "related_topics": ["string"]
        }}
        """

        try:
            response = self.model.generate_content(prompt)
            result_json = json.loads(response.text)
            return result_json
        except Exception as e:
            print(f"LLM Generation Error: {e}")
            
            return {
                "summary_refinement": "The AI service is currently unavailable. Displaying a sample summary based on the input text length of " + str(len(text)) + " characters.",
                "key_entities": {
                    "people": ["Alan Turing", "Grace Hopper"],
                    "organizations": ["NASA", "OpenAI"],
                    "locations": ["Bletchley Park", "Silicon Valley"]
                },
                "quiz": [
                    {
                        "question": "What is the primary function of this application?",
                        "options": ["To play music", "To generate quizzes from Wikipedia", "To edit images", "To send emails"],
                        "answer": "To generate quizzes from Wikipedia",
                        "difficulty": "easy",
                        "explanation": "The application scrapes Wikipedia articles and generates interactive quizzes."
                    },
                    {
                        "question": "Which component manages the database connections?",
                        "options": ["Frontend", "FastAPI Backend", "Browser", "None"],
                        "answer": "FastAPI Backend",
                        "difficulty": "medium",
                        "explanation": "The FastAPI backend uses SQLAlchemy to manage database sessions."
                    },
                     {
                        "question": "What does API stand for?",
                        "options": ["Application Programming Interface", "Apple Pie Ingredients", "Automated Program Instruction", "Advanced Protocol Integration"],
                        "answer": "Application Programming Interface",
                        "difficulty": "medium",
                        "explanation": "API stands for Application Programming Interface."
                    },
                    {
                        "question": "Who is considered the father of theoretical computer science?",
                        "options": ["Albert Einstein", "Alan Turing", "Isaac Newton", "Charles Babbage"],
                        "answer": "Alan Turing",
                        "difficulty": "hard",
                        "explanation": "Alan Turing is widely considered to be the father of theoretical computer science and artificial intelligence."
                    },
                    {
                        "question": "Which HTTP method is used to submit data to the server?",
                        "options": ["GET", "POST", "DELETE", "HEAD"],
                        "answer": "POST",
                        "difficulty": "easy",
                        "explanation": "The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server."
                    }
                ],
                "related_topics": ["Artificial Intelligence", "Computer Science", "Web Development"]
            }
