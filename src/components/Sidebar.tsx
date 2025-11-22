"use client";

import React, { useState, useEffect } from 'react';
import { Home, Search, Inbox, Settings, ChevronRight, Plus, Sun, Moon, Sparkles, FolderKanban, CheckSquare, FileText, Trash, MoreHorizontal, Database, LogOut } from 'lucide-react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import TemplatesModal from './TemplatesModal';
import SearchModal from './SearchModal';

interface Page {
    _id: string;
    title: string;
    icon?: string;
}

export default function Sidebar() {
    const [pages, setPages] = useState<Page[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const { logout, user } = useAuth();

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const apiUrl = getApiUrl();
            const res = await fetch(`${apiUrl}/api/pages`);
            const data = await res.json();
            setPages(data);
        } catch (error) {
            console.error('Failed to fetch pages:', error);
        }
    };

    const handleCreatePage = async (template?: any) => {
        try {
            const body = template ? {
                title: template.title,
                icon: template.icon,
                content: template.content
            } : { title: 'Untitled' };

            const res = await fetch('http://localhost:5000/api/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const newPage = await res.json();
            setPages([newPage, ...pages]);
            setIsModalOpen(false);
            router.push(`/${newPage._id}`);
        } catch (error) {
            console.error('Failed to create page:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <>
            {/* Mobile menu button */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--sidebar-bg)] border-b border-[var(--border)] flex items-center px-4 z-50">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-[var(--sidebar-hover)] rounded transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <span className="ml-3 font-medium truncate">Flux</span>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "w-60 bg-[var(--sidebar-bg)] h-screen flex flex-col border-r border-[var(--border)] transition-colors duration-300 group/sidebar",
                "fixed md:relative z-40 md:z-auto",
                "left-0 top-0 md:top-auto",
                "pt-16 md:pt-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-3 hover:bg-[var(--sidebar-hover)] cursor-pointer transition-colors m-1 rounded-md">
                    <div className="flex items-center gap-2 font-medium text-sm text-[var(--foreground)]">
                        <div className="w-5 h-5 bg-orange-500 rounded text-white flex items-center justify-center text-xs">
                            V
                        </div>
                        <span className="truncate">Flux HQ</span>
                    </div>
                </div>

                <div className="flex flex-col px-2 py-1 gap-0.5">
                    <div onClick={() => setIsSearchOpen(true)} className="flex items-center gap-2 px-3 py-1 text-sm text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] rounded cursor-pointer text-gray-500 hover:text-[var(--foreground)]">
                        <Search className="w-4 h-4" />
                        <span>Search</span>
                    </div>
                    <Link href="/" className="flex items-center gap-2 px-3 py-1 text-sm text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] rounded cursor-pointer">
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                    </Link>
                    <Link href="/projects" className="flex items-center gap-2 px-3 py-1 text-sm text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] rounded cursor-pointer">
                        <FolderKanban className="w-4 h-4" />
                        <span>Projects</span>
                    </Link>
                    <Link href="/projects-table" className="flex items-center gap-2 px-3 py-1 text-sm text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] rounded cursor-pointer">
                        <Database className="w-4 h-4" />
                        <span>Projects Database</span>
                    </Link>
                    <Link href="/tasks" className="flex items-center gap-2 px-3 py-1 text-sm text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] rounded cursor-pointer">
                        <CheckSquare className="w-4 h-4" />
                        <span>Tasks</span>
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-1 text-sm text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] rounded cursor-pointer text-gray-500 hover:text-[var(--foreground)]">
                        <div className="w-4 h-4 flex items-center justify-center"><span className="text-purple-500 text-lg">✨</span></div>
                        <span>Flux AI</span>
                    </div>
                    <Link href="/inbox" className="flex items-center gap-2 px-3 py-1 text-sm text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] rounded cursor-pointer text-gray-500 hover:text-[var(--foreground)]">
                        <Inbox className="w-4 h-4" />
                        <span>Inbox</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-2 mt-2">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 mb-1 flex items-center justify-between group/header">
                        <span>Private</span>
                        <Plus className="w-3 h-3 opacity-0 group-hover/header:opacity-100 cursor-pointer hover:bg-gray-200 rounded" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }} />
                    </div>
                    {pages.map((page) => (
                        <Link
                            key={page._id}
                            href={`/${page._id}`}
                            className={cn(
                                "group flex items-center gap-2 px-3 py-1 min-h-[28px] text-sm text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] mx-1 rounded cursor-pointer transition-colors",
                                pathname === `/${page._id}` && "bg-[var(--sidebar-hover)] font-medium"
                            )}
                        >
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="truncate flex-1">{page.title || 'Untitled'}</span>
                            <MoreHorizontal className="w-3 h-3 opacity-0 group-hover:opacity-100 text-gray-400" />
                        </Link>
                    ))}
                    <div
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1 text-sm text-gray-500 hover:bg-[var(--sidebar-hover)] mx-1 rounded cursor-pointer transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add new</span>
                    </div>
                </div>

                <div className="p-2 border-t border-[var(--border)]">
                    <div className="text-xs font-semibold text-gray-500 px-3 py-2">
                        {user?.name || 'User'}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 text-sm text-gray-500 hover:bg-[var(--sidebar-hover)] rounded cursor-pointer mb-1" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                    </div>
                    <Link href="/trash" className="flex items-center gap-2 px-3 py-1 text-sm text-gray-500 hover:bg-[var(--sidebar-hover)] rounded cursor-pointer mb-1">
                        <Trash className="w-4 h-4" />
                        <span>Trash</span>
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-1 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <TemplatesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreatePage={handleCreatePage}
            />

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
}
