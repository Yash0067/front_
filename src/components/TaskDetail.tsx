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
        <div className="w-96 border-l border-[var(--border)] bg-white dark:bg-[#202020] flex flex-col h-full animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button className="text-xs font-medium px-2 py-1 rounded hover:bg-[var(--sidebar-hover)] flex items-center gap-1">
                        <div className="w-3 h-3 border border-gray-400 rounded-sm" />
                        {block.title || 'Untitled'}
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onClose} className="p-1 hover:bg-[var(--sidebar-hover)] rounded text-gray-500">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <input
                    type="text"
                    value={block.content}
                    onChange={(e) => onUpdate({ content: e.target.value })}
                    className="text-3xl font-bold w-full bg-transparent outline-none mb-8"
                    placeholder="Task name"
                />

                {/* Properties */}
                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-8">
                        <div className="w-24 flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>Due date</span>
                        </div>
                        <input
                            type="date"
                            value={block.dueDate ? new Date(block.dueDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => onUpdate({ dueDate: e.target.value ? new Date(e.target.value) : null })}
                            className="text-sm bg-transparent outline-none hover:bg-[var(--sidebar-hover)] px-2 py-1 rounded cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="w-24 flex items-center gap-2 text-sm text-gray-500">
                            <Circle className="w-4 h-4" />
                            <span>Status</span>
                        </div>
                        <select
                            value={block.status}
                            onChange={(e) => onUpdate({ status: e.target.value })}
                            className="text-sm bg-transparent outline-none hover:bg-[var(--sidebar-hover)] px-2 py-1 rounded cursor-pointer appearance-none"
                        >
                            <option value="Not started">Not started</option>
                            <option value="In progress">In progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="w-24 flex items-center gap-2 text-sm text-gray-500">
                            <User className="w-4 h-4" />
                            <span>Assignee</span>
                        </div>
                        <div className="text-sm text-gray-400 px-2 py-1">Empty</div>
                    </div>
                </div>

                <div className="border-t border-[var(--border)] pt-6">
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-medium">Comments</span>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-6 h-6 bg-orange-500 rounded-full text-white flex items-center justify-center text-xs mt-1">V</div>
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
