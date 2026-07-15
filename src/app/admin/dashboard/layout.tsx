'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import {
  LayoutDashboard,
  Sparkles,
  User,
  BrainCircuit,
  Briefcase,
  FolderGit,
  Hammer,
  MessageSquareQuote,
  Award,
  Mail,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Hero Section', path: '/admin/dashboard/hero', icon: <Sparkles size={18} /> },
    { label: 'About Section', path: '/admin/dashboard/about', icon: <User size={18} /> },
    { label: 'Skills', path: '/admin/dashboard/skills', icon: <BrainCircuit size={18} /> },
    { label: 'Experience', path: '/admin/dashboard/experience', icon: <Briefcase size={18} /> },
    { label: 'Projects', path: '/admin/dashboard/projects', icon: <FolderGit size={18} /> },
    { label: 'Services', path: '/admin/dashboard/services', icon: <Hammer size={18} /> },
    { label: 'Testimonials', path: '/admin/dashboard/testimonials', icon: <MessageSquareQuote size={18} /> },
    { label: 'Certifications', path: '/admin/dashboard/certifications', icon: <Award size={18} /> },
    { label: 'Messages Inbox', path: '/admin/dashboard/messages', icon: <Mail size={18} /> },
    { label: 'Media Library', path: '/admin/dashboard/media', icon: <ImageIcon size={18} /> },
    { label: 'Navbar Items', path: '/admin/dashboard/navigation', icon: <Compass size={18} /> },
    { label: 'Settings', path: '/admin/dashboard/settings', icon: <Settings size={18} /> },
  ];

  const handleSignOut = async () => {
    await logout();
    router.refresh();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-secondary/80 border-b border-border px-6 py-4 flex justify-between items-center z-30">
        <span className="font-bold text-gradient">CMS Admin</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-45 w-64 border-r border-border bg-secondary/35 flex flex-col justify-between py-6 px-4 transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } h-screen overflow-y-auto`}
      >
        <div className="space-y-8">
          <div className="px-3">
            <span className="font-bold text-lg text-gradient tracking-wide uppercase font-en">
              CMS Admin Dashboard
            </span>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sign Out CTA */}
        <div className="pt-4 border-t border-border/60">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 cursor-pointer"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
