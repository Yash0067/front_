import React from 'react';
import { X, Calendar, Circle, User, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskDetailProps {
    block: any;
    onUpdate: (updates: any) => void;
    onClose: () => void;
}

export default function TaskDetail({ block, onUpdate, onClose }: TaskDetailProps) {
    if (!block) return null;

    return (
        <div className="fixed md:relative bottom-0 md:bottom-auto left-0 md:left-auto right-0 md:right-auto w-full md:w-96 max-h-96 md:max-h-none border-t md:border-t-0 md:border-l border-[var(--border)] bg-white dark:bg-[#202020] flex flex-col h-96 md:h-full animate-in slide-in-from-bottom md:slide-in-from-right duration-200 z-40 md:z-auto rounded-t-lg md:rounded-none">
            {/* Header */}
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-white dark:bg-[#202020]">
                <div className="flex items-center gap-2">
                    <button className="text-xs font-medium px-2 py-1 rounded hover:bg-[var(--sidebar-hover)] flex items-center gap-1 truncate">
                        <div className="w-3 h-3 border border-gray-400 rounded-sm flex-shrink-0" />
                        <span className="truncate">{block.title || 'Untitled'}</span>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onClose} className="p-1 hover:bg-[var(--sidebar-hover)] rounded text-gray-500 flex-shrink-0">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                <input
                    type="text"
                    value={block.content}
                    onChange={(e) => onUpdate({ content: e.target.value })}
                    className="text-xl md:text-3xl font-bold w-full bg-transparent outline-none"
                    placeholder="Task name"
                />

                {/* Properties */}
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                        <div className="flex items-center gap-2 text-sm text-gray-500 w-24">
                            <Calendar className="w-4 h-4" />
                            <span className="hidden md:inline">Due date</span>
                        </div>
                        <input
                            type="date"
                            value={block.dueDate ? new Date(block.dueDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => onUpdate({ dueDate: e.target.value ? new Date(e.target.value) : null })}
                            className="text-sm bg-transparent outline-none hover:bg-[var(--sidebar-hover)] px-2 py-1 rounded cursor-pointer flex-1"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                        <div className="flex items-center gap-2 text-sm text-gray-500 w-24">
                            <Circle className="w-4 h-4" />
                            <span className="hidden md:inline">Status</span>
                        </div>
                        <select
                            value={block.status}
                            onChange={(e) => onUpdate({ status: e.target.value })}
                            className="text-sm bg-transparent outline-none hover:bg-[var(--sidebar-hover)] px-2 py-1 rounded cursor-pointer appearance-none flex-1"
                        >
                            <option value="Not started">Not started</option>
                            <option value="In progress">In progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                        <div className="flex items-center gap-2 text-sm text-gray-500 w-24">
                            <User className="w-4 h-4" />
                            <span className="hidden md:inline">Assignee</span>
                        </div>
                        <div className="text-sm text-gray-400 px-2 py-1">Empty</div>
                    </div>
                </div>

                <div className="border-t border-[var(--border)] pt-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-medium">Comments</span>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-6 h-6 bg-orange-500 rounded-full text-white flex items-center justify-center text-xs mt-1 flex-shrink-0">V</div>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-1 text-sm bg-transparent outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
