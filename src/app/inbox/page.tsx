"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Check, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Notification {
    _id: string;
    type: string;
    title: string;
    message: string;
    relatedId?: string;
    relatedType?: string;
    read: boolean;
    createdAt: string;
}

export default function InboxPage() {
    const { accessToken, user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        if (accessToken) {
            fetchNotifications();
        }
    }, [accessToken, filter]);

    const fetchNotifications = async () => {
        try {
            const url = filter === 'unread'
                ? 'http://localhost:5000/api/notifications?unreadOnly=true'
                : 'http://localhost:5000/api/notifications';

            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                setNotifications(notifications.map(n =>
                    n._id === id ? { ...n, read: true } : n
                ));
            }
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/notifications/mark-all-read', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                setNotifications(notifications.map(n => ({ ...n, read: true })));
            }
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                setNotifications(notifications.filter(n => n._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'task_assigned':
            case 'task_due':
                return '📋';
            case 'meeting':
                return '📅';
            case 'mention':
                return '@';
            case 'project_update':
                return '📁';
            case 'comment':
                return '💬';
            default:
                return '🔔';
        }
    };

    const getRelativeTime = (date: string) => {
        const now = new Date();
        const then = new Date(date);
        const diff = now.getTime() - then.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return then.toLocaleDateString();
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

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Bell className="w-8 h-8" />
                        Inbox
                    </h1>
                    {unreadCount > 0 && (
                        <p className="text-sm text-gray-500 mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'unread'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        Unread
                    </button>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Mark all read
                        </button>
                    )}
                </div>
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-16">
                    <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No notifications</h3>
                    <p className="text-gray-500">You're all caught up!</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`group p-4 rounded-lg border transition-colors ${notification.read
                                    ? 'bg-white dark:bg-[#202020] border-[var(--border)]'
                                    : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold mb-1">{notification.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>
                                    <p className="text-xs text-gray-500">{getRelativeTime(notification.createdAt)}</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!notification.read && (
                                        <button
                                            onClick={() => markAsRead(notification._id)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                            title="Mark as read"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notification._id)}
                                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors text-red-600"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
