import React, { useState } from 'react';
import { BookOpen, History } from 'lucide-react';
import { QuizGenerator } from './components/QuizGenerator';
import { QuizHistory } from './components/QuizHistory';

function App() {
    const [activeTab, setActiveTab] = useState('generate');

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-indigo-700 mb-2">WikiQuiz Gen</h1>
                <p className="text-slate-500">Transform any Wikipedia article into an interactive quiz instantly.</p>
            </header>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] border border-slate-100">
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('generate')}
                        className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${activeTab === 'generate'
                                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <BookOpen size={20} />
                        Generate Quiz
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${activeTab === 'history'
                                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <History size={20} />
                        Past Quizzes
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'generate' ? <QuizGenerator /> : <QuizHistory />}
                </div>
            </div>
        </div>
    );
}

export default App;
