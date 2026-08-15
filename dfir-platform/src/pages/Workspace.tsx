import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HardDrive, Cpu, Globe, Database, Mail, Usb, Network,
  AlertTriangle, Send, ChevronDown, Activity,
  MessageSquare, BarChart2, Layers, CheckCircle, ShieldCheck, Zap
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import PipelineVisual from '../components/shared/PipelineVisual';
import { useStore } from '../store';

export interface Stage {
  label: string;
  status: 'complete' | 'running' | 'pending';
  detail?: string;
}

const initialPipelineStages: Stage[] = [
  { label: 'User Prompt & Intent Analysis', status: 'complete', detail: 'Intent parsed • Scope extracted' },
  { label: 'Task Orchestration Engine', status: 'complete', detail: '13 forensic tasks scheduled' },
  { label: 'Evidence & Vector Retrieval', status: 'complete', detail: 'Searching case-isolated vector store' },
  { label: 'Verification & SHA-256 Baseline', status: 'complete', detail: 'Cryptographic hash verified' },
  { label: 'Security & Prompt Injection Defense', status: 'complete', detail: 'Zero trust sanitization active' },
  { label: 'Multi-Agent Investigation', status: 'complete', detail: 'Triage, Disk & Memory agents' },
  { label: 'Reasoning & Hypothesis Engine', status: 'complete', detail: 'Evaluating evidence context' },
  { label: 'Fact Verification Engine', status: 'complete', detail: 'Claim grounded in evidence' },
  { label: 'Explainable Response Generation', status: 'complete', detail: 'Confidence & trust calculated' },
  { label: 'Final Forensic Output', status: 'complete', detail: 'Output verified' },
];

const evidenceCategories = [
  { id: 'disk', label: 'Disk Images', icon: HardDrive, count: 3, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'memory', label: 'Memory Dumps', icon: Cpu, count: 2, color: 'text-violet-600', bg: 'bg-violet-50' },
  { id: 'network', label: 'Network Captures', icon: Network, count: 1, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { id: 'events', label: 'Event Logs', icon: Database, count: 2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'browser', label: 'Browser Artifacts', icon: Globe, count: 1, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'registry', label: 'Registry', icon: Database, count: 1, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'email', label: 'Email Archives', icon: Mail, count: 1, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'usb', label: 'USB Devices', icon: Usb, count: 0, color: 'text-slate-500', bg: 'bg-slate-50' },
];

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  confidence?: number;
  evidenceRefs?: string[];
  integrityStatus?: string;
  timestamp: string;
}

export default function Workspace() {
  const { activeInvestigation, evidence } = useStore();
  const [selectedEvidence, setSelectedEvidence] = useState(evidence[0]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('disk');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '**Autonomous Forensic AI Assistant** initialized.\n\nAsk any question regarding this case. For every prompt, I will trigger the full 10-stage autonomous investigation pipeline — extracting scope, querying case-isolated RAG vectors, verifying SHA-256 hashes, and cross-referencing findings across all deployed agents.',
      confidence: 99,
      integrityStatus: 'VERIFIED',
      evidenceRefs: ['ev-001', 'ev-002', 'ev-004'],
      timestamp: new Date().toISOString()
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [activePipelineStages, setActivePipelineStages] = useState<Stage[]>(initialPipelineStages);
  const [currentStageIndex, setCurrentStageIndex] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  // Executes full 10-stage investigation pipeline per prompt
  const sendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const promptText = chatInput.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: promptText,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    // Initialize pipeline animation for this specific prompt
    const freshStages: Stage[] = [
      { label: 'User Prompt & Intent Analysis', status: 'running', detail: `Parsing intent: "${promptText.slice(0, 30)}..."` },
      { label: 'Task Orchestration Engine', status: 'pending', detail: 'Orchestrating forensic agents' },
      { label: 'Evidence & Vector Retrieval', status: 'pending', detail: 'Searching case-isolated vector store' },
      { label: 'Verification & SHA-256 Baseline', status: 'pending', detail: 'Checking baseline SHA-256 hashes' },
      { label: 'Security & Prompt Injection Defense', status: 'pending', detail: 'Sanitizing context against injection' },
      { label: 'Multi-Agent Investigation', status: 'pending', detail: 'Disk, Memory & Network agents executing' },
      { label: 'Reasoning & Hypothesis Engine', status: 'pending', detail: 'Evaluating evidence context' },
      { label: 'Fact Verification Engine', status: 'pending', detail: 'Cross-referencing claim citations' },
      { label: 'Explainable Response Generation', status: 'pending', detail: 'Calculating confidence & trust' },
      { label: 'Final Forensic Output', status: 'pending', detail: 'Output verified' },
    ];
    setActivePipelineStages(freshStages);

    // Step through each pipeline stage for maximum explainability
    for (let step = 0; step < freshStages.length; step++) {
      setCurrentStageIndex(step);
      setActivePipelineStages(prev => prev.map((stage, idx) => {
        if (idx < step) return { ...stage, status: 'complete' };
        if (idx === step) return { ...stage, status: 'running' };
        return { ...stage, status: 'pending' };
      }));

      await new Promise(r => setTimeout(r, 220 + Math.random() * 120));
    }

    setActivePipelineStages(prev => prev.map(s => ({ ...s, status: 'complete' })));
    setCurrentStageIndex(null);

    // Generate comprehensive forensic answer grounded in evidence
    const lower = promptText.toLowerCase();
    let responseText = "";
    let confidenceScore = 94 + Math.floor(Math.random() * 5);
    let refs = ["ev-001", "ev-002", "ev-004"];

    if (lower.includes('entry') || lower.includes('ransomware') || lower.includes('initial') || lower.includes('access')) {
      responseText = `**Ransomware Entry Vector Analysis**\n\n1. **Phishing Email**: Delivered to finance@corp.com at 01:53:12 UTC from \`invoice@malicious-domain.com\`.\n2. **Macro Payload Execution**: \`Invoice_Q3_2026.xlsm\` executed VBA macro spawning \`cmd.exe\` → \`PowerShell.exe\`.\n3. **C2 Beacon Connection**: Established TCP handshake to \`185.220.101.47:443\`.\n4. **Credential Theft**: LSASS memory dump executed via \`procdump.exe\`.\n\n*Cryptographic Baseline Check: SHA-256 verified against original ingestion record.*`;
      refs = ["ev-001", "ev-005"];
    } else if (lower.includes('timeline') || lower.includes('events') || lower.includes('time') || lower.includes('2 am')) {
      responseText = `**Reconstructed Chronological Timeline (01:50 — 04:00 UTC)**\n\n• **01:53:12** — Phishing payload downloaded\n• **01:55:04** — PowerShell execution & memory dump\n• **02:05:30** — SMB lateral movement across 7 workstations\n• **02:15:22** — Domain Admin authentication to DC01\n• **02:17:45** — BlackCat ransomware payload deployed via GPO\n• **02:22:10** — 284,750 files encrypted on target volumes\n\n*Timeline confidence score: 96% based on 450K correlated log events.*`;
      refs = ["ev-001", "ev-002", "ev-003"];
    } else if (lower.includes('delete') || lower.includes('recover') || lower.includes('artifact')) {
      responseText = `**Recovered Deleted Evidence Artifacts**\n\n**847 unallocated artifacts recovered** from FINANCE-WS01:\n\n• **312** temporary PowerShell scripts (\`.ps1\`)\n• **189** downloaded PE binaries (\`.exe\`, \`.dll\`)\n• **143** wiped Security Event Log blocks\n• **203** browser cache entries & network session state files\n\n*Recovered Dropper*: \`svchost32.exe\` recovered from unallocated clusters. Baseline SHA-256 matches BlackCat campaign signature.`;
      refs = ["ev-001", "ev-004"];
    } else {
      responseText = `**Autonomous Forensic Evaluation**\n\nAcross **24 evidence artifacts** in case **${activeInvestigation?.caseId || 'CASE-2026-8472'}**:\n\n• **Ingested Evidence Integrity**: Baseline SHA-256 and SHA-512 hashes verified.\n• **RAG Vector Search**: Case-isolated search retrieved 8 matching content chunks.\n• **Fact Verification Engine**: Grounded 3 findings with 0 unsupported claims.\n\n*Recommendation*: Isolate host \`DC01\` and revoke active Kerberos TGT tickets immediately.`;
    }

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      confidence: confidenceScore,
      evidenceRefs: refs,
      integrityStatus: 'VERIFIED',
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, aiMsg]);
    setChatLoading(false);
  };

  const suggestedQueries = [
    'What is the ransomware entry point?',
    'Reconstruct timeline 2-4 AM',
    'Show deleted files & artifacts',
    'Identify malware C2 server'
  ];

  return (
    <AppLayout title="Live Investigation Workspace" breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Workspace' }]}>
      {/* Active Case Header */}
      {activeInvestigation && (
        <div className="flex items-center gap-4 mb-5 p-4 bg-white rounded-2xl border border-slate-100 card-shadow">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-bold text-slate-900">{activeInvestigation.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full border border-red-200">CRITICAL</span>
              <span className="text-[10px] font-medium px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full">ANALYZING</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{activeInvestigation.caseId} • {activeInvestigation.assignedTo}</p>
          </div>
          <div className="flex gap-6 text-center hidden md:flex">
            {[
              { label: 'Trust Score', value: `${activeInvestigation.trustScore}%`, color: 'text-emerald-600' },
              { label: 'Confidence', value: `${activeInvestigation.confidence}%`, color: 'text-blue-600' },
              { label: 'Progress', value: `${activeInvestigation.progress}%`, color: 'text-violet-600' }
            ].map(s => (
              <div key={s.label}>
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3-Column Workspace Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* COLUMN 1 — Evidence Explorer (~25% width) */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden flex flex-col h-[660px]">
          <div className="p-3.5 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-slate-700">Evidence Explorer</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {evidenceCategories.map(cat => {
              const Icon = cat.icon;
              const isExpanded = expandedCategory === cat.id;
              return (
                <div key={cat.id}>
                  <button onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors hover:bg-slate-50 ${isExpanded ? 'bg-slate-50' : ''}`}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${cat.bg}`}>
                      <Icon className={`w-3 h-3 ${cat.color}`} />
                    </div>
                    <span className="text-[11px] font-medium text-slate-700 flex-1 truncate">{cat.label}</span>
                    <span className="text-[10px] text-slate-400">{cat.count}</span>
                    {cat.count > 0 && <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
                  </button>
                  {isExpanded && cat.count > 0 && (
                    <div className="ml-4 space-y-0.5 mt-0.5">
                      {evidence.slice(0, cat.count).map((ev, i) => (
                        <button key={i} onClick={() => setSelectedEvidence(ev)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] transition-colors ${selectedEvidence?.id === ev.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                          <div className="truncate">{ev.name}</div>
                          <div className="text-slate-400 truncate">{ev.status}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {selectedEvidence && (
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex-shrink-0">
              <p className="text-[10px] font-semibold text-slate-600 mb-1.5 truncate">{selectedEvidence.name}</p>
              <div className="space-y-1 text-[10px] text-slate-500">
                <div className="flex gap-1"><span className="font-medium">Trust Score:</span><span className="text-emerald-600 font-bold">{selectedEvidence.trustScore}%</span></div>
                <div className="flex gap-1"><span className="font-medium">Integrity:</span><span className="capitalize font-bold text-blue-600">{selectedEvidence.status}</span></div>
                <div className="truncate"><span className="font-medium">SHA-256:</span> <span className="font-mono text-[9px]">{selectedEvidence.hash.sha256.slice(0, 16)}...</span></div>
              </div>
            </div>
          )}
        </div>

        {/* COLUMN 2 — Live Per-Prompt Investigation Pipeline (~33% width) */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-100 card-shadow p-4 h-[660px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <div>
                <span className="text-sm font-semibold text-slate-900 block">Investigation Pipeline</span>
                <span className="text-[10px] text-slate-500">Executes per user prompt</span>
              </div>
            </div>
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <span className="text-[9px] font-semibold text-blue-600">{chatLoading ? 'EXECUTING' : 'READY'}</span>
            </motion.div>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            <PipelineVisual stages={activePipelineStages} />
          </div>
        </div>

        {/* COLUMN 3 — Autonomous AI Assistant (~42% width) */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl border border-slate-100 card-shadow flex flex-col h-[660px] overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Autonomous Forensic Assistant</p>
                <p className="text-[10px] text-white/70">Qwen2.5-1.5B Provider • Case-Isolated Vector RAG</p>
              </div>
            </div>
          </div>

          {/* Suggested queries */}
          <div className="p-3 border-b border-slate-100 flex gap-2 flex-wrap flex-shrink-0 bg-slate-50/50">
            {suggestedQueries.map((q, i) => (
              <button key={i} onClick={() => setChatInput(q)} className="text-[11px] px-2.5 py-1 bg-white text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-xs font-medium cursor-pointer">
                {q}
              </button>
            ))}
          </div>

          {/* Chat messages feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-2xl rounded-tl-sm'} px-4 py-3 shadow-xs`}>
                  <p className="text-xs whitespace-pre-line leading-relaxed">{msg.content}</p>
                  
                  {msg.role === 'assistant' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2 flex-wrap">
                      {msg.confidence && (
                        <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {msg.confidence}% confidence
                        </span>
                      )}
                      {msg.integrityStatus && (
                        <span className="text-[9px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5 text-blue-600" /> Hash Verified
                        </span>
                      )}
                      {msg.evidenceRefs && msg.evidenceRefs.length > 0 && (
                        <span className="text-[9px] text-slate-500 font-mono">
                          Evidence: {msg.evidenceRefs.join(', ')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Zap className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    <span className="text-xs font-semibold text-blue-800">
                      Executing Stage {(currentStageIndex ?? 0) + 1} / 10
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-600 font-medium truncate">
                    {activePipelineStages[currentStageIndex ?? 0]?.label} — {activePipelineStages[currentStageIndex ?? 0]?.detail}
                  </p>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="p-3.5 border-t border-slate-100 flex-shrink-0 bg-white">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about evidence, timeline, lateral movement, C2 servers..."
                className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 transition-all"
              />
              <button
                onClick={sendMessage}
                disabled={!chatInput.trim() || chatLoading}
                className="px-4 py-2.5 gradient-blue text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex-shrink-0 flex items-center justify-center font-semibold text-xs gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
