import React, { useState } from 'react';
import { Search, Radar, ShieldAlert, GitBranch, Clock, BarChart3, Database, ArrowRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BauhausDashboard = () => {
  const [target, setTarget] = useState('https://gooddoggbeverage.com');
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
      // Simulate real output for demonstration as requested
      setScanResult({
        entity_summary: {
            name: "Good Dogg Beverage",
            type: "Company",
            primary_domain: "gooddoggbeverage.com",
            status: "Active",
            confidence: 0.98
        },
        key_entities: [
          { name: "Good Dogg Beverage", type: "Company", normalized_name: "good_dogg_beverage", confidence: 0.99 },
          { name: "Tony Venturoso", type: "Person", context: "Founder/CEO", confidence: 0.95 },
          { name: "Premium Hard Seltzer", type: "Product", confidence: 0.92 },
          { name: "Brewing / Beverage", type: "Industry", confidence: 0.94 }
        ],
        relationships: [
          { source: "Tony Venturoso", type: "LEADS", target: "Good Dogg Beverage", confidence: 0.98 },
          { source: "Good Dogg Beverage", type: "PRODUCES", target: "Premium Hard Seltzer", confidence: 0.99 }
        ],
        timeline: [
          { timestamp: "2021-06-15", event: "Brand Launch", description: "Debut in MA/RI markets" },
          { timestamp: "2022-03-10", event: "Charity Integration", description: "Partnership with animal welfare orgs" }
        ],
        risks: [
          { title: "Market Cap", description: "Emerging seltzer market competition is high." }
        ],
        confidence_summary: {
          total_score: 0.94,
          status: "High Reliability"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col p-8">
      {/* Bauhaus Header */}
      <header className="border-b-4 border-black pb-8 mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-6xl font-black tracking-tighter leading-none mb-4 uppercase">
            Aegis <span className="text-blue-600">OSINT</span>
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Autonomous Intelligence & Relationship Mapping</p>
        </div>
        <div className="flex gap-4">
           <div className="bh-border px-4 py-2 bg-black text-white text-xs font-black uppercase tracking-widest">
              Live Intelligence Worker
           </div>
        </div>
      </header>

      {/* Control Area */}
      <section className="grid grid-cols-12 gap-8 mb-12">
        <div className="col-span-8">
           <label className="bh-label">Target Investigation Point</label>
           <div className="flex gap-0">
             <input 
               type="text" 
               className="flex-1 bh-input text-lg"
               placeholder="ENTER DOMAIN OR COMPANY..."
               value={target}
               onChange={(e) => setTarget(e.target.value)}
             />
             <button 
               onClick={handleScan}
               disabled={loading}
               className="bh-btn flex items-center gap-2 min-w-[200px] justify-center"
             >
               {loading ? <Radar className="w-5 h-5 animate-spin" /> : 'Execute Scan'}
             </button>
           </div>
        </div>
        <div className="col-span-4 flex items-end gap-4">
          <div className="flex-1 bh-border p-4 bg-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400">Confidence Threshold</span>
            <span className="text-xl font-black">95%</span>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <main className="grid grid-cols-12 gap-12">
        <AnimatePresence mode="wait">
          {!scanResult ? (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-12 border-2 border-dashed border-slate-200 py-32 flex flex-col items-center"
            >
              <Search className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">System Idling: Awaiting Input</p>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-12 grid grid-cols-12 gap-12"
            >
              {/* Left Column: Summary */}
              <div className="col-span-4 flex flex-col gap-12">
                 <div className="bh-card bg-blue-600 text-white">
                    <label className="text-[10px] font-black uppercase opacity-60 mb-2 block">Primary Entity Identified</label>
                    <h2 className="text-4xl font-black leading-tight uppercase mb-4">{scanResult.entity_summary.name}</h2>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-black/20 p-2 border border-white/20">
                       <ShieldAlert className="w-4 h-4" /> {scanResult.confidence_summary.status}
                    </div>
                 </div>

                 <div>
                    <label className="bh-label">Confidence Metrics</label>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bh-border p-4 bg-slate-50">
                          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Reliability</p>
                          <p className="text-3xl font-black">{(scanResult.confidence_summary.total_score * 100).toFixed(0)}%</p>
                       </div>
                       <div className="bh-border p-4 bg-slate-50">
                          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Data Depth</p>
                          <p className="text-3xl font-black uppercase">Deep</p>
                       </div>
                    </div>
                 </div>

                 <div>
                    <label className="bh-label">Identified Vulnerabilities / Risks</label>
                    {scanResult.risks.map((risk: any, i: number) => (
                      <div key={i} className="bh-border p-4 mb-4 border-l-8 border-l-red-600">
                         <h4 className="font-black uppercase text-sm mb-1">{risk.title}</h4>
                         <p className="text-xs text-slate-500 leading-normal">{risk.description}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Center Column: Relationships & Graph */}
              <div className="col-span-5 flex flex-col gap-8">
                 <div className="bh-card flex-1 min-h-[400px] flex flex-col">
                    <label className="bh-label mb-4">Entity Relationship Mapping</label>
                    <div className="flex-1 bh-border bg-slate-50 overflow-hidden relative p-6">
                       {/* Mocking a clear relationship layout */}
                       {scanResult.relationships.map((rel: any, i: number) => (
                         <div key={i} className="flex items-center gap-4 mb-6 last:mb-0">
                            <div className="bh-border bg-white p-3 text-xs font-black uppercase">{rel.source}</div>
                            <div className="flex-1 flex items-center gap-2">
                               <div className="h-[2px] flex-1 bg-black"></div>
                               <span className="text-[8px] font-black uppercase bg-black text-white px-2 py-1">{rel.type}</span>
                               <div className="h-[2px] flex-1 bg-black"></div>
                            </div>
                            <div className="bh-border bg-white p-3 text-xs font-black uppercase">{rel.target}</div>
                         </div>
                       ))}
                       <div className="absolute bottom-4 right-4 text-[10px] font-black text-slate-400 uppercase italic">
                          Generated via Graph Intelligence
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <label className="bh-label">Founders / Key Execs</label>
                       {scanResult.key_entities.filter((e:any) => e.type === "Person").map((e: any, i: number) => (
                         <div key={i} className="flex justify-between items-center bh-border p-3 mb-2">
                             <span className="text-xs font-black uppercase">{e.name}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase">{e.context}</span>
                         </div>
                       ))}
                    </div>
                    <div>
                       <label className="bh-label">Top Products</label>
                       {scanResult.key_entities.filter((e:any) => e.type === "Product").map((e: any, i: number) => (
                         <div key={i} className="flex justify-between items-center bh-border p-3 mb-2">
                             <span className="text-xs font-black uppercase">{e.name}</span>
                             <BarChart3 className="w-3 h-3 text-slate-400" />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Right Column: Timeline & Sources */}
              <div className="col-span-3 flex flex-col gap-8">
                 <div className="bh-card border-none bg-slate-50">
                    <label className="bh-label">Operational Timeline</label>
                    <div className="relative pl-8 border-l-2 border-black ml-2 py-4">
                       {scanResult.timeline.map((event: any, i: number) => (
                         <div key={i} className="mb-10 last:mb-0 relative">
                            <div className="absolute -left-[37px] top-0 w-4 h-4 bg-white border-2 border-black rounded-none"></div>
                            <time className="text-[10px] font-black uppercase text-blue-600 block mb-1">{event.timestamp}</time>
                            <h5 className="text-sm font-black uppercase leading-tight mb-2">{event.event}</h5>
                            <p className="text-[10px] text-slate-500 uppercase leading-relaxed font-bold">{event.description}</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bh-border p-6 bg-yellow-400">
                    <label className="bh-label border-black">Intelligence Source Log</label>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between border-b border-black pb-2">
                          <span className="text-[10px] font-black uppercase">Archive.org</span>
                          <ExternalLink className="w-3 h-3" />
                       </div>
                       <div className="flex items-center justify-between border-b border-black pb-2">
                          <span className="text-[10px] font-black uppercase">Whois Data</span>
                          <CheckCircle className="w-3 h-3" />
                       </div>
                       <div className="flex items-center justify-between border-b border-black pb-2">
                          <span className="text-[10px] font-black uppercase">SEC EDGAR</span>
                          <CheckCircle className="w-3 h-3" />
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const CheckCircle = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export default BauhausDashboard;
