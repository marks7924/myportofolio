'use client';

import React, { useState } from 'react';
import { updateMessageStatus, deleteMessage } from '@/app/actions/messages';
import { Search, Mail, MailOpen, Archive, Trash2, Download, ExternalLink, Phone, Calendar, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  created_at: string;
}

interface MessagesManagerProps {
  initialMessages: Message[];
}

export default function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [activeMsgId, setActiveMsgId] = useState<string | null>(null);

  const activeMsg = messages.find((m) => m.id === activeMsgId);

  const processedMessages = messages.filter((msg) => {
    const matchesFilter = filter === 'all' ? true : msg.status === filter;
    const matchesSearch =
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.subject.toLowerCase().includes(search.toLowerCase()) ||
      msg.message.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusUpdate = async (id: string, newStatus: 'unread' | 'read' | 'archived') => {
    const res = await updateMessageStatus(id, newStatus);
    if (res.success) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message permanently?')) {
      const res = await deleteMessage(id);
      if (res.success) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
        if (activeMsgId === id) setActiveMsgId(null);
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Date'];
    const rows = processedMessages.map((msg) => [
      msg.name,
      msg.email,
      msg.phone || '',
      msg.subject,
      msg.message,
      msg.status,
      new Date(msg.created_at).toISOString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [
        headers.join(','),
        ...rows.map((row) =>
          row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `messages_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Inbox Messages</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage inquiries, feedback, and project proposals.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-xl border border-border flex items-center space-x-2 transition-all cursor-pointer text-sm"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sender, email, subject, keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {(['all', 'unread', 'read', 'archived'] as const).map((tFilter) => (
            <button
              key={tFilter}
              onClick={() => setFilter(tFilter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all duration-300 flex-shrink-0 ${
                filter === tFilter
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary/40 hover:bg-secondary border-border text-foreground/80'
              }`}
            >
              {tFilter}
            </button>
          ))}
        </div>
      </div>

      {/* List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List side */}
        <div className={`glass-card p-6 space-y-4 lg:col-span-6 ${activeMsgId ? 'hidden lg:block' : ''}`}>
          <h2 className="font-bold border-b border-border/40 pb-3 text-sm uppercase tracking-wider text-muted-foreground">
            Messages ({processedMessages.length})
          </h2>

          {processedMessages.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No matching messages found.
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[550px] pr-2">
              {processedMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setActiveMsgId(msg.id);
                    if (msg.status === 'unread') handleStatusUpdate(msg.id, 'read');
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col space-y-2 hover:border-primary/45 ${
                    activeMsgId === msg.id
                      ? 'border-primary bg-primary/5'
                      : msg.status === 'unread'
                      ? 'border-primary/25 bg-primary/5 font-semibold'
                      : 'border-border bg-secondary/10'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{msg.name}</span>
                    <span>{formatDate(msg.created_at)}</span>
                  </div>
                  <div className="text-sm font-bold text-foreground truncate">{msg.subject}</div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details side */}
        <div
          className={`glass-card p-6 md:p-8 space-y-6 lg:col-span-6 ${
            !activeMsgId
              ? 'hidden lg:flex items-center justify-center py-20 text-muted-foreground text-sm'
              : 'block'
          }`}
        >
          {activeMsg ? (
            <div className="space-y-6">
              <button
                onClick={() => setActiveMsgId(null)}
                className="lg:hidden flex items-center space-x-2 text-xs font-semibold text-muted-foreground mb-4"
              >
                <ArrowLeft size={14} />
                <span>Back to List</span>
              </button>

              <div className="flex flex-wrap justify-between items-start gap-4 border-b border-border/40 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{activeMsg.subject}</h2>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    <Calendar size={12} className="mr-1.5" />
                    {formatDate(activeMsg.created_at)}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleStatusUpdate(activeMsg.id, activeMsg.status === 'unread' ? 'read' : 'unread')
                    }
                    className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                    title={activeMsg.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                  >
                    {activeMsg.status === 'unread' ? <MailOpen size={16} /> : <Mail size={16} />}
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        activeMsg.id,
                        activeMsg.status === 'archived' ? 'read' : 'archived'
                      )
                    }
                    className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                    title={activeMsg.status === 'archived' ? 'Unarchive' : 'Archive'}
                  >
                    <Archive size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(activeMsg.id)}
                    className="p-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-secondary/35 border border-border/50 space-y-2 text-xs md:text-sm">
                <div>
                  <span className="text-muted-foreground font-semibold">From: </span>
                  <span className="font-bold text-foreground">{activeMsg.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-semibold">Email: </span>
                  <a href={`mailto:${activeMsg.email}`} className="text-primary hover:underline">
                    {activeMsg.email}
                  </a>
                </div>
                {activeMsg.phone && (
                  <div>
                    <span className="text-muted-foreground font-semibold">Phone: </span>
                    <span className="text-foreground ml-1">{activeMsg.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Message
                </h3>
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap text-foreground bg-secondary/10 p-6 rounded-xl border border-border/40">
                  {activeMsg.message}
                </p>
              </div>

              <a
                href={`mailto:${activeMsg.email}?subject=Re: ${activeMsg.subject}`}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all cursor-pointer"
              >
                <span>Reply by Email</span>
                <ExternalLink size={16} />
              </a>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Select a message to view details.</span>
          )}
        </div>
      </div>
    </div>
  );
}
