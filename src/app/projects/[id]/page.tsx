"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Calendar, User, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Project {
    _id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignee?: {
        _id: string;
        name: string;
        email: string;
    };
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
}

export default function ProjectDetailPage() {
    const { accessToken, user } = useAuth();
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'planning',
        priority: 'medium',
    });

    useEffect(() => {
        if (accessToken && params.id) {
            fetchProject();
        }
    }, [accessToken, params.id]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/projects/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setProject(data);
                setFormData({
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    priority: data.priority,
                });
            } else {
                router.push('/projects');
            }
        } catch (error) {
            console.error('Failed to fetch project:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/projects/${params.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const updated = await res.json();
                setProject(updated);
                setEditing(false);
            }
        } catch (error) {
            console.error('Failed to update project:', error);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/projects/${params.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                router.push('/projects');
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
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Project not found</h2>
                    <Link href="/projects" className="text-blue-500 hover:underline">
                        Back to projects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <Link href="/projects" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to projects
            </Link>

            {editing ? (
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="planning">Planning</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleUpdate}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 text-sm rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        project.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    }`}>
                                    {project.status}
                                </span>
                                <span className={`px-3 py-1 text-sm rounded-full ${project.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                        project.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    }`}>
                                    {project.priority}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditing(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#202020] border border-[var(--border)] rounded-xl p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-3">Description</h2>
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                            {project.description || 'No description provided'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.assignee && (
                            <div className="bg-white dark:bg-[#202020] border border-[var(--border)] rounded-xl p-4">
                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm">Assignee</span>
                                </div>
                                <p className="font-medium">{project.assignee.name}</p>
                                <p className="text-sm text-gray-500">{project.assignee.email}</p>
                            </div>
                        )}
                        {(project.startDate || project.endDate) && (
                            <div className="bg-white dark:bg-[#202020] border border-[var(--border)] rounded-xl p-4">
                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">Timeline</span>
                                </div>
                                {project.startDate && (
                                    <p className="text-sm">Start: {new Date(project.startDate).toLocaleDateString()}</p>
                                )}
                                {project.endDate && (
                                    <p className="text-sm">End: {new Date(project.endDate).toLocaleDateString()}</p>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
