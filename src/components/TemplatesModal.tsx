"use client";

import React from 'react';
import { Search, FileText, Database, Sparkles, CheckSquare, Kanban, File, Lightbulb, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreatePage: (template?: any) => void;
}

export const TEMPLATES = {
    empty: {
        title: 'Untitled',
        content: []
    },
    database: {
        title: 'New Database',
        icon: '🗄️',
        content: [
            { type: 'heading1', content: 'Database' },
            { type: 'paragraph', content: 'A new database to organize your items.' },
            { type: 'todo', content: 'Item 1', checked: false, status: 'Not started' },
            { type: 'todo', content: 'Item 2', checked: false, status: 'Not started' },
            { type: 'todo', content: 'Item 3', checked: false, status: 'Not started' },
        ]
    },
    ai: {
        title: 'AI Generated Page',
        icon: '✨',
        content: [
            { type: 'heading1', content: 'AI Generated Content' },
            { type: 'paragraph', content: 'This page was created with Flux AI.' },
            { type: 'heading2', content: 'Summary' },
            { type: 'paragraph', content: 'Here is a summary of your request...' },
        ]
    },
    tasks: {
        title: 'Tasks Tracker',
        icon: '✅',
        content: [
            { type: 'heading1', content: 'Tasks Tracker' },
            { type: 'paragraph', content: 'Stay organized with tasks, your way.' },
            { type: 'heading2', content: 'To Do' },
            { type: 'todo', content: 'Review project proposal', checked: false, status: 'Not started', dueDate: new Date() },
            { type: 'todo', content: 'Email marketing team', checked: false, status: 'Not started' },
            { type: 'heading2', content: 'In Progress' },
            { type: 'todo', content: 'Schedule team meeting', checked: false, status: 'In progress' },
            { type: 'todo', content: 'Update documentation', checked: false, status: 'In progress' },
            { type: 'heading2', content: 'Done' },
            { type: 'todo', content: 'Setup project repo', checked: true, status: 'Done' },
        ]
    },
    projects: {
        title: 'Projects',
        icon: '🎯',
        content: [
            { type: 'heading1', content: 'Projects Board' },
            { type: 'paragraph', content: 'Manage projects start to finish.' },
            { type: 'heading2', content: 'Active Projects' },
            { type: 'todo', content: 'Q4 Roadmap', checked: false, status: 'In progress', dueDate: new Date(Date.now() + 86400000 * 30) },
            { type: 'todo', content: 'Website Redesign', checked: false, status: 'Not started' },
            { type: 'heading2', content: 'Backlog' },
            { type: 'todo', content: 'Mobile App Launch', checked: false, status: 'Not started' },
            { type: 'todo', content: 'User Research', checked: false, status: 'Not started' },
        ]
    },
    docs: {
        title: 'Document Hub',
        icon: '📄',
        content: [
            { type: 'heading1', content: 'Document Hub' },
            { type: 'paragraph', content: 'Collaborate on docs in one hub.' },
            { type: 'heading2', content: 'Engineering' },
            { type: 'paragraph', content: '📄 API Documentation' },
            { type: 'paragraph', content: '📄 Architecture Overview' },
            { type: 'heading2', content: 'Product' },
            { type: 'paragraph', content: '📄 Product Requirements (PRD)' },
            { type: 'paragraph', content: '📄 User Stories' },
            { type: 'heading2', content: 'Design' },
            { type: 'paragraph', content: '📄 Design System' },
        ]
    },
    brainstorm: {
        title: 'Brainstorm Session',
        icon: '💡',
        content: [
            { type: 'heading1', content: 'Brainstorm Session' },
            { type: 'paragraph', content: 'Spark new ideas together.' },
            { type: 'heading2', content: 'The Goal' },
            { type: 'paragraph', content: 'Generate ideas for the next marketing campaign.' },
            { type: 'heading2', content: 'Ideas' },
            { type: 'todo', content: 'Viral TikTok challenge', checked: false },
            { type: 'todo', content: 'Partnership with influencers', checked: false },
            { type: 'todo', content: 'Interactive webinar series', checked: false },
            { type: 'heading2', content: 'Action Items' },
            { type: 'todo', content: 'Research competitors', checked: false, status: 'Not started' },
        ]
    }
};

export default function TemplatesModal({ isOpen, onClose, onCreatePage }: TemplatesModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#191919] w-full max-w-5xl h-[80vh] rounded-xl border border-[#2f2f2f] shadow-2xl flex flex-col overflow-hidden text-[#d4d4d4]">
                {/* Header */}
                <div className="p-4 border-b border-[#2f2f2f] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Add to</span>
                        <div className="flex items-center gap-1 bg-[#2f2f2f] px-2 py-1 rounded text-white">
                            <div className="w-4 h-4 bg-orange-500 rounded text-[10px] flex items-center justify-center">V</div>
                            <span className="font-medium">Flux HQ</span>
                        </div>
                    </div>
                    <div className="flex-1 max-w-md relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-[#202020] border border-[#2f2f2f] rounded-md py-1.5 pl-9 pr-4 text-sm outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-[#2f2f2f] rounded transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Top Actions */}
                    <div className="grid grid-cols-3 gap-4 mb-12">
                        <button
                            onClick={() => onCreatePage(TEMPLATES.empty)}
                            className="flex flex-col items-center justify-center gap-3 p-6 bg-[#202020] hover:bg-[#2c2c2c] border border-[#2f2f2f] rounded-lg transition-colors group"
                        >
                            <FileText className="w-6 h-6 text-gray-400 group-hover:text-white" />
                            <span className="text-sm font-medium">Empty page</span>
                        </button>
                        <button
                            onClick={() => onCreatePage(TEMPLATES.database)}
                            className="flex flex-col items-center justify-center gap-3 p-6 bg-[#202020] hover:bg-[#2c2c2c] border border-[#2f2f2f] rounded-lg transition-colors group"
                        >
                            <Database className="w-6 h-6 text-gray-400 group-hover:text-white" />
                            <span className="text-sm font-medium">Empty database</span>
                        </button>
                        <button
                            onClick={() => onCreatePage(TEMPLATES.ai)}
                            className="flex flex-col items-center justify-center gap-3 p-6 bg-[#202020] hover:bg-[#2c2c2c] border border-[#2f2f2f] rounded-lg transition-colors group"
                        >
                            <Sparkles className="w-6 h-6 text-gray-400 group-hover:text-white" />
                            <span className="text-sm font-medium">Build with AI</span>
                        </button>
                    </div>

                    {/* Suggested Templates */}
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-400 mb-4">Suggested</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Tasks Tracker */}
                            <div
                                onClick={() => onCreatePage(TEMPLATES.tasks)}
                                className="bg-[#202020] hover:bg-[#2c2c2c] border border-[#2f2f2f] rounded-lg p-4 cursor-pointer transition-colors group"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckSquare className="w-4 h-4 text-green-500" />
                                    <span className="font-medium text-white">Tasks Tracker</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-4">Stay organized with tasks, your way.</p>
                                <div className="bg-[#191919] rounded p-3 border border-[#2f2f2f] opacity-50 group-hover:opacity-80 transition-opacity">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                                        <div className="h-2 w-20 bg-[#2f2f2f] rounded"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-full bg-[#2f2f2f] rounded"></div>
                                        <div className="h-2 w-3/4 bg-[#2f2f2f] rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Projects */}
                            <div
                                onClick={() => onCreatePage(TEMPLATES.projects)}
                                className="bg-[#202020] hover:bg-[#2c2c2c] border border-[#2f2f2f] rounded-lg p-4 cursor-pointer transition-colors group"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Kanban className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-white">Projects</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-4">Manage projects start to finish.</p>
                                <div className="bg-[#191919] rounded p-3 border border-[#2f2f2f] opacity-50 group-hover:opacity-80 transition-opacity">
                                    <div className="flex gap-2">
                                        <div className="flex-1 h-16 bg-[#2f2f2f] rounded"></div>
                                        <div className="flex-1 h-16 bg-[#2f2f2f] rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Document Hub */}
                            <div
                                onClick={() => onCreatePage(TEMPLATES.docs)}
                                className="bg-[#202020] hover:bg-[#2c2c2c] border border-[#2f2f2f] rounded-lg p-4 cursor-pointer transition-colors group"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <File className="w-4 h-4 text-red-500" />
                                    <span className="font-medium text-white">Document Hub</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-4">Collaborate on docs in one hub.</p>
                                <div className="bg-[#191919] rounded p-3 border border-[#2f2f2f] opacity-50 group-hover:opacity-80 transition-opacity">
                                    <div className="space-y-2">
                                        <div className="h-2 w-1/3 bg-[#2f2f2f] rounded mb-4"></div>
                                        <div className="h-2 w-full bg-[#2f2f2f] rounded"></div>
                                        <div className="h-2 w-full bg-[#2f2f2f] rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Brainstorm Session */}
                            <div
                                onClick={() => onCreatePage(TEMPLATES.brainstorm)}
                                className="bg-[#202020] hover:bg-[#2c2c2c] border border-[#2f2f2f] rounded-lg p-4 cursor-pointer transition-colors group"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                                    <span className="font-medium text-white">Brainstorm Session</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-4">Spark new ideas together.</p>
                                <div className="bg-[#191919] rounded p-3 border border-[#2f2f2f] opacity-50 group-hover:opacity-80 transition-opacity">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="h-8 bg-[#2f2f2f] rounded"></div>
                                        <div className="h-8 bg-[#2f2f2f] rounded"></div>
                                        <div className="h-8 bg-[#2f2f2f] rounded"></div>
                                        <div className="h-8 bg-[#2f2f2f] rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
