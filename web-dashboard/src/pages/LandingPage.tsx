import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Network, 
  Mic, 
  Smartphone, 
  Zap, 
  AlertTriangle, 
  ArrowRight,
  RefreshCw,
  GitBranch,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#030712] text-slate-100 min-h-screen font-sans selection:bg-emerald-500/30 selection:text-emerald-400 overflow-y-auto">
      
      {/* Header/Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-emerald-500/20 border border-emerald-400">
            ■
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wider text-slate-100 uppercase">
              Internet Black Box
            </h1>
            <span className="text-[9px] text-emerald-500 font-bold tracking-widest block uppercase">
              Incident Reconstructor
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-400">
          <button onClick={() => scrollToSection('problem')} className="hover:text-emerald-400 transition-colors">Problem</button>
          <button onClick={() => scrollToSection('solution')} className="hover:text-emerald-400 transition-colors">Solution</button>
          <button onClick={() => scrollToSection('works')} className="hover:text-emerald-400 transition-colors">How it works</button>
          <button onClick={() => scrollToSection('features')} className="hover:text-emerald-400 transition-colors">Features</button>
          <button onClick={() => scrollToSection('tech')} className="hover:text-emerald-400 transition-colors">Stack</button>
        </div>

        <Link
          to="/login"
          className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 border border-emerald-400 transition-all"
        >
          <span>Launch Dashboard</span>
          <ArrowRight size={14} />
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 md:py-36 px-6 max-w-6xl mx-auto text-center space-y-8">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-900/50 rounded-full text-[10px] font-bold tracking-wider text-emerald-400 uppercase animate-pulse">
          <Shield size={12} />
          <span>Passive Evidence Ingestion Engine</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 drop-shadow-sm">Aircraft Black Box</span> for Software Teams
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Passively record Git commits, Slack discussions, and Sentry alerts. Traverse digital evidence causal chains, and reconstruct incident timelines in minutes.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link
            to="/login"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/25 border border-emerald-400 transition-all"
          >
            <span>Launch Dashboard</span>
            <ArrowRight size={16} />
          </Link>
          <button
            onClick={() => scrollToSection('problem')}
            className="w-full sm:w-auto px-6 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-900 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 bg-slate-950/40 border-t border-slate-950 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="p-2.5 bg-red-950/40 border border-red-900/50 rounded-xl text-red-500 w-fit">
              <AlertTriangle size={20} />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Software breakdowns are forensic archaeology.
            </h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed space-y-4">
              When a production outage spikes at 3 AM, engineers waste hours digging through fragmented silos. Code logs (Git), team context (Slack), alerts (Sentry), and tasks (Jira) are isolated.
            </p>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              No one can answer: **"What discussion caused what code modification that triggered what error?"** Reconstructing causality manually takes days of guesswork.
            </p>
          </div>

          <div className="glass border border-slate-900 rounded-2xl p-6 space-y-4 bg-slate-900/10">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">fragmented diagnostic files</div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between text-slate-400">
                <span className="flex items-center space-x-2">
                  <GitBranch size={14} className="text-purple-400" />
                  <span>Commit: Auth Token validator refactored</span>
                </span>
                <span className="text-[10px] text-slate-600">No context</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between text-slate-400">
                <span className="flex items-center space-x-2">
                  <MessageSquare size={14} className="text-cyan-400" />
                  <span>Slack: "latency spiking on checkout..."</span>
                </span>
                <span className="text-[10px] text-slate-600">Unlinked</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between text-slate-400">
                <span className="flex items-center space-x-2">
                  <AlertCircle size={14} className="text-rose-400" />
                  <span>Sentry: JsonWebTokenError (signature)</span>
                </span>
                <span className="text-[10px] text-slate-600">Raw logs</span>
              </div>
            </div>
            <div className="text-[11px] text-center text-rose-400 font-semibold bg-rose-950/20 border border-rose-900/30 py-2.5 rounded-lg">
              ✕ No causal link between digital footprints
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 px-6 border-t border-slate-950 relative">
        <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 glass border border-slate-900 rounded-2xl p-6 bg-slate-900/10 space-y-4">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Neo4j Causal Event Graph</div>
            <div className="border border-slate-900 rounded-xl p-4 bg-slate-950 space-y-3.5 text-[11px] font-mono text-slate-300">
              <div className="flex items-center space-x-2 text-cyan-400">
                <span>(Person: Sarah)</span>
                <span className="text-slate-600">── AUTHORED ──▶</span>
                <span>(Event: PR #92)</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-400 pl-4 border-l border-slate-900">
                <span>(Event: PR #92)</span>
                <span className="text-slate-600">── TRIGGERED ──▶</span>
                <span>(Event: Deployment)</span>
              </div>
              <div className="flex items-center space-x-2 text-rose-400 pl-8 border-l border-slate-900">
                <span>(Event: Deployment)</span>
                <span className="text-slate-600">── AFFECTED ──▶</span>
                <span>(System: API)</span>
              </div>
            </div>
            <div className="text-[11px] text-center text-emerald-400 font-semibold bg-emerald-950/20 border border-emerald-900/30 py-2.5 rounded-lg">
              ✔ Causal lineage mapped automatically
            </div>
          </div>

          <div className="order-1 md:order-2 space-y-6">
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-emerald-500 w-fit">
              <Zap size={20} />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Always-on causal reconstruction.
            </h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed space-y-4">
              Internet Black Box passively runs in the background. It maps every event—commits, PR mergers, Slack logs, Sentry errors—into a **causal graph stored in Neo4j AuraDB**.
            </p>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              When an outage breaks, our AI traverses shortest causal pathways, identifies dependencies, and builds an accurate timeline of the incident with cited evidence and root causes.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="works" className="py-20 bg-slate-950/40 border-t border-slate-950 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">Reconstruct incidents automatically in four straightforward stages.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass border border-slate-900 rounded-xl p-5 space-y-3.5 hover:border-slate-800 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-emerald-400 font-mono">
                01
              </div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Collect Events</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Ingestors capture commits, PR status modifications, Slack alerts, and Sentry exceptions in real-time.
              </p>
            </div>

            <div className="glass border border-slate-900 rounded-xl p-5 space-y-3.5 hover:border-slate-800 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-emerald-400 font-mono">
                02
              </div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Build Graph</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Normalise data and batch-write to Neo4j. Link entities via authorship, response logs, and system effects.
              </p>
            </div>

            <div className="glass border border-slate-900 rounded-xl p-5 space-y-3.5 hover:border-slate-800 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-emerald-400 font-mono">
                03
              </div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Investigation</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Extract the incident subgraph time window and execute shortest-path causal traversals using AI models.
              </p>
            </div>

            <div className="glass border border-slate-900 rounded-xl p-5 space-y-3.5 hover:border-slate-800 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-emerald-400 font-mono">
                04
              </div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Timeline & Cause</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Deliver clean chronological timelines, root-cause diagnostics, and actionable prevention suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 border-t border-slate-950">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Engine Capabilities</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">Explore features designed to speed up resolution times.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass border border-slate-900 rounded-xl p-6 space-y-4 hover:bg-slate-900/10 transition-all">
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-emerald-500 w-fit">
                <RefreshCw size={18} />
              </div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Incident Reconstruction</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Compile fragmented event details into a unified narrative explaining how the outage developed from start to finish.
              </p>
            </div>

            <div className="glass border border-slate-900 rounded-xl p-6 space-y-4 hover:bg-slate-900/10 transition-all">
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-emerald-500 w-fit">
                <Shield size={18} />
              </div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Root Cause Analysis</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Pinpoint the exact triggering node (like a breaking commit or configuration rewrite) with percentage confidence scores.
              </p>
            </div>

            <div className="glass border border-slate-900 rounded-xl p-6 space-y-4 hover:bg-slate-900/10 transition-all">
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-emerald-500 w-fit">
                <Network size={18} />
              </div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Graph Visualization</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Render interactive subgraphs using Sigma.js. Zoom, drag, and click nodes to view system context immediately.
              </p>
            </div>

            <div className="glass border border-slate-900 rounded-xl p-6 space-y-4 hover:bg-slate-900/10 transition-all">
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-emerald-500 w-fit">
                <Mic size={18} />
              </div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Voice Queries</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Ask commands like "what went wrong yesterday?" in your native language via the Sarvam Voice API.
              </p>
            </div>

            <div className="glass border border-slate-900 rounded-xl p-6 space-y-4 hover:bg-slate-900/10 transition-all md:col-span-2">
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-emerald-500 w-fit">
                <Smartphone size={18} />
              </div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Mobile Alerts</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Send critical push notifications to on-call mobile applications equipped with initial diagnostic timelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-20 bg-slate-950/40 border-t border-slate-950 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">The Ecosystem</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">Standardised stack supporting microsecond ingestion latency and AI lookups.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
              <div className="text-emerald-500 text-xs font-bold font-mono">JAVA</div>
              <h4 className="text-xs font-semibold text-slate-200">Spring Boot</h4>
              <p className="text-[9px] text-slate-500">Backend Core API</p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
              <div className="text-emerald-500 text-xs font-bold font-mono">NEO4J</div>
              <h4 className="text-xs font-semibold text-slate-200">AuraDB</h4>
              <p className="text-[9px] text-slate-500">Causal Graph DB</p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
              <div className="text-emerald-500 text-xs font-bold font-mono">AI</div>
              <h4 className="text-xs font-semibold text-slate-200">Gemini</h4>
              <p className="text-[9px] text-slate-500">Reconstruction Engine</p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
              <div className="text-emerald-500 text-xs font-bold font-mono">REACT</div>
              <h4 className="text-xs font-semibold text-slate-200">Vite + TS</h4>
              <p className="text-[9px] text-slate-500">Dashboard UI</p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
              <div className="text-emerald-500 text-xs font-bold font-mono">MOBILE</div>
              <h4 className="text-xs font-semibold text-slate-200">Expo Native</h4>
              <p className="text-[9px] text-slate-500">On-Call Client</p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
              <div className="text-emerald-500 text-xs font-bold font-mono">VOICE</div>
              <h4 className="text-xs font-semibold text-slate-200">Sarvam AI</h4>
              <p className="text-[9px] text-slate-500">Multilingual STT/TTS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t border-slate-950 bg-slate-950 py-12 px-6 text-center text-xs text-slate-600">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2.5">
            <span className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center font-bold text-slate-950 text-[10px] border border-emerald-400">
              ■
            </span>
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              Internet Black Box — HackHazards '26
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-500 text-[11px]">
            <span>Developed by</span>
            <span className="font-semibold text-slate-400 hover:text-emerald-400 transition-colors">Team Member 2</span>
            <span>(Dashboard Engineer)</span>
          </div>

          <div className="text-[10px] font-mono text-slate-600">
            © 2026 Namespace Community. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
