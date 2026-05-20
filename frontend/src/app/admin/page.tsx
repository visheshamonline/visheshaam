'use client';
import { useState } from 'react';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';

export default function AdminPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [secret, setSecret] = useState('');

  const trigger = async (action: string) => {
    setStatus('loading');
    try {
      const res = await fetch(`/api/admin/${action}`, {
        method: 'POST',
        headers: { 'x-admin-secret': secret },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(data.message);
      setStatus('success');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Error');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-black mb-2 text-gray-900 dark:text-white">Admin</h1>
      <p className="text-gray-500 mb-8 text-sm">Trigger scrape and AI jobs manually</p>

      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Admin Secret</label>
        <input
          type="password"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Enter admin secret"
        />
      </div>

      <div className="flex flex-col gap-3">
        {['scrape', 'summarize', 'cleanup'].map(action => (
          <button
            key={action}
            onClick={() => trigger(action)}
            disabled={status === 'loading' || !secret}
            className="flex items-center justify-between px-5 py-3 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] hover:border-brand-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-semibold capitalize text-gray-900 dark:text-white">{action}</span>
            <RefreshCw size={16} className={`text-gray-400 ${status === 'loading' ? 'animate-spin' : ''}`} />
          </button>
        ))}
      </div>

      {message && (
        <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${status === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
          {status === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span className="text-sm">{message}</span>
        </div>
      )}
    </div>
  );
}
