# WikiQuiz Generator

A full-stack AI application that generates interactive quizzes from Wikipedia articles using Google Gemini, FastAPI, and React.

## Features
- **Instant Quiz Generation**: Enter a Wikipedia URL and get a 5-10 question quiz instantly.
- **AI-Powered**: Uses Gemini Pro for high-quality question generation and summarization.
- **Interactive Mode**: "Take Quiz" mode allows you to test your knowledge with validation.
- **History**: View all previously generated quizzes.
- **Clean UI**: Modern, responsive interface built with Tailwind CSS.

## Tech Stack
- **Backend**: Python, FastAPI, SQLAlchemy
- **Database**: PostgreSQL (configured) / SQLite (default for local demo)
- **Frontend**: React, Vite, TailwindCSS
- **AI**: LangChain, Google Gemini API

## Setup Instructions

### 1. Backend

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

**Environment Variables**:
Create a `.env` file in `backend/` or ensure these are set in your shell:
```
GOOGLE_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://user:password@localhost/dbname  # Optional, defaults to SQLite
```

**Run Server**:
```bash
uvicorn app.main:app --reload
```
Server will start at `http://localhost:8000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend will start at `http://localhost:5173`.

## Usage
1. Open the frontend.
2. Paste a Wikipedia link (e.g., https://en.wikipedia.org/wiki/Quantum_computing).
3. Click "Generate".
4. Enjoy the quiz!

## API Endpoints
- `POST /generate`: {url: string} -> JSON
- `GET /history`: List of past quizzes
- `GET /history/{id}`: Detail view

## Screenshots

### 1. Landing Page
Users can enter any valid Wikipedia URL and choose to generate a quiz or view quiz history.

![Landing Page](https://github.com/user-attachments/assets/dc6bdaff-dff9-429c-b0bb-90c184738692)

---

### 2. Quiz Generation (Loading State)
After submitting a URL, the app shows a loading state while Gemini processes the article and creates questions.

![Loading Quiz](https://github.com/user-attachments/assets/e97da75a-d9ec-4eb0-b3e7-99335df432a5)

---

### 3. Quiz with Scoring
Users can answer questions, submit, and immediately see their score with correct/incorrect answer indicators.

![Quiz with Scoring](https://github.com/user-attachments/assets/ded58c9c-9c17-4fa0-9e5e-1d1f6e7cdc93)

---

### 4. Quiz History
All previously generated quizzes are listed in a separate History tab, allowing users to reopen and retake old quizzes.

![History Tab](https://github.com/user-attachments/assets/cfac20aa-adf6-4206-81b4-e0d52741a02f)
