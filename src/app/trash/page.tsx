"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Search, User as UserIcon, Building, Trash2, RotateCcw, X } from 'lucide-react';
import Link from 'next/link';

interface TrashItem {
    _id: string;
    title: string;
    itemType: 'project' | 'page';
    deletedAt: string;
    deletedBy?: {
        name: string;
        email: string;
    };
}

export default function TrashPage() {
    const { accessToken, user } = useAuth();
    const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'project' | 'page'>('all');

    useEffect(() => {
        if (accessToken) {
            fetchTrashItems();
        }
    }, [accessToken]);

    const fetchTrashItems = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/trash', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setTrashItems(data);
            }
        } catch (error) {
            console.error('Failed to fetch trash items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id: string, type: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/trash/${id}/restore`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type }),
            });

            if (res.ok) {
                setTrashItems(trashItems.filter(item => item._id !== id));
            }
        } catch (error) {
            console.error('Failed to restore item:', error);
        }
    };

    const handlePermanentDelete = async (id: string, type: string) => {
        if (!confirm('Permanently delete this item? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/trash/${id}?type=${type}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                setTrashItems(trashItems.filter(item => item._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const filteredItems = trashItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || item.itemType === filterType;
        return matchesSearch && matchesType;
    });

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Go to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Trash</h1>
                <p className="text-sm text-gray-500">Items in trash will be permanently deleted after 30 days</p>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search pages in Trash"
                        className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-3 py-1.5 text-sm rounded ${filterType === 'all' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterType('page')}
                        className={`px-3 py-1.5 text-sm rounded ${filterType === 'page' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                    >
                        Pages
                    </button>
                    <button
                        onClick={() => setFilterType('project')}
                        className={`px-3 py-1.5 text-sm rounded ${filterType === 'project' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                    >
                        Projects
                    </button>
                </div>
            </div>

            {/* Trash Items */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <Trash2 className="w-16 h-16 mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No results</h3>
                    <p className="text-sm">Your trash is empty</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredItems.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center justify-between p-4 bg-white dark:bg-[#202020] border border-[var(--border)] rounded-lg hover:shadow-sm transition-shadow"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className="text-2xl">
                                    {item.itemType === 'project' ? '📁' : '📄'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.title}</h3>
                                    <p className="text-xs text-gray-500">
                                        Deleted {new Date(item.deletedAt).toLocaleDateString()}
                                        {item.deletedBy && ` by ${item.deletedBy.name}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleRestore(item._id, item.itemType)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                    title="Restore"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Restore
                                </button>
                                <button
                                    onClick={() => handlePermanentDelete(item._id, item.itemType)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                    title="Delete permanently"
                                >
                                    <X className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-[var(--border)] text-center text-sm text-gray-500">
                Pages in Trash for over 30 days will be automatically deleted
            </div>
        </div>
    );
}
