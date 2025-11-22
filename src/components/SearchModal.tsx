"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Search as SearchIcon, X, FileText, FolderKanban, CheckSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface SearchResults {
    pages?: any[];
    projects?: any[];
    tasks?: any[];
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { accessToken } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResults>({});
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            // Keyboard shortcut: Escape to close
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
            };
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        if (query.trim().length === 0) {
            setResults({});
            return;
        }

        const debounce = setTimeout(() => {
            performSearch();
        }, 300);

        return () => clearTimeout(debounce);
    }, [query, accessToken]);

    const performSearch = async () => {
        if (!accessToken || query.trim().length === 0) return;

        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setResults(data);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const totalResults = (results.pages?.length || 0) + (results.projects?.length || 0) + (results.tasks?.length || 0);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-20" onClick={onClose}>
            <div
                className="bg-white dark:bg-[#202020] rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search pages, projects, and tasks..."
                        className="flex-1 bg-transparent outline-none text-lg"
                    />
                    {loading && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto p-2">
                    {query.trim().length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <SearchIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>Start typing to search...</p>
                        </div>
                    ) : totalResults === 0 && !loading ? (
                        <div className="text-center py-12 text-gray-500">
                            <p>No results found for "{query}"</p>
                        </div>
                    ) : (
                        <>
                            {/* Pages */}
                            {results.pages && results.pages.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">Pages</h3>
                                    {results.pages.map((page) => (
                                        <Link
                                            key={page._id}
                                            href={`/${page._id}`}
                                            onClick={onClose}
                                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                        >
                                            <FileText className="w-4 h-4 text-gray-400" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{page.title || 'Untitled'}</p>
                                                <p className="text-xs text-gray-500">Page</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Projects */}
                            {results.projects && results.projects.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">Projects</h3>
                                    {results.projects.map((project) => (
                                        <Link
                                            key={project._id}
                                            href={`/projects/${project._id}`}
                                            onClick={onClose}
                                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                        >
                                            <FolderKanban className="w-4 h-4 text-gray-400" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{project.title}</p>
                                                <p className="text-xs text-gray-500">{project.description || 'Project'}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded ${project.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Tasks */}
                            {results.tasks && results.tasks.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">Tasks</h3>
                                    {results.tasks.map((task) => (
                                        <Link
                                            key={task._id}
                                            href={`/tasks/${task._id}`}
                                            onClick={onClose}
                                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                        >
                                            <CheckSquare className="w-4 h-4 text-gray-400" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{task.title}</p>
                                                <p className="text-xs text-gray-500">
                                                    {task.projectId?.title || 'Task'} • {task.status}
                                                </p>
                                            </div>
                                            {task.priority && (
                                                <span className={`text-xs px-2 py-1 rounded ${task.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                        task.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                                    }`}>
                                                    {task.priority}
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-[var(--border)] px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
                    <span>Press ESC to close</span>
                    <span>{totalResults} result{totalResults !== 1 ? 's' : ''}</span>
                </div>
            </div>
        </div>
    );
}
