"use client";

import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskItem from './TaskItem';
import TaskDetail from './TaskDetail';
import DraggableBlock from './DraggableBlock';
import { Plus, Loader2 } from 'lucide-react';

interface Page {
    _id: string;
    title: string;
    content: any[];
    icon?: string;
    coverImage?: string;
    isPublic?: boolean;
}

interface EditorProps {
    pageId: string;
}

export default function Editor({ pageId }: EditorProps) {
    const [page, setPage] = useState<Page | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const titleRef = useRef<HTMLTextAreaElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchPage();
    }, [pageId]);

    const fetchPage = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:5000/api/pages/${pageId}`);
            if (!res.ok) throw new Error('Failed to fetch page');
            const data = await res.json();
            // Ensure all blocks have an ID
            if (data.content) {
                data.content = data.content.map((block: any) => ({
                    ...block,
                    _id: block._id || Math.random().toString(36).substr(2, 9)
                }));
            }
            setPage(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updatePage = async (updates: Partial<Page>) => {
        if (!page) return;
        setSaving(true);
        try {
            // Optimistic update
            setPage({ ...page, ...updates });

            await fetch(`http://localhost:5000/api/pages/${pageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
        } catch (error) {
            console.error('Failed to update page:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            if (!page) return;

            const oldIndex = page.content.findIndex((block) => block._id === active.id);
            const newIndex = page.content.findIndex((block) => block._id === over.id);

            const newContent = arrayMove(page.content, oldIndex, newIndex);
            updatePage({ content: newContent });
        }
    };

    const addBlock = (type: string = 'todo') => {
        const newBlock = {
            _id: Math.random().toString(36).substr(2, 9),
            type,
            content: '',
            checked: false,
            dueDate: null,
            status: 'Not started'
        };
        const newContent = [...(page?.content || []), newBlock];
        updatePage({ content: newContent });
    };

    const updateBlock = (index: number, updates: any) => {
        if (!page) return;
        const newContent = [...page.content];
        newContent[index] = { ...newContent[index], ...updates };
        updatePage({ content: newContent });

        if (selectedTask && page.content[index] === selectedTask) {
            setSelectedTask(newContent[index]);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updatePage({ title: e.target.value });
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handleIconChange = () => {
        const emojis = ['📝', '🏠', '🚀', '💡', '✅', '📅', '🎨', '⚙️'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        updatePage({ icon: randomEmoji });
    };

    const removeIcon = () => {
        updatePage({ icon: undefined });
    };

    const togglePublic = async () => {
        if (!page) return;
        const newIsPublic = !page.isPublic;
        await updatePage({ isPublic: newIsPublic });
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
        setShowShare(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!page) {
        return <div className="p-10 text-gray-500">Page not found</div>;
    }

    return (
        <div className="flex h-full">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto pt-32 pb-40 px-12 relative">
                    {/* Share Button */}
                    <div className="absolute top-8 right-12 flex gap-2">
                        <div className="relative">
                            <button
                                onClick={() => setShowShare(!showShare)}
                                className={`text-sm text-gray-500 hover:bg-gray-100 px-3 py-1 rounded transition-colors ${showShare ? 'bg-gray-100' : ''}`}
                            >
                                Share
                            </button>
                            {showShare && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#202020] border border-[var(--border)] rounded-md shadow-lg p-4 z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium">Share to web</span>
                                        <button
                                            onClick={togglePublic}
                                            className={`w-10 h-5 rounded-full transition-colors relative ${page.isPublic ? 'bg-blue-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${page.isPublic ? 'left-6' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    {page.isPublic && (
                                        <div className="flex gap-2">
                                            <input
                                                readOnly
                                                value={window.location.href}
                                                className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded flex-1 truncate"
                                            />
                                            <button
                                                onClick={copyLink}
                                                className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cover Image Placeholder */}
                    <div className="group relative mb-8 opacity-0 hover:opacity-100 transition-opacity">
                        <button className="text-xs text-gray-500 hover:bg-gray-100 px-2 py-1 rounded">
                            Add cover
                        </button>
                    </div>

                    {/* Icon */}
                    <div className="group relative mb-4">
                        {page.icon ? (
                            <div className="group/icon relative inline-block">
                                <div className="text-7xl cursor-pointer hover:bg-gray-100 rounded p-2 transition-colors" onClick={handleIconChange}>
                                    {page.icon}
                                </div>
                                <button
                                    onClick={removeIcon}
                                    className="absolute -top-2 -right-2 bg-white border shadow-sm rounded-full p-1 opacity-0 group-hover/icon:opacity-100 transition-opacity"
                                >
                                    <div className="w-3 h-3 text-gray-400">✕</div>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleIconChange}
                                className="text-xs text-gray-500 hover:bg-gray-100 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Add icon
                            </button>
                        )}
                    </div>

                    {/* Title */}
                    <textarea
                        ref={titleRef}
                        value={page.title}
                        onChange={handleTitleChange}
                        placeholder="Untitled"
                        className="w-full text-4xl font-bold text-[var(--foreground)] bg-transparent border-none outline-none resize-none placeholder:text-gray-300 overflow-hidden mb-8"
                        rows={1}
                        style={{ height: 'auto' }}
                    />

                    {/* Content Area - Draggable List */}
                    <div className="space-y-1">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={page.content?.map(block => block._id) || []}
                                strategy={verticalListSortingStrategy}
                            >
                                {page.content && page.content.map((block, index) => (
                                    <DraggableBlock key={block._id} id={block._id}>
                                        <TaskItem
                                            block={block}
                                            onUpdate={(updates) => updateBlock(index, updates)}
                                            onSelect={() => setSelectedTask(block)}
                                            isSelected={selectedTask === block}
                                        />
                                    </DraggableBlock>
                                ))}
                            </SortableContext>
                        </DndContext>

                        <button
                            onClick={() => addBlock()}
                            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100 transition-colors mt-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New task</span>
                        </button>
                    </div>

                    {saving && (
                        <div className="fixed bottom-4 right-4 text-xs text-gray-400">
                            Saving...
                        </div>
                    )}
                </div>
            </div>

            {/* Split View Detail Panel */}
            {selectedTask && (
                <TaskDetail
                    block={selectedTask}
                    onUpdate={(updates) => {
                        const index = page.content.indexOf(selectedTask);
                        if (index !== -1) updateBlock(index, updates);
                    }}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
}
