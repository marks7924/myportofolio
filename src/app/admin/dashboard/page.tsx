import { createServerSideClient } from '@/lib/supabase';
import { FolderGit, Mail, BrainCircuit, Briefcase, Calendar, Bell, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardOverviewPage() {
  const supabase = await createServerSideClient();

  // Load stats counts and logs in parallel
  const [
    projectsRes,
    messagesRes,
    unreadMessagesRes,
    skillsRes,
    experienceRes,
    recentMessagesRes,
    activityLogsRes,
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
    supabase.from('skills').select('*', { count: 'exact', head: true }),
    supabase.from('experience').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(4),
    supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(6),
  ]);

  const stats = [
    { label: 'Projects', value: projectsRes.count || 0, icon: <FolderGit size={24} className="text-blue-500" /> },
    { label: 'Total Messages', value: messagesRes.count || 0, icon: <Mail size={24} className="text-purple-500" /> },
    { label: 'Unread Messages', value: unreadMessagesRes.count || 0, icon: <MessageSquare size={24} className="text-red-500" />, highlight: (unreadMessagesRes.count || 0) > 0 },
    { label: 'Skills Registered', value: skillsRes.count || 0, icon: <BrainCircuit size={24} className="text-green-500" /> },
    { label: 'Work Experience', value: experienceRes.count || 0, icon: <Briefcase size={24} className="text-orange-500" /> },
  ];

  const recentMessages = recentMessagesRes.data || [];
  const logs = activityLogsRes.data || [];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back! Here is a summary of your portfolio state.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`glass-card p-6 flex flex-col justify-between space-y-4 hover:scale-[1.01] transition-transform duration-300 ${
              stat.highlight ? 'border-red-500/20 bg-red-500/5' : ''
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
              {stat.icon}
            </div>
            <div>
              <span className="text-3xl font-extrabold">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Primary details list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Recent Messages */}
        <div className="lg:col-span-7 glass-card p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-border/40 pb-4">
            <h3 className="font-bold text-lg flex items-center space-x-2">
              <Mail size={20} className="text-primary" />
              <span>Recent Messages</span>
            </h3>
            <Link
              href="/admin/dashboard/messages"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View Inbox
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No messages received yet.
            </div>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col space-y-2 ${
                    msg.status === 'unread'
                      ? 'border-primary/25 bg-primary/5 font-medium'
                      : 'border-border bg-secondary/20 text-muted-foreground'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-foreground">{msg.name}</span>
                    <span className="text-[10px] text-muted-foreground">{formatDate(msg.created_at)}</span>
                  </div>
                  <div className="text-xs font-bold text-primary">{msg.subject}</div>
                  <div className="text-xs line-clamp-2 text-muted-foreground/80">{msg.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Activity Logs */}
        <div className="lg:col-span-5 glass-card p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-border/40 pb-4">
            <h3 className="font-bold text-lg flex items-center space-x-2">
              <Bell size={20} className="text-primary" />
              <span>Recent Activity Logs</span>
            </h3>
          </div>

          {logs.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No activity logs recorded.
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 text-xs leading-normal">
                  <div className="p-1.5 rounded-full bg-secondary border border-border mt-0.5">
                    <Calendar size={12} className="text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-foreground font-medium">
                      {log.action}
                    </p>
                    {log.details && (
                      <p className="text-muted-foreground text-[10px]">
                        {log.details}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground/60">
                      {formatDate(log.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
