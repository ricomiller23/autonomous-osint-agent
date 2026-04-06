import React, { useState } from 'react';
import { Search, Radar, ShieldAlert, GitBranch, Clock, BarChart3, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleScan = async () => {
    if (!target) return;
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target })
      });
      const data = await response.json();
      setScanResult(data);
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <Radar className="w-8 h-8 text-blue-500 animate-pulse" />
          <h1 className="text-xl font-bold tracking-tight">AEGIS OSINT</h1>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { icon: BarChart3, label: 'Overview' },
            { icon: Database, label: 'Entities' },
            { icon: GitBranch, label: 'Graph Map' },
            { icon: Clock, label: 'Timeline' },
            { icon: ShieldAlert, label: 'Risks' },
          ].map((item) => (
            <button key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-all text-slate-400 hover:text-slate-100 group">
              <item.icon className="w-5 h-5 group-hover:text-blue-400" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/20 backdrop-blur-md">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Enter domain, company, or target name..."
                className="w-full bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              />
            </div>
            <button 
              onClick={handleScan}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 px-6 py-2 rounded-full text-sm font-semibold transition-all glow flex items-center gap-2"
            >
              {loading ? <><Radar className="w-4 h-4 animate-spin" /> Analyzing...</> : 'Scan Target'}
            </button>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">System Ready</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 p-8 overflow-y-auto grid grid-cols-12 gap-6">
          {/* Welcome Card */}
          <div className="col-span-12 glass p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
             <Radar className="w-16 h-16 text-blue-500 mb-6 opacity-20" />
             <h2 className="text-2xl font-light text-slate-400">Initialize a scan to begin intelligence gathering</h2>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
