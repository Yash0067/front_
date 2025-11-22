"use client";

import React, { useEffect, useState } from 'react';
import { Clock, FileText, BookOpen, Search, Inbox, Sparkles, Plus, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Page {
    _id: string;
    title: string;
    updatedAt: string;
    icon?: string;
}

export default function HomeDashboard() {
    const [recentPages, setRecentPages] = useState<Page[]>([]);
    const [greeting, setGreeting] = useState('');
    const [showNewMenu, setShowNewMenu] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');

        fetchRecentPages();
    }, []);

    const fetchRecentPages = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/pages');
            const data = await res.json();
            // Sort by updatedAt desc and take top 4
            const sorted = data.sort((a: Page, b: Page) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4);
            setRecentPages(sorted);
        } catch (error) {
            console.error('Failed to fetch pages:', error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pt-20 px-12 relative">
            {/* New Button - Top Right */}
            <div className="absolute top-4 right-4">
                <div className="relative">
                    <button
                        onClick={() => setShowNewMenu(!showNewMenu)}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {showNewMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowNewMenu(false)} />
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#202020] border border-[var(--border)] rounded-xl shadow-xl z-20 overflow-hidden">
                                <div className="p-2">
                                    <button
                                        onClick={() => {
                                            router.push('/projects');
                                            setShowNewMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors text-left"
                                    >
                                        <FileText className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <div className="font-medium text-sm">New Page</div>
                                            <div className="text-xs text-gray-500">Create a blank page</div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.push('/projects-table');
                                            setShowNewMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors text-left"
                                    >
                                        <div className="w-5 h-5 text-gray-500 flex items-center justify-center text-lg">📊</div>
                                        <div>
                                            <div className="font-medium text-sm">New Database</div>
                                            <div className="text-xs text-gray-500">Create a table, board, or list</div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.push('/projects');
                                            setShowNewMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors text-left"
                                    >
                                        <Sparkles className="w-5 h-5 text-purple-500" />
                                        <div>
                                            <div className="font-medium text-sm">Try Flux AI</div>
                                            <div className="text-xs text-gray-500">Generate content with AI</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <h1 className="text-3xl font-bold mb-8 text-center">{greeting}</h1>

            {/* Quick Actions / AI Promo */}
            <div className="bg-white dark:bg-[#202020] border border-[var(--border)] rounded-xl p-6 mb-12 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg mb-1">Looking for Flux AI?</h3>
                    <p className="text-sm text-gray-500 mb-4">Try full-page Flux AI from the sidebar</p>
                    <button className="bg-blue-500 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-600 transition-colors">
                        Try it
                    </button>
                </div>
                <div className="hidden sm:block">
                    {/* Visual placeholder for the AI tooltip in screenshot */}
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#252525] p-4 rounded-lg border border-[var(--border)]">
                        <div className="flex flex-col gap-2 text-sm text-gray-500">
                            <div className="flex items-center gap-2"><Search className="w-4 h-4" /> Search</div>
                            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Home</div>
                            <div className="flex items-center gap-2 text-[var(--foreground)] font-medium bg-gray-200 dark:bg-[#333] px-2 py-1 rounded"><Sparkles className="w-4 h-4 text-purple-500" /> Flux AI</div>
                            <div className="flex items-center gap-2"><Inbox className="w-4 h-4" /> Inbox</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recently Visited */}
            <section className="mb-12">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Recently visited</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {recentPages.map((page) => (
                        <Link
                            key={page._id}
                            href={`/${page._id}`}
                            className="block p-4 rounded-xl border border-[var(--border)] bg-white dark:bg-[#252525] hover:bg-[var(--sidebar-hover)] transition-colors group flex flex-col h-32 relative overflow-hidden"
                        >
                            <div className="mb-auto">
                                {page.icon ? (
                                    <div className="text-3xl mb-2">{page.icon}</div>
                                ) : (
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-[#333] rounded flex items-center justify-center mb-3 text-xl">
                                        📄
                                    </div>
                                )}
                                <div className="font-bold text-[var(--foreground)] truncate">{page.title || 'Untitled'}</div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                <div className="w-4 h-4 bg-orange-500 rounded-full text-white flex items-center justify-center text-[10px]">V</div>
                                <span>{new Date(page.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                        </Link>
                    ))}
                    {/* Add New Page Card */}
                    <button className="p-4 rounded-xl border border-[var(--border)] border-dashed hover:bg-[var(--sidebar-hover)] transition-colors flex flex-col items-start justify-center text-gray-500 hover:text-[var(--foreground)]">
                        <div className="w-8 h-8 rounded flex items-center justify-center mb-3 border border-[var(--border)]">
                            +
                        </div>
                        <span className="font-medium">New page</span>
                    </button>
                </div>
            </section>

            {/* Learn */}
            <section>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">Learn</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-0 rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                        <div className="h-24 bg-gray-100 dark:bg-[#333] flex items-center justify-center">🧱</div>
                        <div className="p-3">
                            <div className="font-medium text-sm mb-1">What is a block?</div>
                            <div className="text-xs text-gray-400">2m read</div>
                        </div>
                    </div>
                    <div className="p-0 rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                        <div className="h-24 bg-gray-100 dark:bg-[#333] flex items-center justify-center">📝</div>
                        <div className="p-3">
                            <div className="font-medium text-sm mb-1">Create your first page</div>
                            <div className="text-xs text-gray-400">2m watch</div>
                        </div>
                    </div>
                    <div className="p-0 rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                        <div className="h-24 bg-gray-100 dark:bg-[#333] flex items-center justify-center">📑</div>
                        <div className="p-3">
                            <div className="font-medium text-sm mb-1">Create a subpage</div>
                            <div className="text-xs text-gray-400">2m read</div>
                        </div>
                    </div>
                    <div className="p-0 rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                        <div className="h-24 bg-gray-100 dark:bg-[#333] flex items-center justify-center">🎨</div>
                        <div className="p-3">
                            <div className="font-medium text-sm mb-1">Customize & style</div>
                            <div className="text-xs text-gray-400">9m read</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
