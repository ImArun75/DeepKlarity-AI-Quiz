import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, Clock, Calendar } from 'lucide-react';
import { QuizView } from './QuizView';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function QuizHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${API_URL}/history`);
            setHistory(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const loadDetail = async (id) => {
        try {
            const res = await axios.get(`${API_URL}/history/${id}`);
            setSelectedQuiz(res.data);
        } catch (e) {
            console.error(e);
            alert("Failed to load details");
        }
    };

    if (selectedQuiz) {
        return (
            <div className="space-y-4">
                <button
                    onClick={() => setSelectedQuiz(null)}
                    className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                >
                    ← Back to History
                </button>
                <QuizView data={selectedQuiz} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Quiz History</h2>

            {loading ? (
                <div className="py-12 text-center text-slate-400">Loading history...</div>
            ) : history.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
                    No quizzes generated yet. Go to the generator tab to create one!
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
                            <tr>
                                <th className="p-4">Article</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {history.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900">{item.title}</div>
                                        <div className="text-xs text-slate-400 truncate max-w-[200px]">{item.url}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => loadDetail(item.id)}
                                            className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors"
                                        >
                                            <Eye size={14} className="mr-1.5" /> Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
