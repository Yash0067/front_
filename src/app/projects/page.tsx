"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Loader2, Trash2, User, Calendar, ListChecks } from 'lucide-react';
import Link from 'next/link';
import AdvancedFilter from '@/components/AdvancedFilter';

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

export default function ProjectsPage() {
    const { accessToken, user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filters, setFilters] = useState<Record<string, string>>({});

    useEffect(() => {
        if (accessToken) {
            fetchProjects();
        }
    }, [accessToken]);

    useEffect(() => {
        // Apply filters
        let filtered = [...projects];

        if (filters.title) {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(filters.title.toLowerCase())
            );
        }

        if (filters.status) {
            filtered = filtered.filter(p => p.status === filters.status);
        }

        if (filters.priority) {
            filtered = filtered.filter(p => p.priority === filters.priority);
        }

        if (filters.assignee) {
            filtered = filtered.filter(p =>
                p.assignee?.name.toLowerCase().includes(filters.assignee.toLowerCase())
            );
        }

        setFilteredProjects(filtered);
    }, [projects, filters]);

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

    const createProject = async (title: string, description: string) => {
        try {
            const res = await fetch('http://localhost:5000/api/projects', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description, status: 'planning', priority: 'medium' }),
            });

            if (res.ok) {
                fetchProjects();
                setShowCreateModal(false);
            }
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    };

    const deleteProject = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm('Are you sure you want to delete this project?')) {
            return;
        }

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
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 min-h-screen bg-[var(--background)]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold">Projects</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full md:w-auto flex items-center justify-center md:justify-start gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base"
                >
                    <Plus className="w-4 h-4" />
                    New Project
                </button>
            </div>

            <div className="mb-6 overflow-x-auto">
                <AdvancedFilter
                    onFilterChange={setFilters}
                    filterOptions={[
                        { id: 'title', label: 'Project name', icon: <ListChecks className="w-4 h-4" />, type: 'text' },
                        { id: 'assignee', label: 'Assignee', icon: <User className="w-4 h-4" />, type: 'text' },
                        { id: 'status', label: 'Status', icon: <ListChecks className="w-4 h-4" />, type: 'select', options: ['planning', 'active', 'completed', 'archived'] },
                        { id: 'priority', label: 'Priority', icon: <ListChecks className="w-4 h-4" />, type: 'select', options: ['low', 'medium', 'high', 'urgent'] },
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProjects.map((project) => (
                    <div
                        key={project._id}
                        className="relative group p-6 bg-white dark:bg-[#202020] border border-[var(--border)] rounded-xl hover:shadow-lg transition-shadow"
                    >
                        <Link href={`/projects/${project._id}`} className="block">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold pr-8">{project.title}</h3>
                                <span className={`px-2 py-1 text-xs rounded ${project.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    project.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span className={`px-2 py-1 rounded ${project.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                    project.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    }`}>
                                    {project.priority}
                                </span>
                                {project.assignee && (
                                    <span>{project.assignee.name}</span>
                                )}
                            </div>
                        </Link>
                        <button
                            onClick={(e) => deleteProject(project._id, e)}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all text-red-600"
                            title="Delete project"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {showCreateModal && (
                <CreateProjectModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={createProject}
                />
            )}
        </div>
    );
}

function CreateProjectModal({ onClose, onCreate }: { onClose: () => void; onCreate: (title: string, description: string) => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(title, description);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-[#202020] rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Create New Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Project title"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Project description"
                            rows={3}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
