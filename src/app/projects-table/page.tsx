"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';
import Link from 'next/link';
import TableView from '@/components/TableView';

interface Project {
    _id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignee?: {
        name: string;
        email: string;
    };
    startDate?: string;
    endDate?: string;
}

export default function ProjectsTablePage() {
    const { accessToken, user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

    useEffect(() => {
        if (accessToken) {
            fetchProjects();
        }
    }, [accessToken]);

    const fetchProjects = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/projects', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: string, field: string, value: any) => {
        try {
            const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: value }),
            });

            if (res.ok) {
                const updated = await res.json();
                setProjects(projects.map(p => p._id === id ? updated : p));
            }
        } catch (error) {
            console.error('Failed to update project:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this project?')) return;

        try {
            const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                setProjects(projects.filter(p => p._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Projects Database</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        title="Grid view"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded ${viewMode === 'table' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        title="Table view"
                    >
                        <TableIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <TableView
                data={projects}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />
        </div>
    );
}
