'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/actions/auth';
import { AlertCircle, Lock, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);

    try {
      const response = await login(null, formData);

      if (response.success) {
        router.refresh();
        router.push('/admin/dashboard');
      } else {
        if (response.errors) {
          setFieldErrors(response.errors);
        } else if (response.error) {
          setError(response.error);
        }
      }
    } catch (err) {
      setError('An auth check error occurred. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Background glow design */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/20 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px]" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gradient tracking-wide uppercase font-en">
            CMS Admin Portal
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage portfolio layouts and translations
          </p>
        </div>

        <div className="glass-card p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm flex items-center space-x-2 rtl:space-x-reverse">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-foreground/80 flex items-center space-x-2">
                <Mail size={16} className="text-muted-foreground" />
                <span>Email Address</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@example.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-foreground"
              />
              {fieldErrors.email && (
                <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-foreground/80 flex items-center space-x-2">
                <Lock size={16} className="text-muted-foreground" />
                <span>Password</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-foreground"
              />
              {fieldErrors.password && (
                <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-[1.01] shadow-lg hover:shadow-primary/20 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
