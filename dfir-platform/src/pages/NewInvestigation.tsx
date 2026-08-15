import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import {
  Upload, FileSearch, Brain, Zap, CheckCircle, Loader, Target,
  Network, Play
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useStore } from '../store';
import type { Investigation, Evidence } from '../types';

const investigationTypes = ['ransomware', 'insider-threat', 'data-breach', 'malware', 'phishing', 'fraud', 'network-intrusion'];
const priorities = ['critical', 'high', 'medium', 'low'];

const examplePrompts = [
  'Investigate suspicious activity between 2 AM and 4 AM on the finance workstation.',
  'Determine the ransomware entry point and lateral movement path.',
  'Find deleted evidence and recover artifacts related to data exfiltration.',
  'Analyze insider threat behavior over the past 30 days.',
  'Identify the malware entry point and C2 communication channels.',
];

interface PlanItem {
  label: string; detail: string; status: 'pending' | 'running' | 'done'; confidence?: number;
}

const initialPlan: PlanItem[] = [
  { label: 'Intent Analysis', detail: 'Parsing investigation objectives and goals', status: 'pending' },
  { label: 'Scope Extraction', detail: 'Identifying temporal and asset boundaries', status: 'pending' },
  { label: 'Context Loading', detail: 'Loading case context and prior intelligence', status: 'pending' },
  { label: 'Objective Identification', detail: 'Mapping investigation objectives to tasks', status: 'pending' },
  { label: 'Evidence Prediction', detail: 'Predicting required evidence types', status: 'pending' },
  { label: 'Investigation Strategy', detail: 'Generating optimal analysis strategy', status: 'pending' },
];

interface UploadedFile { name: string; size: number; type: string; progress: number; hash: string; status: 'uploading' | 'hashing' | 'done' | 'error'; }

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

// Workflow nodes for right panel
const workflowNodes = [
  { id: 'prompt', label: 'User Prompt', x: 0, color: 'bg-blue-600' },
  { id: 'planner', label: 'Investigation Planner', x: 0, color: 'bg-indigo-600' },
  { id: 'orchestration', label: 'Task Orchestration', x: 0, color: 'bg-violet-600' },
  { id: 'evidence', label: 'Evidence Discovery', x: 0, color: 'bg-cyan-600' },
  { id: 'agents', label: 'AI Agents', x: 0, color: 'bg-emerald-600' },
];

export default function NewInvestigation() {
  const navigate = useNavigate();
  const { addInvestigation, addEvidence, addNotification } = useStore();

  const [name, setName] = useState('');
  const [caseId, setCaseId] = useState(`CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [priority, setPriority] = useState('high');
  const [invType, setInvType] = useState('ransomware');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [planItems, setPlanItems] = useState<PlanItem[]>(initialPlan);
  const [planRunning, setPlanRunning] = useState(false);
  const [planDone, setPlanDone] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const uf: UploadedFile = { name: file.name, size: file.size, type: file.type, progress: 0, hash: '', status: 'uploading' };
      setUploadedFiles(prev => [...prev, uf]);
      // Simulate upload + hash
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          clearInterval(interval);
          setUploadedFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress: 100, status: 'hashing' } : f));
          setTimeout(() => {
            const fakeHash = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
            setUploadedFiles(prev => prev.map(f => f.name === file.name ? { ...f, hash: `sha256:${fakeHash}...`, status: 'done' } : f));
          }, 800);
        } else {
          setUploadedFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress: Math.min(progress, 99) } : f));
        }
      }, 100);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const runPlan = useCallback(async () => {
    if (!prompt.trim()) return;
    setPlanRunning(true);
    setPlanDone(false);
    setPlanItems(initialPlan.map(i => ({ ...i, status: 'pending' })));
    for (let i = 0; i < initialPlan.length; i++) {
      setPlanItems(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'running' } : item));
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
      const conf = 82 + Math.floor(Math.random() * 16);
      setPlanItems(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'done', confidence: conf } : item));
      setActiveWorkflowStep(Math.min(i + 1, workflowNodes.length - 1));
    }
    setPlanRunning(false);
    setPlanDone(true);
  }, [prompt]);

  useEffect(() => { if (prompt.length > 20 && !planRunning && !planDone) { const t = setTimeout(runPlan, 800); return () => clearTimeout(t); } }, [prompt]);

  const handleLaunch = () => {
    if (!name.trim()) return;
    const invPrompt = prompt.trim() || `Automated DFIR investigation for case ${caseId} (${name}).`;
    const inv: Investigation = {
      id: `inv-${Date.now()}`,
      name: name.trim(),
      caseId,
      priority: priority as Investigation['priority'],
      type: invType as Investigation['type'],
      status: 'planning',
      description: description || 'New autonomous forensic investigation.',
      prompt: invPrompt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: 'Dr. Sarah Mitchell',
      trustScore: 92,
      confidence: 88,
      progress: 15,
      evidenceCount: uploadedFiles.length,
      agentsActive: 3,
      findings: [],
    };
    addInvestigation(inv);
    uploadedFiles.forEach(uf => {
      const ev: Evidence = {
        id: `ev-${Date.now()}-${Math.random()}`,
        name: uf.name,
        type: 'disk-image',
        size: uf.size,
        hash: { md5: 'calculating...', sha256: uf.hash || 'pending...', sha512: 'pending...' },
        uploadedAt: new Date().toISOString(),
        collectedBy: 'Dr. Sarah Mitchell',
        trustScore: 95,
        status: 'queued',
        metadata: {},
        chainOfCustody: [],
        investigationId: inv.id,
        tags: [],
      };
      addEvidence(ev);
    });
    addNotification({
      id: `n-${Date.now()}`,
      type: 'success',
      title: 'Investigation Started',
      message: `${name} has been added to active investigations list.`,
      timestamp: new Date().toISOString(),
      read: false,
      investigationId: inv.id
    });
    navigate('/');
  };

  return (
    <AppLayout title="New Investigation" breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'New Investigation' }]}>
      <div className="grid grid-cols-12 gap-6 max-w-[1600px]">
        {/* LEFT PANEL */}
        <div className="col-span-12 lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-blue rounded-xl flex items-center justify-center">
                <FileSearch className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-semibold text-slate-900">Investigation Details</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Investigation Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Project Nightfall" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-slate-50 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Case ID</label>
                <input value={caseId} onChange={e => setCaseId(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-slate-50 focus:bg-white font-mono transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Priority</label>
                <div className="grid grid-cols-2 gap-2">
                  {priorities.map(p => {
                    const colors: Record<string, string> = { critical: 'border-red-400 bg-red-50 text-red-700', high: 'border-orange-400 bg-orange-50 text-orange-700', medium: 'border-amber-400 bg-amber-50 text-amber-700', low: 'border-slate-300 bg-slate-50 text-slate-600' };
                    return (
                      <button key={p} onClick={() => setPriority(p)} className={`px-2 py-1.5 text-xs font-semibold rounded-lg border-2 capitalize transition-all ${priority === p ? colors[p] : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}>{p}</button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Investigation Type</label>
                <select value={invType} onChange={e => setInvType(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-slate-50 capitalize">
                  {investigationTypes.map(t => <option key={t} value={t} className="capitalize">{t.replace('-', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Brief case description..." className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-slate-50 focus:bg-white resize-none transition-all" />
              </div>
            </div>
          </div>

          {/* Evidence Upload */}
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-slate-900 text-sm">Evidence Upload</h3>
            </div>
            <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
              <input {...getInputProps()} />
              <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragActive ? 'text-blue-500' : 'text-slate-300'}`} />
              <p className="text-xs font-medium text-slate-600">{isDragActive ? 'Drop files here' : 'Drag & drop evidence files'}</p>
              <p className="text-[10px] text-slate-400 mt-1">Supports: .E01 .bin .pcap .evtx .pst and more</p>
            </div>
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              {uploadedFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${f.status === 'done' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                    {f.status === 'done' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Loader className="w-3.5 h-3.5 text-blue-600 animate-spin" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{f.name}</p>
                    <p className="text-[10px] text-slate-400">{formatBytes(f.size)} {f.status === 'done' && `• ${f.hash.slice(0, 20)}...`}</p>
                    {f.status === 'uploading' && <div className="h-0.5 bg-slate-200 rounded mt-1"><div className="h-full bg-blue-500 rounded transition-all" style={{ width: `${f.progress}%` }} /></div>}
                    {f.status === 'hashing' && <p className="text-[10px] text-amber-600">Computing SHA-256 hash...</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER PANEL */}
        <div className="col-span-12 lg:col-span-6 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-purple rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">AI Investigation Prompt</h2>
                <p className="text-xs text-slate-500">Describe what you want to investigate</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex flex-wrap gap-2 mb-3">
                {examplePrompts.map((ep, i) => (
                  <button key={i} onClick={() => { setPrompt(ep); setPlanDone(false); }} className="text-[10px] px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors text-left">{ep.slice(0, 40)}...</button>
                ))}
              </div>
              <textarea
                value={prompt} onChange={e => { setPrompt(e.target.value); setPlanDone(false); }} rows={5}
                placeholder="e.g. Investigate the ransomware entry point and determine the initial access vector, lateral movement path, and encryption scope between 2 AM and 4 AM on August 3rd..."
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-slate-50 focus:bg-white resize-none transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={runPlan} disabled={!prompt.trim() || planRunning}
                className="flex items-center gap-2 px-5 py-2.5 gradient-blue text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all">
                {planRunning ? <Loader className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {planRunning ? 'Analyzing...' : 'Generate Plan'}
              </button>
              <button
                onClick={handleLaunch}
                disabled={!name.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl disabled:opacity-40 transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" /> Start Investigation
              </button>
            </div>
          </div>

          {/* Investigation Plan */}
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-violet-600" />
                <h3 className="font-semibold text-slate-900 text-sm">Investigation Plan</h3>
              </div>
              {planDone && <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Plan Ready</span>}
            </div>
            <div className="space-y-2">
              {planItems.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    item.status === 'done' ? 'bg-emerald-50 border-emerald-200' :
                    item.status === 'running' ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <div className="flex-shrink-0">
                    {item.status === 'done' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> :
                     item.status === 'running' ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Loader className="w-4 h-4 text-blue-500" /></motion.div> :
                     <div className="w-4 h-4 rounded-full border-2 border-slate-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-700">{item.label}</p>
                      {item.confidence && <span className="text-[10px] font-bold text-emerald-600">{item.confidence}%</span>}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.detail}</p>
                  </div>
                  {item.status === 'running' && (
                    <div className="w-16 h-1 bg-blue-100 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-blue-500 rounded-full" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1, repeat: Infinity }} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Workflow Visualization */}
        <div className="col-span-12 lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Network className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Investigation Workflow</h3>
                <p className="text-xs text-slate-500">Live pipeline progression</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-0">
              {workflowNodes.map((node, i) => {
                const isActive = i <= activeWorkflowStep && (planRunning || planDone);
                const isCurrent = i === activeWorkflowStep && planRunning;
                return (
                  <div key={node.id} className="flex flex-col items-center w-full">
                    <motion.div
                      animate={isCurrent ? { scale: [1, 1.03, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                        isActive ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-blue-500' : 'bg-slate-300'} ${isCurrent ? 'animate-pulse' : ''}`} />
                      <span className={`text-xs font-semibold ${isActive ? 'text-blue-700' : 'text-slate-400'}`}>{node.label}</span>
                      {isActive && !isCurrent && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 ml-auto" />}
                      {isCurrent && <motion.div className="ml-auto" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Loader className="w-3.5 h-3.5 text-blue-500" /></motion.div>}
                    </motion.div>
                    {i < workflowNodes.length - 1 && (
                      <div className="flex flex-col items-center my-1">
                        <motion.div className={`w-0.5 h-4 ${isActive ? 'bg-blue-400' : 'bg-slate-200'}`} />
                        <div className="w-0 h-0" style={{ borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `6px solid ${isActive ? '#60a5fa' : '#e2e8f0'}` }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {planDone && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">Plan Complete</span>
                </div>
                <div className="space-y-1 text-[11px] text-emerald-600">
                  <div className="flex justify-between"><span>Est. analysis time:</span><span className="font-bold">~45 min</span></div>
                  <div className="flex justify-between"><span>Plan confidence:</span><span className="font-bold">91%</span></div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
