import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Network, 
  Mic, 
  Smartphone, 
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  GitBranch,
  MessageSquare,
  AlertCircle,
  Database,
  Sparkles,
  Play,
  Volume2,
  Layers,
  ArrowRightLeft,
  Cpu,
  Lock,
  HelpCircle,
  Activity,
  Layers3
} from 'lucide-react';

type Tab = 'walkthrough' | 'graph' | 'voice' | 'mobile';

interface TimelineStep {
  time: string;
  source: 'github' | 'slack' | 'sentry';
  title: string;
  desc: string;
  severity: 'info' | 'warning' | 'critical';
}

const simulationSteps: TimelineStep[] = [
  { time: '2:31 PM', source: 'github', title: 'PR #92 Merged', desc: 'Sarah Jenkins: "Refactor auth token validation and claim verification"', severity: 'info' },
  { time: '3:02 PM', source: 'github', title: 'Prod Deployment #412', desc: 'Deploying payment-service to production (SUCCESS)', severity: 'info' },
  { time: '3:12 PM', source: 'slack', title: '#on-call-devs: Latency check', desc: 'Raj Patel: "Anyone seeing increased latency on /checkout? Occasional timeouts in logs."', severity: 'warning' },
  { time: '3:32 PM', source: 'sentry', title: 'JWT Mismatch Errors', desc: 'JsonWebTokenError - "invalid signature" on payment-service /api/pay', severity: 'warning' },
  { time: '3:47 PM', source: 'sentry', title: '500 Error Spike Alert', desc: '500 error rate on /checkout spiked to 89% (Threshold: 5%)', severity: 'critical' },
];

const mockReport = {
  rootCause: 'JWT signature key encoding change broke backward compatibility with existing active user sessions.',
  confidence: '94%',
  people: [
    { name: 'Sarah Jenkins', role: 'Introduced Bug', action: 'Authored PR #92' },
    { name: 'Raj Patel', role: 'First Responder', action: 'Raised latency alert in Slack' },
    { name: 'Rahul Sharma', role: 'Incident Commander', action: 'Executed deployment rollback' }
  ],
  prevention: [
    'Unit tests checking token signing verification backwards compatibility.',
    'Canary deployments checking token verification on 1% instances first.',
    'Graceful middleware fallbacks (fallback redirects instead of raw 500s).'
  ]
};

export const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('walkthrough');
  const [simStep, setSimStep] = useState<number>(-1);
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [aiInvestigating, setAiInvestigating] = useState<boolean>(false);
  const [showReport, setShowReport] = useState<boolean>(false);
  const [graphMode, setGraphMode] = useState<'sql' | 'neo4j'>('neo4j');
  const [voiceLang, setVoiceLang] = useState<'en' | 'hi' | 'ta'>('en');
  const [voicePlaying, setVoicePlaying] = useState<boolean>(false);
  const [mobileScreen, setMobileScreen] = useState<'feed' | 'detail' | 'voice'>('feed');

  // Voice transcript mocks
  const voiceMocks = {
    en: {
      query: "What caused the checkout service outage yesterday?",
      transcription: "Querying black box index for payment-service on 2026-06-23...",
      response: "The payment-service experienced a 500 error spike to 89% caused by PR #92 auth validation changes, which broke compatibility for existing active JWTs. Reverted via rollback."
    },
    hi: {
      query: "कल पेमेंट सर्विस में खराबी क्यों आई थी?",
      transcription: "पेमेंट-सर्विस के ब्लैक बॉक्स इंडेक्स की जांच की जा रही है...",
      response: "पेमेंट-सर्विस में खराबी PR #92 के बदलावों के कारण आई थी, जिसने मौजूदा JWT टोकன் की कम्पैटिबिलिटी को प्रभावित किया। इसे रोलबैक करके ठीक किया गया।"
    },
    ta: {
      query: "நேற்று கட்டண சேவையில் என்ன பிரச்சனை ஏற்பட்டது?",
      transcription: "கட்டண சேவைக்கான பிளாக் பாக்ஸ் தரவுகளை ஆராய்கிறது...",
      response: "PR #92 மாற்றங்களால் பழைய JWT டோக்கன் சரிபார்ப்பு முறிந்தது, இதனால் 500 பிழைகள் உயர்ந்தன. முந்தைய பதிப்பிற்கு மாற்றியதன் மூலம் சரி செய்யப்பட்டது."
    }
  };

  const startSimulation = () => {
    setSimStep(-1);
    setShowReport(false);
    setAiInvestigating(false);
    setSimRunning(true);
  };

  useEffect(() => {
    if (!simRunning) return;

    if (simStep < simulationSteps.length - 1) {
      const timer = setTimeout(() => {
        setSimStep(prev => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        setSimRunning(false);
        setAiInvestigating(true);
      }, 0);
    }
  }, [simRunning, simStep]);

  useEffect(() => {
    if (!aiInvestigating) return;

    const timer = setTimeout(() => {
      setAiInvestigating(false);
      setShowReport(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [aiInvestigating]);

  // Audio wave animation support
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!voicePlaying || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    let animationId: number;
    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, 300, 40);
      ctx.fillStyle = '#10b981';
      for (let i = 0; i < 40; i++) {
        const height = Math.abs(Math.sin((i + frame) * 0.15) * 20) + 2;
        ctx.fillRect(i * 7 + 10, 20 - height / 2, 4, height);
      }
      frame++;
      animationId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationId);
  }, [voicePlaying]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const toggleVoicePlay = () => {
    if (!voicePlaying) {
      window.speechSynthesis?.cancel();
      const textToSpeak = voiceMocks[voiceLang].response;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      if (voiceLang === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (voiceLang === 'ta') {
        utterance.lang = 'ta-IN';
      } else {
        utterance.lang = 'en-US';
      }
      utterance.onend = () => {
        setVoicePlaying(false);
      };
      utterance.onerror = () => {
        setVoicePlaying(false);
      };
      window.speechSynthesis?.speak(utterance);
      setVoicePlaying(true);
    } else {
      window.speechSynthesis?.cancel();
      setVoicePlaying(false);
    }
  };

  return (
    <div className="  text-slate-100 min-h-screen font-sans overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] right-10 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Header/Navbar */}
      <header className="border-b border-none neu-flat/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/logo.svg" className="w-9 h-9 rounded-lg border border-emerald-500/30 object-cover shadow-lg shadow-emerald-500/10 animate-[pulse-glow_3s_infinite_ease-in-out]" alt="Internet Black Box Logo" />
          <div>
            <h1 className="text-sm font-semibold tracking-wider text-slate-100 uppercase">
              Internet Black Box
            </h1>
            <span className="text-[9px] text-emerald-500 font-bold tracking-widest block uppercase">
              Incident Reconstructor
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-slate-400">
          <a href="#problem" className="hover:text-emerald-400 transition-colors">Problem</a>
          <a href="#interactive-playground" className="hover:text-emerald-400 transition-colors">Interactive Demo</a>
          <a href="#graph-deep-dive" className="hover:text-emerald-400 transition-colors">Causal Graph</a>
          <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
          <a href="#integrations" className="hover:text-emerald-400 transition-colors">Integrations</a>
          <a href="#tech-spec" className="hover:text-emerald-400 transition-colors">Tech Spec</a>
          <a href="#security" className="hover:text-emerald-400 transition-colors">Security Compliance</a>
          <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
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
      <section className="relative pt-20 pb-16 px-6 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-900/50 rounded-full text-[10px] font-bold tracking-wider text-emerald-400 uppercase animate-pulse">
          <Shield size={12} />
          <span>Passive Evidence Ingestion Engine</span>
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-5xl mx-auto">
          The Causal <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 drop-shadow-sm">Aircraft Black Box</span> for Dev Teams
        </h1>

        <p className="text-sm md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Passively maps commits, Slack context, and Sentry alerts into a Neo4j causal graph. 
          When an outage strikes, our AI traces the evidence pathways to isolate the root cause in seconds.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link
            to="/login"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/25 border border-emerald-400 transition-all"
          >
            <span>Launch Dashboard</span>
            <ArrowRight size={16} />
          </Link>
          <a
            href="#interactive-playground"
            className="w-full sm:w-auto px-6 py-3.5 neu-flat hover:bg-slate-900 border border-none rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all block text-center"
          >
            Try Interactive Walkthrough
          </a>
        </div>

        {/* Floating dashboard preview badge */}
        <div className="pt-10 flex justify-center">
          <div className="relative p-1.5 neu-flat border border-none rounded-2xl max-w-4xl shadow-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-10 blur-xl" />
            <div className="neu-flat rounded-xl overflow-hidden border border-none p-4 flex items-center space-x-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <p className="text-xs text-slate-400 font-mono">
                Listening: <span className="text-emerald-400">git-repo:payment-service</span>, <span className="text-cyan-400">slack:#on-call-devs</span>, <span className="text-rose-400">sentry:alert-hook</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Forensic Problem Explainer */}
      <section id="problem" className="py-24 neu-flat/40 border-t border-slate-950 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="p-2.5 bg-red-950/40 border border-red-900/50 rounded-xl text-red-500 w-fit">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Software breakdowns are forensic archaeology.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              When a critical outage spikes at 3 AM, engineers are forced to manually parse logs, scan Git diffs, read old Slack threads, and verify ticket states. These systems are isolated, making tracing the direct causal relationship extremely slow and subjective.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-4 neu-flat border border-none rounded-xl space-y-2">
                <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block">System Blindspots</span>
                <p className="text-[11px] text-slate-400">Logs explain what broke (JsonWebTokenError), but not which PR author merged it or the discussion preceding it.</p>
              </div>
              <div className="p-4 neu-flat border border-none rounded-xl space-y-2">
                <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block">The Cost of Latency</span>
                <p className="text-[11px] text-slate-400">SaaS companies waste up to 4 hours per incident simply aligning timelines and creating post-mortems.</p>
              </div>
            </div>
          </div>

          <div className="relative p-0.5 bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/10">
            <div className="p-6 space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-500 border-b border-none pb-3">
                <span className="text-[10px] uppercase tracking-widest">Diagnostic Logs (Fragmented Silos)</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </div>
              <div className="space-y-2.5">
                <div className="p-3 neu-flat border border-none rounded-lg flex items-center justify-between text-slate-400">
                  <span className="flex items-center space-x-2">
                    <GitBranch size={14} className="text-purple-400" />
                    <span>GitHub: PR #92 claims validator refactored</span>
                  </span>
                  <span className="text-[9px] bg-purple-950/20 border border-purple-900/30 text-purple-400 px-2 py-0.5 rounded">Unlinked</span>
                </div>
                <div className="p-3 neu-flat border border-none rounded-lg flex items-center justify-between text-slate-400">
                  <span className="flex items-center space-x-2">
                    <MessageSquare size={14} className="text-cyan-400" />
                    <span>Slack: "Timeout errors on checkout container"</span>
                  </span>
                  <span className="text-[9px] bg-cyan-950/20 border border-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded">Isolated</span>
                </div>
                <div className="p-3 neu-flat border border-none rounded-lg flex items-center justify-between text-slate-400">
                  <span className="flex items-center space-x-2">
                    <AlertCircle size={14} className="text-rose-400" />
                    <span>Sentry: JsonWebTokenError (signature mismatch)</span>
                  </span>
                  <span className="text-[9px] bg-rose-950/20 border border-rose-900/30 text-rose-400 px-2 py-0.5 rounded">Unresolved</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-rose-950/20 border border-rose-900/30 text-rose-400 rounded-lg text-center font-semibold text-[11px]">
                ✕ Outage resolved from memory — No historical graph generated
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Playground/Walkthrough */}
      <section id="interactive-playground" className="py-24 px-6 border-t border-slate-950 relative">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-950/50 border border-indigo-900 rounded-full text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
              <Sparkles size={12} className="animate-pulse" />
              <span>Interactive Presentation Playground</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Test-Drive the Evidence Engine
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Select an option below to simulate a real-world outage, see how Neo4j queries run circles around standard SQL joins, and explore voice features.
            </p>
          </div>

          {/* Interactive Playground Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 border-b border-none pb-2">
            {[
              { id: 'walkthrough', label: '1. Outage Simulator', icon: Play },
              { id: 'graph', label: '2. SQL vs Neo4j Graph', icon: Database },
              { id: 'voice', label: '3. Multilingual Voice', icon: Mic },
              { id: 'mobile', label: '4. On-Call Mobile', icon: Smartphone },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center space-x-2 px-5 py-3 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-emerald-500 bg-slate-900/50 text-emerald-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Live Outage Simulator */}
          {activeTab === 'walkthrough' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-in fade-in duration-300">
              {/* Timeline Simulator Controls & Feed */}
              <div className="lg:col-span-7 neu-flat/40 border border-none rounded-2xl p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Ingestion Inflow Pipeline</h3>
                    <button
                      onClick={startSimulation}
                      disabled={simRunning}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/10 transition-colors"
                    >
                      <RefreshCw size={12} className={simRunning ? 'animate-spin' : ''} />
                      <span>{simStep === -1 ? 'Trigger Outage Flow' : 'Reset & Re-Run'}</span>
                    </button>
                  </div>

                  <div className="space-y-3 min-h-[300px]">
                    {simStep === -1 && (
                      <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-3">
                        <AlertCircle size={36} className="text-slate-700" />
                        <p className="text-xs text-slate-500">Click "Trigger Outage Flow" above to simulate real webhook ingestion.</p>
                      </div>
                    )}

                    {simulationSteps.map((step, idx) => {
                      if (idx > simStep) return null;
                      return (
                        <div key={idx} className="flex items-start space-x-3.5 p-3.5 neu-flat border border-none rounded-xl animate-in slide-in-from-bottom-2 duration-300">
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${
                            step.severity === 'critical' ? 'bg-red-950 border border-red-900 text-red-400' :
                            step.severity === 'warning' ? 'bg-amber-950 border border-amber-900 text-amber-400' :
                            'bg-slate-900 border border-slate-800 text-slate-400'
                          }`}>
                            {step.time}
                          </span>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-[11px] font-bold text-slate-200">{step.title}</span>
                              <span className="text-[9px] text-slate-500 capitalize">({step.source})</span>
                            </div>
                            <p className="text-xs text-slate-400 font-mono leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}

                    {aiInvestigating && (
                      <div className="flex items-center space-x-3 p-4 bg-emerald-950/10 border border-emerald-900/30 text-emerald-400 rounded-xl animate-pulse">
                        <LoaderIcon />
                        <div className="text-xs">
                          <span className="font-bold uppercase tracking-wider block">AI Investigation Active</span>
                          <span className="text-[10px]">Neo4j Causal Graph Traversal: mapping PR #92 to Sentry error signatures...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Forensic Report Output */}
              <div className="lg:col-span-5 neu-flat/40 border border-none rounded-2xl p-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-none pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                      <Sparkles size={14} className="text-orange-500" />
                      <span>Reconstructor Output</span>
                    </span>
                    {showReport && (
                      <span className="text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded">
                        CONFIDENCE: {mockReport.confidence}
                      </span>
                    )}
                  </div>

                  {!showReport && !aiInvestigating && (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-3">
                      <Layers size={36} className="text-slate-700" />
                      <p className="text-xs text-slate-500 max-w-xs">Waiting for webhook simulation to run. Reconstructor will output causality details here.</p>
                    </div>
                  )}

                  {aiInvestigating && (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-3 animate-pulse">
                      <Layers size={36} className="text-emerald-800" />
                      <p className="text-xs text-slate-500">Querying shortest path to Sentry alert node...</p>
                    </div>
                  )}

                  {showReport && (
                    <div className="space-y-4 animate-in fade-in duration-500">
                      <div className="p-3 bg-red-950/10 border border-red-900/30 rounded-xl">
                        <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider block mb-1">Identified Root Cause</span>
                        <p className="text-xs text-slate-200 font-medium leading-relaxed">{mockReport.rootCause}</p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">People Involved in Causal Chain</span>
                        <div className="space-y-1.5">
                          {mockReport.people.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs p-2 neu-flat border border-none/60 rounded font-mono">
                              <span className="font-semibold text-slate-300">{p.name}</span>
                              <span className="text-[10px] text-slate-500">{p.role}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Prevention Recommendations</span>
                        <ul className="space-y-1 text-xs text-slate-400">
                          {mockReport.prevention.map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-1.5 leading-relaxed">
                              <span className="text-emerald-500 mt-0.5">✔</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: SQL vs Graph database comparison */}
          {activeTab === 'graph' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch animate-in fade-in duration-300">
              {/* Explainer Panel */}
              <div className="space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Why SQL is the Wrong Tool for Lineage</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Relational databases represent links using foreign keys, which requires nested SQL Joins or expensive multi-index scans. As your event log grows to millions of files, authors, deployments, and alerts, queries that trace the dependency chain time-out.
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Neo4j represents links as direct pointers on disk (Index-free adjacency). Finding what commit caused a Sentry outage is simply a path-traversal query that hops from node to node in constant time.
                  </p>
                </div>

                <div className="flex neu-flat border border-none rounded-xl p-1 w-fit">
                  <button
                    onClick={() => setGraphMode('sql')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                      graphMode === 'sql' ? 'bg-slate-900 text-rose-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <ArrowRightLeft size={12} />
                    <span>Flat SQL Join Model</span>
                  </button>
                  <button
                    onClick={() => setGraphMode('neo4j')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                      graphMode === 'neo4j' ? 'bg-slate-900 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Network size={12} />
                    <span>Neo4j Causal Graph</span>
                  </button>
                </div>

                <div className="p-4 neu-flat border border-none rounded-xl font-mono text-[10px] space-y-2">
                  <div className="flex justify-between items-center text-slate-500 pb-1.5 border-b border-none">
                    <span>Query Performance</span>
                    <span>Complexity</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>SQL (5 Joins):</span>
                    <span className="text-rose-400 font-semibold">O(N^5) Exponential</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Neo4j Path Search:</span>
                    <span className="text-emerald-400 font-semibold">O(D) Pointer Hops (Constant)</span>
                  </div>
                </div>
              </div>

              {/* Graphic Comparison */}
              <div className="neu-flat/40 border border-none rounded-2xl p-6 min-h-[350px] flex flex-col justify-between">
                {graphMode === 'sql' ? (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">Flat DB Tables (Foreign Key Joins Required)</span>
                    <div className="space-y-2.5 font-mono text-[10px]">
                      <div className="neu-flat border border-none rounded p-2.5 space-y-1 overflow-x-auto">
                        <span className="text-rose-400 font-bold block">Table: events</span>
                        <div className="grid grid-cols-3 text-slate-500 border-b border-none pb-1 min-w-[280px]">
                          <span>id</span>
                          <span>type</span>
                          <span>system_id (FK)</span>
                        </div>
                        <div className="grid grid-cols-3 text-slate-400">
                          <span>evt-git-1</span>
                          <span>COMMIT</span>
                          <span>sys-pay-1</span>
                        </div>
                      </div>

                      <div className="neu-flat border border-none rounded p-2.5 space-y-1 overflow-x-auto">
                        <span className="text-rose-400 font-bold block">Table: authors</span>
                        <div className="grid grid-cols-3 text-slate-500 border-b border-none pb-1 min-w-[280px]">
                          <span>id</span>
                          <span>name</span>
                          <span>event_id (FK)</span>
                        </div>
                        <div className="grid grid-cols-3 text-slate-400">
                          <span>usr-sarah</span>
                          <span>Sarah J.</span>
                          <span>evt-git-1</span>
                        </div>
                      </div>

                      <div className="neu-flat border border-none rounded p-2.5 space-y-1 overflow-x-auto">
                        <span className="text-rose-400 font-bold block">Table: anomalies</span>
                        <div className="grid grid-cols-3 text-slate-500 border-b border-none pb-1 min-w-[280px]">
                          <span>id</span>
                          <span>alert_title</span>
                          <span>event_id (FK)</span>
                        </div>
                        <div className="grid grid-cols-3 text-slate-400">
                          <span>anom-100</span>
                          <span>500 Spike</span>
                          <span>??? (Null)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in duration-300 flex-grow flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Direct Pointer Connections (AuraDB)</span>
                    
                    {/* Graphical Node representation */}
                    <div className="relative py-8 flex items-start justify-between px-0 sm:px-6 w-full max-w-sm mx-auto sm:max-w-none">
                      {/* Responsive Connecting Dashed Line */}
                      <div className="absolute top-[56px] left-[15%] right-[15%] border-t-2 border-dashed border-emerald-500/50 pointer-events-none z-0" />

                      <div className="relative z-10 flex flex-col items-center space-y-1.5">
                        <div className="w-12 h-12 bg-cyan-950 border border-cyan-500/50 rounded-full flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
                          <GitBranch size={18} />
                        </div>
                        <span className="text-[9px] font-mono text-slate-400">Sarah (Commit)</span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center space-y-1.5">
                        <div className="w-12 h-12 bg-emerald-950 border border-emerald-500/50 rounded-full flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 animate-pulse">
                          <Network size={18} />
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400">(:TRIGGERED)</span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center space-y-1.5">
                        <div className="w-12 h-12 bg-rose-950 border border-rose-500/50 rounded-full flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
                          <AlertCircle size={18} />
                        </div>
                        <span className="text-[9px] font-mono text-slate-400">Outage Alert</span>
                      </div>
                    </div>

                    <div className="p-3 neu-flat border border-none rounded-lg">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-1">Causal Cypher Query</span>
                      <code className="text-[10px] text-emerald-400 font-mono">
                        MATCH path = shortestPath((c:Event)-[:TRIGGERED*]-&gt;(i:Incident)) RETURN path
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Multilingual Voice briefing */}
          {activeTab === 'voice' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-in fade-in duration-300">
              {/* Language selection and controls */}
              <div className="lg:col-span-5 neu-flat/40 border border-none rounded-2xl p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Sarvam Multilingual Voice Stream</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Incident response is global. On-call developers can query the Black Box using spoken natural language in their preferred dialect. Sarvam translates speech to text, queries Neo4j, and returns a synthetic speech report.
                  </p>

                  <div className="flex gap-2">
                    {[
                      { id: 'en', label: 'English' },
                      { id: 'hi', label: 'Hindi (हिंदी)' },
                      { id: 'ta', label: 'Tamil (தமிழ்)' }
                    ].map(lang => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          window.speechSynthesis?.cancel();
                          setVoiceLang(lang.id as 'en' | 'hi' | 'ta');
                          setVoicePlaying(false);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          voiceLang === lang.id
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                            : 'neu-flat border-none text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={toggleVoicePlay}
                    className="w-full flex items-center justify-center space-x-2.5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/10 transition-colors"
                  >
                    {voicePlaying ? <Volume2 size={16} /> : <Mic size={16} />}
                    <span>{voicePlaying ? 'Pause Audio Briefing' : 'Simulate Audio Response'}</span>
                  </button>

                  <div className="flex justify-center">
                    <canvas ref={canvasRef} width="300" height="40" className="w-full max-w-[300px] opacity-75" />
                  </div>
                </div>
              </div>

              {/* Visualized STT -> Response Chain */}
              <div className="lg:col-span-7 neu-flat/40 border border-none rounded-2xl p-6 flex flex-col justify-between">
                <div className="space-y-5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block border-b border-none pb-2">
                    Speech-to-Text Pipeline
                  </span>

                  <div className="space-y-4">
                    {/* Mic Inbound */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">1. Spoken Query Input</span>
                      <div className="p-3 neu-flat border border-none rounded-xl flex items-center justify-between">
                        <p className="text-xs text-slate-300 italic">"{voiceMocks[voiceLang].query}"</p>
                        <Mic size={14} className="text-slate-600 animate-pulse" />
                      </div>
                    </div>

                    {/* Transcription */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">2. Sarvam Speech Transcription</span>
                      <div className="p-3 neu-flat border border-none rounded-xl font-mono text-[10px] text-slate-400">
                        {voiceMocks[voiceLang].transcription}
                      </div>
                    </div>

                    {/* Synthesis Output */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-emerald-500 uppercase font-bold">3. Generated Voice Briefing (TTS)</span>
                      <div className={`p-3 border rounded-xl transition-all duration-300 ${
                        voicePlaying 
                          ? 'bg-emerald-950/20 border-emerald-500/50' 
                          : 'neu-flat border-none'
                      }`}>
                        <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                          {voiceMocks[voiceLang].response}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Mobile App Simulator */}
          {activeTab === 'mobile' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center animate-in fade-in duration-300">
              {/* Smartphone Simulator */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-[280px] h-[550px] neu-flat border-[8px] border-none rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
                  {/* Status Bar */}
                  <div className="h-6 neu-flat px-5 flex justify-between items-center text-[9px] font-mono text-slate-400 shrink-0">
                    <span>9:41</span>
                    <div className="flex space-x-1.5">
                      <span>5G</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Simulator Screen Container */}
                  <div className="flex-grow neu-flat p-4 overflow-y-auto">
                    {mobileScreen === 'feed' && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Incident Feed</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </div>

                        <div 
                          onClick={() => setMobileScreen('detail')}
                          className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl space-y-2 cursor-pointer hover:border-red-500 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] font-bold bg-red-950 border border-red-900 text-red-400 px-1.5 py-0.2 rounded uppercase">P1 Outage</span>
                            <span className="text-[7px] font-mono text-slate-500">2 min ago</span>
                          </div>
                          <h4 className="text-[10px] font-bold text-slate-200 line-clamp-2">Payment API returned 500 errors on /checkout</h4>
                          <span className="text-[8px] text-slate-500 block">Tap to inspect causality...</span>
                        </div>
                      </div>
                    )}

                    {mobileScreen === 'detail' && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <button 
                          onClick={() => setMobileScreen('feed')}
                          className="text-[9px] font-semibold text-slate-500 hover:text-slate-300"
                        >
                          ← Back Feed
                        </button>
                        <h4 className="text-[11px] font-bold text-slate-200">Causal Timeline (Sarah PR #92)</h4>
                        
                        <div className="space-y-2.5">
                          {[
                            { title: 'PR Merged', desc: 'Sarah Jenkins', source: 'github' },
                            { title: 'Deploy Prod', desc: 'workflow #412', source: 'github' },
                            { title: '500 Spike', desc: 'Checkout returns 500', source: 'sentry' }
                          ].map((e, idx) => (
                            <div key={idx} className="p-2.5 neu-flat border border-none rounded-lg flex items-center space-x-2.5">
                              <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center text-[9px] font-bold text-emerald-400 font-mono">
                                {idx + 1}
                              </div>
                              <div>
                                <h5 className="text-[9px] font-bold text-slate-200">{e.title}</h5>
                                <p className="text-[8px] text-slate-500">{e.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {mobileScreen === 'voice' && (
                      <div className="space-y-6 text-center py-8 animate-in fade-in duration-200">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-200">Voice Assistant</h4>
                          <p className="text-[9px] text-slate-500">Hold button and ask a question</p>
                        </div>

                        <div className="flex justify-center">
                          <button className="w-16 h-16 bg-emerald-950 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 animate-pulse shadow-lg shadow-emerald-500/10">
                            <Mic size={24} />
                          </button>
                        </div>

                        <p className="text-[9px] text-slate-400 italic">"What went wrong with payment API yesterday?"</p>
                      </div>
                    )}
                  </div>

                  {/* Tab bar Navigation */}
                  <div className="h-12 neu-flat border-t border-none flex justify-around items-center text-[8px] font-semibold text-slate-500 shrink-0">
                    <button 
                      onClick={() => setMobileScreen('feed')}
                      className={mobileScreen === 'feed' ? 'text-emerald-500' : ''}
                    >
                      Feed
                    </button>
                    <button 
                      onClick={() => setMobileScreen('voice')}
                      className={mobileScreen === 'voice' ? 'text-emerald-500' : ''}
                    >
                      Voice Query
                    </button>
                  </div>
                </div>
              </div>

              {/* Description Panel */}
              <div className="lg:col-span-7 space-y-6">
                <h3 className="text-2xl font-bold">Expo Mobile Companion App</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  On-call engineers rarely sit at their desk during a 3 AM incident. Our Expo mobile client delivers high-priority push notifications with immediate causal summaries.
                </p>
                <ul className="space-y-3.5 text-xs text-slate-400">
                  <li className="flex items-start space-x-2.5">
                    <span className="text-emerald-500">✔</span>
                    <span><strong>Critical Feeds:</strong> Immediate visualization of causal events, preventing delays.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-emerald-500">✔</span>
                    <span><strong>Voice Search Integration:</strong> Tap the mic button to get voice briefings via Sarvam while on the road.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-emerald-500">✔</span>
                    <span><strong>Rollback Triggers:</strong> Initiate deployment rollbacks right from the detailed incident feed.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Technical Workflow Architecture */}
      <section id="how-it-works" className="py-24 neu-flat/40 border-t border-slate-950 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">System Workflow Architecture</h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">See how Internet Black Box integrates webhooks, graphs, and LLMs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="glass border border-none rounded-2xl p-6 space-y-4 hover:border-slate-800 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-sm text-emerald-400 font-mono">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Normalize & Ingest</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                GitHub Commits, Slack notifications, Sentry exceptions, and Google Meet transcripts are converted into a standardized JSON payload structure.
              </p>
            </div>

            <div className="glass border border-none rounded-2xl p-6 space-y-4 hover:border-slate-800 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-sm text-emerald-400 font-mono">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Build Neo4j Causal Graph</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nodes represent people, events, systems, and incidents. Edges establish timelines via <code>:AUTHORED</code>, <code>:TRIGGERED</code>, and <code>:AFFECTED</code>.
              </p>
            </div>

            <div className="glass border border-none rounded-2xl p-6 space-y-4 hover:border-slate-800 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-sm text-emerald-400 font-mono">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">AI Reconstruction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The engine isolates subgraphs surrounding the timestamp, traverses causal vectors, and requests Claude to summarize the chain of errors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Causal Graph Engine Deep Dive */}
      <section id="graph-deep-dive" className="py-24 border-t border-slate-950 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-950/50 border border-emerald-900 rounded-full text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
              <Network size={12} />
              <span>Multi-Dimensional Node Relationships</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Causal Graph Engine Deep Dive
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Traditional relational maps treat incidents as flat database events. Internet Black Box models telemetry as nodes linked via direct memory pointers, turning diagnostics into simple graph traversals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Node Graph Simulator */}
            <div className="lg:col-span-7 p-6 neu-flat/40 border border-none rounded-2xl flex flex-col justify-center min-h-[350px]">
              <div className="flex flex-col items-center space-y-8 relative">
                {/* Visual Connection Lines */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-rose-500 -translate-y-1/2 opacity-20 pointer-events-none" />
                
                {/* Node Level 1 */}
                <div className="flex justify-around w-full">
                  <div className="p-3 bg-slate-900 border border-cyan-500/30 rounded-xl flex items-center space-x-2 shadow-lg shadow-cyan-500/5 hover:border-cyan-400 transition-all">
                    <div className="w-7 h-7 bg-cyan-950 rounded-lg flex items-center justify-center text-cyan-400 text-xs font-bold">U</div>
                    <div>
                      <span className="text-[10px] font-bold block text-slate-200">Person Node</span>
                      <span className="text-[8px] font-mono text-slate-500">(:Developer {`{name: "Sarah"}`})</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 border border-purple-500/30 rounded-xl flex items-center space-x-2 shadow-lg shadow-purple-500/5 hover:border-purple-400 transition-all">
                    <div className="w-7 h-7 bg-purple-950 rounded-lg flex items-center justify-center text-purple-400 text-xs font-bold">C</div>
                    <div>
                      <span className="text-[10px] font-bold block text-slate-200">Commit Node</span>
                      <span className="text-[8px] font-mono text-slate-500">(:CodeCommit {`{PR: 92}`})</span>
                    </div>
                  </div>
                </div>

                {/* Node Level 2 */}
                <div className="flex justify-center w-full">
                  <div className="p-4 bg-slate-900 border border-emerald-500/50 rounded-xl flex items-center space-x-3 shadow-xl shadow-emerald-500/5 hover:border-emerald-400 transition-all glow-active">
                    <div className="w-9 h-9 bg-emerald-950 rounded-lg flex items-center justify-center text-emerald-400 font-bold text-sm">S</div>
                    <div>
                      <span className="text-xs font-bold block text-emerald-400">System Entity</span>
                      <span className="text-[9px] font-mono text-slate-400">(:Service {`{name: "payment"}`})</span>
                    </div>
                  </div>
                </div>

                {/* Node Level 3 */}
                <div className="flex justify-around w-full">
                  <div className="p-3 bg-slate-900 border border-amber-500/30 rounded-xl flex items-center space-x-2 shadow-lg shadow-amber-500/5 hover:border-amber-400 transition-all">
                    <div className="w-7 h-7 bg-amber-950 rounded-lg flex items-center justify-center text-amber-400 text-xs font-bold">D</div>
                    <div>
                      <span className="text-[10px] font-bold block text-slate-200">Deployment</span>
                      <span className="text-[8px] font-mono text-slate-500">(:Deploy {`{id: 412}`})</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 border border-rose-500/30 rounded-xl flex items-center space-x-2 shadow-lg shadow-rose-500/5 hover:border-rose-400 transition-all">
                    <div className="w-7 h-7 bg-rose-950 rounded-lg flex items-center justify-center text-rose-400 text-xs font-bold">A</div>
                    <div>
                      <span className="text-[10px] font-bold block text-slate-200">Telemetry Alert</span>
                      <span className="text-[8px] font-mono text-slate-500">(:SentryAlert {`{rate: 89%}`})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cypher Code Presentation */}
            <div className="lg:col-span-5 p-6 neu-flat/40 border border-none rounded-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Querying Causality (Neo4j Cypher)</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instead of querying multiple tables with composite primary-key joins, finding the author and code change that triggered the sentry outage is modeled as a simple directional traversal:
                </p>
              </div>

              <div className="neu-flat border border-none rounded-xl p-4 font-mono text-[10px] text-slate-300 space-y-3">
                <div>
                  <span className="text-slate-500 font-bold block">// Find shortest path between anomaly and developer commits</span>
                  <span className="text-emerald-400">MATCH</span> path = shortestPath((dev:Person)-[:AUTHORED|:TRIGGERED*1..5]-&gt;(alert:SentryAlert))
                </div>
                <div>
                  <span className="text-emerald-400">WHERE</span> alert.severity = <span className="text-rose-400">'CRITICAL'</span>
                </div>
                <div>
                  <span className="text-emerald-400">RETURN</span> dev.name, path
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Ingestion ecosystem & adapters */}
      <section id="integrations" className="py-24 neu-flat/20 border-t border-slate-950 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-950/50 border border-cyan-900 rounded-full text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
              <Layers3 size={12} />
              <span>Standardized Telemetry Adapters</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Ingestion Ecosystem & Adapters
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Passive evidence capture is fully asynchronous. Standardized webhook mappings parse live payloads, extract references, and link them to the causal graph in milliseconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'GitHub Integration', desc: 'Hooks into push, PR merge, and issue events. Extracts code diff references, branch states, and file lists.', latency: '85ms Ingestion', status: 'ONLINE', statusColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-900' },
              { title: 'Slack Conversation Ingest', desc: 'Filters developer triage channels and threads. Links context logs to specific code repositories.', latency: '32ms Ingestion', status: 'ONLINE', statusColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-900' },
              { title: 'Sentry Webhooks', desc: 'Parses exceptions, stack traces, and alert triggers. Matches error classes directly to code nodes.', latency: '64ms Ingestion', status: 'ONLINE', statusColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-900' },
              { title: 'Kubernetes Auditing', desc: 'Tracks pod terminations, OOM kills, deployment rollouts, and configuration map state shifts.', latency: '110ms Ingestion', status: 'STANDBY', statusColor: 'text-slate-500 bg-slate-900/30 border-slate-800' },
              { title: 'Google Meet War Room', desc: 'Transcribes calls in real-time, extracts keywords, and tags active engineers in the causal timeline.', latency: '240ms Ingestion', status: 'STANDBY', statusColor: 'text-slate-500 bg-slate-900/30 border-slate-800' },
              { title: 'PagerDuty Adapter', desc: 'Syncs current on-call schedules, incident response ownership shifts, and pager triggers.', latency: '45ms Ingestion', status: 'STANDBY', statusColor: 'text-slate-500 bg-slate-900/30 border-slate-800' }
            ].map((item, idx) => (
              <div key={idx} className="glass hover:bg-slate-900/35 border border-none rounded-xl p-5 flex flex-col justify-between min-h-[180px] hover:border-slate-800 transition-all">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{item.title}</h3>
                    <span className={`text-[8px] font-bold border px-1.5 py-0.2 rounded ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                <div className="flex items-center space-x-1.5 text-[9px] font-mono text-slate-500 mt-3 pt-3 border-t border-none">
                  <Activity size={10} className="text-cyan-500" />
                  <span>Avg parsing: {item.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Under the Hood Tech Stack */}
      <section id="tech-spec" className="py-24 border-t border-slate-950 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-950/50 border border-purple-900 rounded-full text-[10px] font-bold tracking-wider text-purple-400 uppercase">
              <Cpu size={12} />
              <span>Engineered Core Architecture</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Under the Hood: Tech Stack Spec
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              A high-performance reactive codebase built to ensure sub-second forensic visualization under intense production environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass border border-none rounded-xl p-6 space-y-4">
              <div className="flex items-center space-x-3.5 border-b border-none pb-3">
                <span className="p-2 bg-emerald-950/30 border border-emerald-900 rounded text-emerald-400 font-mono text-xs font-bold">JVM</span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Spring Boot 3.3.0</h3>
                  <span className="text-[9px] text-slate-500 font-mono">Reactive Java Webhook Orchestrator</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Utilizes non-blocking reactive pipelines to process incoming event webhooks. Features thread-pool isolation, resilient service fallbacks, and local scheduled indexing checks.
              </p>
            </div>

            <div className="glass border border-none rounded-xl p-6 space-y-4">
              <div className="flex items-center space-x-3.5 border-b border-none pb-3">
                <span className="p-2 bg-purple-950/30 border border-purple-900 rounded text-purple-400 font-mono text-xs font-bold">GDB</span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Neo4j AuraDB</h3>
                  <span className="text-[9px] text-slate-500 font-mono">Native Graph Database & Cypher Engine</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ensures constant-time lineage tracking via index-free adjacency. Links commits, Slack comments, Sentry exceptions, and incidents as graph nodes for instantaneous root cause queries.
              </p>
            </div>

            <div className="glass border border-none rounded-xl p-6 space-y-4">
              <div className="flex items-center space-x-3.5 border-b border-none pb-3">
                <span className="p-2 bg-cyan-950/30 border border-cyan-900 rounded text-cyan-400 font-mono text-xs font-bold">SPA</span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">React 19 & Tailwind CSS v4</h3>
                  <span className="text-[9px] text-slate-500 font-mono">Real-Time Client Dashboard</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provides modular state management using Zustand, dynamic charting via Recharts, and hardware-accelerated animations, with support for live WebSocket events streaming.
              </p>
            </div>

            <div className="glass border border-none rounded-xl p-6 space-y-4">
              <div className="flex items-center space-x-3.5 border-b border-none pb-3">
                <span className="p-2 bg-orange-950/30 border border-orange-900 rounded text-orange-400 font-mono text-xs font-bold">LLM</span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">AI Context Traversal</h3>
                  <span className="text-[9px] text-slate-500 font-mono">Forensic Reconstruction Summarizer</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Engineered LLM prompts extract subgraphs surrounding outage timestamps. They compile developer details and code diffs into clean, actionable, human-readable post-mortems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Security & air-gapped compliance */}
      <section id="security" className="py-24 neu-flat/20 border-t border-slate-950 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-950/50 border border-red-900 rounded-full text-[10px] font-bold tracking-wider text-red-400 uppercase">
              <Lock size={12} />
              <span>Enterprise Compliance Spec</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Forensic Compliance & Security
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Telemetry contains sensitive organizational IP. We run on zero-trust principles to keep your event data secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass border border-none rounded-xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">PII Scrubbing Pipeline</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Automatically identifies and redacts secrets, database passwords, environment variables, and client identifiers before event data is parsed into the causal graph.
              </p>
            </div>
            <div className="glass border border-none rounded-xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">WORM Log Integrity</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Utilizes Write-Once-Read-Many storage primitives on the Neo4j graph, ensuring all audit trials, timelines, and causal edges are permanently immutable and tamper-resistant.
              </p>
            </div>
            <div className="glass border border-none rounded-xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Air-Gapped / PGP Encryption</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Supports local deployment inside isolated corporate subnets. Optional local PGP keys allow telemetry payloads to be stored fully encrypted at rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Team Arete */}
      <section id="team" className="py-24 neu-flat/40 border-t border-slate-950 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Built by Team Arete</h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              A team of passionate builders obsessed with graphing out chaos for HackHazards '26.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Nayana Shaji Mekkunnel',
                link: 'https://www.linkedin.com/in/nayana-shaji-394124320',
              },
              {
                name: 'Gabriel James',
                link: 'https://www.linkedin.com/in/gabrieljamesamara',
              },
              {
                name: 'Jany Sabarinath',
                link: 'https://www.linkedin.com/in/jany-sabarinath-1b4b9b21a',
              },
              {
                name: 'Vrindha P',
                link: 'https://www.linkedin.com/in/vrindha-p',
              }
            ].map((member, idx) => (
              <div key={idx} className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 overflow-hidden hover:from-emerald-500/50 hover:to-slate-900 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="neu-flat rounded-[15px] p-6 h-full flex flex-col items-center text-center space-y-4 relative z-10">
                  <div className={`w-20 h-20 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center shadow-lg group-hover:border-emerald-500/50 transition-colors`}>
                    <span className="text-2xl font-bold text-slate-300 uppercase group-hover:text-emerald-400 transition-colors">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div className="space-y-1 mb-2">
                    <h3 className="text-base font-bold text-slate-200">{member.name}</h3>
                  </div>
                  <a href={member.link} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors w-full justify-center border border-slate-800 hover:border-slate-700 relative z-20 mt-auto">
                    <span>View LinkedIn</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: FAQ */}
      <section id="faq" className="py-24 border-t border-slate-950 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-950/50 border border-amber-900 rounded-full text-[10px] font-bold tracking-wider text-amber-400 uppercase">
              <HelpCircle size={12} />
              <span>FAQ Guide</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Got questions about our graph architecture, integrations, or capabilities? Here's everything you need to know.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200">How does it differ from traditional log analysis tools?</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Traditional tools like Datadog or Splunk store log data in flat, temporal silos. They tell you *when* something happened, but they can't establish *why* without manual query correlation. Internet Black Box links those silos together as a unified causal graph, letting you query direct pathways (e.g. Commit &rarr; Deploy &rarr; Alert).
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200">Does it support other graph databases?</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Our database service layer currently defaults to Neo4j due to its excellent support for AuraDB, native index-free adjacency performance, and Cypher query standard. However, the service classes are structured to support alternative property graph databases via direct adapter extensions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200">How does it match unstructured Slack conversations with Git commits?</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                When a Slack message is ingested, our processing engine uses natural language processing (NLP) to extract entities (like file names, routes, or developer handles). It then performs temporal-proximity matching against recent commits and deployments within the graph, clustering related events automatically.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200">Can we integrate our own CI/CD pipelines?</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Yes. Our server exposes a standardized POST `/api/events` endpoint. You can send a payload representing any custom CI/CD, deployment, or configuration change event. It will be parsed and linked into the graph topology automatically based on timestamps and system properties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 px-6 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <img src="/logo.svg" className="w-8 h-8 rounded-lg border border-emerald-500/30 object-cover shadow-lg shadow-emerald-500/10" alt="Logo" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Internet Black Box (2026)</span>
          </div>
          <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Built for HackHazards '26</span>
        </div>
      </footer>

    </div>
  );
};

// Simple loader svg helper
const LoaderIcon = () => (
  <svg className="animate-spin h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
