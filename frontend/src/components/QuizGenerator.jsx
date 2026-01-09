import React, { useState } from 'react';
import axios from 'axios';
import { Search, Loader2 } from 'lucide-react';
import { QuizView } from './QuizView';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function QuizGenerator() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!url.includes('wikipedia.org/wiki/')) {
            setError('Please enter a valid Wikipedia URL');
            return;
        }

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await axios.post(`${API_URL}/generate`, { url });
            setData(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to generate quiz. Please check the URL or try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {!data ? (
                <div className="max-w-2xl mx-auto space-y-8 py-12">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold text-slate-800">Start Knowledge Extraction</h2>
                        <p className="text-slate-500">Enter a Wikipedia URL to begin</p>
                    </div>

                    <form onSubmit={handleGenerate} className="flex gap-4">
                        <input
                            type="url"
                            placeholder="https://en.wikipedia.org/wiki/..."
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-lg shadow-indigo-200"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                            Generate
                        </button>
                    </form>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center">
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-12 space-y-4">
                            <Loader2 className="animate-spin text-indigo-600 mx-auto" size={48} />
                            <p className="text-slate-500 animate-pulse">
                                Reading Wikipedia article...<br />
                                Analyzing content...<br />
                                Crafting quiz questions...
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <button
                        onClick={() => setData(null)}
                        className="text-sm text-slate-500 hover:text-indigo-600 mb-4"
                    >
                        ← Generator Another
                    </button>
                    <QuizView data={data} />
                </div>
            )}
        </div>
    );
}
