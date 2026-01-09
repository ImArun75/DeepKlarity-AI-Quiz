import React, { useState } from 'react';
import { CheckCircle, XCircle, Book, Tag, MapPin, Users, Building } from 'lucide-react';

export function QuizView({ data }) {
    const [takeQuizMode, setTakeQuizMode] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(null);

    const toggleAnswer = (questionIndex, option) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: option
        }));
    };

    const submitQuiz = () => {
        let newScore = 0;
        data.quiz.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.answer) {
                newScore++;
            }
        });
        setScore(newScore);
    };

    const resetQuiz = () => {
        setTakeQuizMode(false);
        setSelectedAnswers({});
        setScore(null);
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h2 className="text-3xl font-bold text-indigo-900 mb-2">{data.title}</h2>
                <p className="text-indigo-800 leading-relaxed">{data.summary}</p>

                <div className="mt-6 flex flex-wrap gap-4">
                    {data.key_entities.people?.length > 0 && (
                        <div className="flex gap-2 items-center text-sm text-indigo-700">
                            <Users size={16} /> <span>{data.key_entities.people.slice(0, 3).join(", ")}</span>
                        </div>
                    )}
                    {data.key_entities.locations?.length > 0 && (
                        <div className="flex gap-2 items-center text-sm text-indigo-700">
                            <MapPin size={16} /> <span>{data.key_entities.locations.slice(0, 3).join(", ")}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">Quiz</h3>
                {!takeQuizMode ? (
                    <button
                        onClick={() => setTakeQuizMode(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                    >
                        Take Quiz Mode (Hide Answers)
                    </button>
                ) : (
                    <button
                        onClick={resetQuiz}
                        className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm transition"
                    >
                        Exit Quiz Mode
                    </button>
                )}
            </div>

            {score !== null && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                    <span className="text-2xl font-bold text-yellow-800">You scored {score} / {data.quiz.length}</span>
                </div>
            )}

            <div className="grid gap-6">
                {data.quiz.map((q, idx) => {
                    const isSelected = selectedAnswers[idx];
                    const isCorrect = isSelected === q.answer;
                    const showResult = score !== null;

                    return (
                        <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="font-semibold text-lg text-slate-800 flex-1">{idx + 1}. {q.question}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wide
                  ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                        q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'}`}>
                                    {q.difficulty}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {q.options.map((opt, optIdx) => {
                                    let btnClass = "p-3 rounded-lg border text-left transition-all text-sm ";

                                    if (takeQuizMode) {
                                        if (showResult) {
                                            if (opt === q.answer) btnClass += "bg-green-100 border-green-500 ring-1 ring-green-500 ";
                                            else if (opt === selectedAnswers[idx] && opt !== q.answer) btnClass += "bg-red-50 border-red-300 ";
                                            else btnClass += "bg-slate-50 border-slate-200 opacity-60 ";
                                        } else {
                                            if (selectedAnswers[idx] === opt) btnClass += "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 ";
                                            else btnClass += "bg-white border-slate-200 hover:bg-slate-50 ";
                                        }
                                    } else {
                                        if (opt === q.answer) btnClass += "bg-green-50 border-green-500 font-medium ";
                                        else btnClass += "bg-white border-slate-200 ";
                                    }

                                    return (
                                        <button
                                            key={optIdx}
                                            onClick={() => takeQuizMode && !showResult && toggleAnswer(idx, opt)}
                                            disabled={!takeQuizMode || showResult}
                                            className={btnClass}
                                        >
                                            <div className="flex justify-between">
                                                <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                                {!takeQuizMode && opt === q.answer && <CheckCircle size={16} className="text-green-600" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {(!takeQuizMode || showResult) && (
                                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100">
                                    <span className="font-semibold text-slate-700">Explanation:</span> {q.explanation}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {takeQuizMode && score === null && (
                <div className="text-center">
                    <button
                        onClick={submitQuiz}
                        disabled={Object.keys(selectedAnswers).length < data.quiz.length}
                        className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Submit Answers
                    </button>
                </div>
            )}

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                    <Book size={16} /> Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                    {data.related_topics.map((topic, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-600 text-sm shadow-sm">
                            {topic}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
