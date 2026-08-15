import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Shield, CheckCircle, Download,
  AlertTriangle, Clock, User,
  BarChart2, Eye, GitBranch, Award, FileBarChart,
  Loader, ExternalLink
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useStore } from '../store';

const tabs = [
  { id: 'executive', label: 'Executive Report', icon: Award },
  { id: 'technical', label: 'Technical Report', icon: FileBarChart },
  { id: 'verification', label: 'Verification', icon: Shield },
  { id: 'custody', label: 'Chain of Custody', icon: GitBranch },
];

const executiveSections = [
  {
    title: 'Incident Summary',
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    content: 'A sophisticated ransomware attack (BlackCat/ALPHV v3.1) was executed against CORP financial systems on August 3, 2026, between 01:53 AM and 02:17 AM. The incident was initiated through a targeted spear-phishing email delivered to the finance department, resulting in encryption of 284,750 files across 47 workstations.',
  },
  {
    title: 'Timeline Overview',
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    content: '01:53 AM — Phishing email opened\n01:55 AM — Malicious macro executed\n02:05 AM — Credential theft via LSASS\n02:10 AM — SMB lateral movement (7 hosts)\n02:15 AM — Domain admin compromise\n02:17 AM — Ransomware deployment via GPO\n02:17:45 AM — 284,750 files encrypted',
  },
  {
    title: 'Key Findings',
    icon: Eye,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    findings: [
      { severity: 'critical', text: 'BlackCat/ALPHV v3.1 ransomware deployed via compromised Domain Controller' },
      { severity: 'critical', text: 'Initial access via spear-phishing — macro-enabled Excel document (T1566.001)' },
      { severity: 'high', text: 'Credential theft using LSASS memory access (T1003.001)' },
      { severity: 'high', text: 'Lateral movement via SMB across 7 workstations (T1021.002)' },
      { severity: 'medium', text: 'Persistence via Registry Run key on FINANCE-WS01' },
    ],
  },
  {
    title: 'Risk Assessment',
    icon: BarChart2,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    content: 'Overall Risk: CRITICAL\n\n• Data at Risk: Financial records, contracts, PII (284,750 files)\n• Business Impact: High — core financial operations disrupted\n• Recovery Complexity: High — domain-wide encryption\n• Estimated Downtime: 72–120 hours without backup restoration\n• Regulatory Exposure: GDPR, PCI-DSS notification may be required',
  },
];

const technicalFindings = [
  { id: 'T-001', title: 'Initial Access — Spear Phishing', mitre: 'T1566.001', confidence: 96, evidenceRefs: ['ev-001', 'ev-005'], agent: 'Malware Analysis Agent', severity: 'critical', detail: 'Email delivered from invoice@malicious-domain.com with Invoice_Q3_2026.xlsm. VBA macro downloaded PowerShell dropper from 185.220.101.47.' },
  { id: 'T-002', title: 'Execution — Malicious Macro', mitre: 'T1059.001', confidence: 98, evidenceRefs: ['ev-001', 'ev-002'], agent: 'File System Agent', severity: 'critical', detail: 'EXCEL.EXE spawned cmd.exe → powershell.exe with encoded command. Parent-child process chain confirmed across 3 evidence sources.' },
  { id: 'T-003', title: 'Credential Access — LSASS Dump', mitre: 'T1003.001', confidence: 94, evidenceRefs: ['ev-002'], agent: 'Memory Analysis Agent', severity: 'critical', detail: 'svchost32.exe opened LSASS handle with PROCESS_VM_READ access. 3 credential sets extracted. Confirmed in memory dump analysis.' },
  { id: 'T-004', title: 'Lateral Movement — SMB', mitre: 'T1021.002', confidence: 91, evidenceRefs: ['ev-003', 'ev-004'], agent: 'Network Analysis Agent', severity: 'high', detail: 'SMB connections from 192.168.1.105 to 7 internal hosts. Port 445 traversal with stolen Administrator credentials confirmed.' },
  { id: 'T-005', title: 'Persistence — Registry Run Key', mitre: 'T1547.001', confidence: 95, evidenceRefs: ['ev-001', 'ev-004'], agent: 'Registry Analysis Agent', severity: 'high', detail: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\SystemHelper = C:\\Windows\\Temp\\svchost32.exe added at 01:58 AM.' },
  { id: 'T-006', title: 'Impact — Data Encryption', mitre: 'T1486', confidence: 99, evidenceRefs: ['ev-001', 'ev-002', 'ev-003'], agent: 'Malware Analysis Agent', severity: 'critical', detail: 'BlackCat v3.1 using ChaCha20 symmetric + RSA-4096 asymmetric encryption. 284,750 files encrypted. Ransom note placed on all affected systems.' },
];

const verificationItems = [
  { label: 'Evidence Hash Verification', status: 'pass', detail: '24/24 artifacts verified', count: 24 },
  { label: 'Chain of Custody Integrity', status: 'pass', detail: 'All transfers documented', count: 18 },
  { label: 'Agent Execution Integrity', status: 'pass', detail: 'All agent logs signed', count: 13 },
  { label: 'Cross-Agent Validation', status: 'pass', detail: '47 cross-references confirmed', count: 47 },
  { label: 'Timestamp Consistency', status: 'warning', detail: '1 minor anomaly in network capture', count: 1 },
  { label: 'AI Explainability Score', status: 'pass', detail: '100% of findings traceable to evidence', count: 100 },
];

const custodyEntries = [
  { id: 'ev-001', name: 'FINANCE-WS01-disk.E01', collector: 'Dr. Sarah Mitchell', collected: '2026-08-03 02:50', location: 'Finance Dept, Floor 3', hash: 'sha256:abc123...', transfers: 3, integrity: 'verified' },
  { id: 'ev-002', name: 'DC01-memory-dump.bin', collector: 'Dr. Sarah Mitchell', collected: '2026-08-03 03:15', location: 'Server Room B', hash: 'sha256:def456...', transfers: 2, integrity: 'verified' },
  { id: 'ev-003', name: 'network-capture-0803.pcap', collector: 'Agent Marcus Chen', collected: '2026-08-03 03:30', location: 'Network Operations', hash: 'sha256:ghi789...', transfers: 2, integrity: 'verified' },
  { id: 'ev-004', name: 'windows-event-logs.evtx', collector: 'Dr. Sarah Mitchell', collected: '2026-08-03 03:45', location: 'Finance Dept, Floor 3', hash: 'sha256:jkl012...', transfers: 1, integrity: 'verified' },
  { id: 'ev-005', name: 'phishing-email-attachment.msg', collector: 'Agent Lisa Park', collected: '2026-08-03 04:00', location: 'Email Security Gateway', hash: 'sha256:mno345...', transfers: 2, integrity: 'verified' },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState<'executive' | 'technical' | 'verification' | 'custody'>('executive');
  const { activeInvestigation } = useStore();
  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = (_format: string) => {
    setExportLoading(true);
    setTimeout(() => setExportLoading(false), 1500);
  };

  const severityColors: Record<string, string> = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <AppLayout title="Reports & Verification" breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Reports & Verification' }]}>
      {/* Report Header */}
      <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5 mb-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl gradient-blue flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">{activeInvestigation?.name || 'Project Nightfall'}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{activeInvestigation?.caseId} • Generated {new Date().toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">94% Trust Score</span>
            </div>
            <div className="flex gap-1">
              {['PDF', 'DOCX', 'JSON'].map(fmt => (
                <button key={fmt} onClick={() => handleExport(fmt)}
                  disabled={exportLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-70">
                  {exportLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-white rounded-2xl border border-slate-100 card-shadow p-1.5 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? 'gradient-blue text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* EXECUTIVE REPORT */}
        {activeTab === 'executive' && (
          <motion.div key="executive" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Confidence banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-xs text-white/70 mb-1 uppercase tracking-wider font-semibold">AI-Generated Executive Summary</p>
                  <h2 className="text-lg font-bold">Project Nightfall — Ransomware Incident Report</h2>
                  <p className="text-sm text-white/80 mt-1">CASE-2026-0847 • August 3, 2026 • CONFIDENTIAL</p>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  {[{ label: 'Confidence', value: '93%' }, { label: 'Trust Score', value: '94%' }, { label: 'Findings', value: '6' }].map(s => (
                    <div key={s.label}>
                      <div className="text-2xl font-bold">{s.value}</div>
                      <div className="text-xs text-white/60">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {executiveSections.map((section, i) => {
                const Icon = section.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`w-8 h-8 rounded-xl ${section.bg} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${section.color}`} />
                      </div>
                      <h3 className="font-semibold text-slate-900">{section.title}</h3>
                    </div>
                    {section.content && (
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{section.content}</p>
                    )}
                    {section.findings && (
                      <div className="space-y-2">
                        {section.findings.map((f, j) => (
                          <div key={j} className={`flex items-start gap-2 p-2.5 rounded-xl border ${severityColors[f.severity]}`}>
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span className="text-xs">{f.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* TECHNICAL REPORT */}
        {activeTab === 'technical' && (
          <motion.div key="technical" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-4">
              <h3 className="font-semibold text-slate-900 mb-3 text-sm">Detailed Technical Findings — MITRE ATT&CK® Mapping</h3>
              <div className="space-y-3">
                {technicalFindings.map((finding, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-4 p-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-[10px] font-bold text-slate-500">{finding.id}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${severityColors[finding.severity]}`}>{finding.severity}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-full font-mono font-bold">{finding.mitre}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900">{finding.title}</h4>
                        <p className="text-xs text-slate-600 mt-1">{finding.detail}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" />{finding.agent}</span>
                          <span className="text-emerald-600 font-semibold">{finding.confidence}% confidence</span>
                          <span className="flex gap-1">{finding.evidenceRefs.map(ref => (
                            <span key={ref} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-mono">{ref}</span>
                          ))}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* VERIFICATION */}
        {activeTab === 'verification' && (
          <motion.div key="verification" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[{ label: 'Overall Trust Score', value: '94%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Verified Artifacts', value: '24/24', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'AI Explainability', value: '100%', color: 'text-violet-600', bg: 'bg-violet-50' }].map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-white`}>
                  <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
                  <div className="text-xs text-slate-600">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5 space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm mb-4">Verification Checks</h3>
              {verificationItems.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                  className={`flex items-center gap-4 p-3.5 rounded-xl border ${item.status === 'pass' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                  {item.status === 'pass' ? <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${item.status === 'pass' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.status === 'pass' ? 'PASS' : 'REVIEW'}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CHAIN OF CUSTODY */}
        {activeTab === 'custody' && (
          <motion.div key="custody" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 text-sm">Evidence Chain of Custody Log</h3>
                <p className="text-xs text-slate-500 mt-0.5">Complete lifecycle documentation for all collected evidence artifacts</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold tracking-wide">
                      {['Evidence ID', 'File Name', 'Collector', 'Collected', 'Location', 'Hash', 'Transfers', 'Integrity'].map(h => (
                        <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {custodyEntries.map((entry, i) => (
                      <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
                        className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono font-semibold text-blue-600">{entry.id}</td>
                        <td className="px-4 py-3 font-medium text-slate-800 max-w-48 truncate">{entry.name}</td>
                        <td className="px-4 py-3 text-slate-600">{entry.collector}</td>
                        <td className="px-4 py-3 font-mono text-slate-500">{entry.collected}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-36 truncate">{entry.location}</td>
                        <td className="px-4 py-3 font-mono text-slate-500">{entry.hash}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">{entry.transfers}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[10px] font-bold ${entry.integrity === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            <CheckCircle className="w-2.5 h-2.5" /> {entry.integrity}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
