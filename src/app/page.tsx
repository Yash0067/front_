"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import HomeDashboard from '@/components/HomeDashboard';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md p-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Flux</h1>
          <p className="text-gray-500 mb-8">A powerful workspace for your projects and tasks</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 border border-[var(--border)] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <HomeDashboard />;
}
