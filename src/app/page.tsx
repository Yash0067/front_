"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import HomeDashboard from '@/components/HomeDashboard';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to signup/login if not authenticated after loading
    if (!loading && !user) {
      router.push('/register');
    }
  }, [user, loading, router]);

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

  // If no user and not loading, show the welcome page
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center max-w-md p-8">
          <div className="mb-8">
            <div className="w-16 h-16 bg-orange-500 rounded text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
              V
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Flux</h1>
          <p className="text-gray-500 mb-8">A powerful workspace for your projects and tasks</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-center"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 border border-[var(--border)] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If user exists, show home dashboard
  return <HomeDashboard />;
