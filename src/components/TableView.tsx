"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Settings, Eye, Filter as FilterIcon, ArrowUpDown, Layers, Palette, Link as LinkIcon, MoreHorizontal, Lock } from 'lucide-react';

interface Column {
    id: string;
    name: string;
    type: 'text' | 'select' | 'date' | 'person' | 'number';
    visible: boolean;
}

interface TableViewProps {
    data: any[];
    onUpdate: (id: string, field: string, value: any) => void;
    onDelete: (id: string) => void;
}

export default function TableView({ data, onUpdate, onDelete }: TableViewProps) {
    const [columns, setColumns] = useState<Column[]>([
        { id: 'title', name: 'Name', type: 'text', visible: true },
        { id: 'status', name: 'Status', type: 'select', visible: true },
        { id: 'priority', name: 'Priority', type: 'select', visible: true },
        { id: 'assignee', name: 'Assignee', type: 'person', visible: true },
    ]);
    const [showSettings, setShowSettings] = useState(false);
    const [viewName, setViewName] = useState('Table');

    const visibleColumns = columns.filter(c => c.visible);

    return (
        <div className="relative">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        📊 {viewName}
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors" title="Filter">
                        <FilterIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors" title="Sort">
                        <ArrowUpDown className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors" title="Group">
                        <Layers className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                        title="Settings"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition-colors">
                        <Plus className="w-4 h-4" />
                        New
                    </button>
                </div>
            </div>

            <div className="flex gap-4">
                {/* Table */}
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border)]">
                                <th className="w-8 p-2"></th>
                                {visibleColumns.map(col => (
                                    <th key={col.id} className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {col.name}
                                    </th>
                                ))}
                                <th className="w-24 p-2">
                                    <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
                                        <Plus className="w-3 h-3" />
                                        Add property
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, idx) => (
                                <tr key={row._id || idx} className="border-b border-[var(--border)] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="p-2 text-center text-gray-400">{idx + 1}</td>
                                    {visibleColumns.map(col => (
                                        <td key={col.id} className="p-3">
                                            {col.type === 'text' && (
                                                <input
                                                    type="text"
                                                    value={row[col.id] || ''}
                                                    onChange={(e) => onUpdate(row._id, col.id, e.target.value)}
                                                    className="w-full bg-transparent outline-none"
                                                    placeholder={`Empty ${col.name.toLowerCase()}`}
                                                />
                                            )}
                                            {col.type === 'select' && (
                                                <select
                                                    value={row[col.id] || ''}
                                                    onChange={(e) => onUpdate(row._id, col.id, e.target.value)}
                                                    className="bg-transparent outline-none text-sm px-2 py-1 rounded"
                                                >
                                                    <option value="">Select...</option>
                                                    {col.id === 'status' && (
                                                        <>
                                                            <option value="planning">Planning</option>
                                                            <option value="active">Active</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="archived">Archived</option>
                                                        </>
                                                    )}
                                                    {col.id === 'priority' && (
                                                        <>
                                                            <option value="low">Low</option>
                                                            <option value="medium">Medium</option>
                                                            <option value="high">High</option>
                                                            <option value="urgent">Urgent</option>
                                                        </>
                                                    )}
                                                </select>
                                            )}
                                            {col.type === 'person' && (
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {row.assignee?.name || 'Unassigned'}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                    <td className="p-2"></td>
                                </tr>
                            ))}
                            <tr className="border-b border-[var(--border)]">
                                <td colSpan={visibleColumns.length + 2} className="p-3">
                                    <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        New page
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                    <div className="w-80 bg-white dark:bg-[#202020] border border-[var(--border)] rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">View settings</h3>
                            <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">
                                ×
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">View name</span>
                                </div>
                                <span className="text-sm text-gray-500">{viewName}</span>
                            </div>

                            <div className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">Layout</span>
                                </div>
                                <span className="text-sm text-gray-500">Table →</span>
                            </div>

                            <div className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">Property visibility</span>
                                </div>
                                <span className="text-sm text-gray-500">{visibleColumns.length} →</span>
                            </div>

                            <div className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <FilterIcon className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">Filter</span>
                                </div>
                                <span className="text-sm text-gray-500">→</span>
                            </div>

                            <div className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">Sort</span>
                                </div>
                                <span className="text-sm text-gray-500">→</span>
                            </div>

                            <div className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">Group</span>
                                </div>
                                <span className="text-sm text-gray-500">→</span>
                            </div>

                            <div className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">Conditional color</span>
                                </div>
                                <span className="text-sm text-gray-500">→</span>
                            </div>

                            <div className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">Copy link to view</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[var(--border)] pt-3 mt-3 space-y-2">
                            <div className="text-xs font-semibold text-gray-500 px-2">Data source settings</div>

                            <div className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">Edit properties</span>
                                </div>
                                <span className="text-sm text-gray-500">→</span>
                            </div>

                            <div className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">More settings</span>
                                </div>
                                <span className="text-sm text-gray-500">→</span>
                            </div>

                            <div className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">Lock database</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
