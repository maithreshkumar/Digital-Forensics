export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'investigator' | 'viewer';
  avatar?: string;
  mfaEnabled: boolean;
}

export interface Investigation {
  id: string;
  name: string;
  caseId: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'ransomware' | 'insider-threat' | 'data-breach' | 'malware' | 'phishing' | 'fraud' | 'network-intrusion';
  status: 'planning' | 'collecting' | 'processing' | 'analyzing' | 'reporting' | 'complete' | 'archived';
  description: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  trustScore: number;
  confidence: number;
  progress: number;
  evidenceCount: number;
  agentsActive: number;
  findings: Finding[];
}

export interface Evidence {
  id: string;
  name: string;
  type: 'disk-image' | 'memory-dump' | 'mobile-image' | 'cloud-logs' | 'windows-event' | 'linux-logs' | 'browser-history' | 'registry' | 'email-archive' | 'usb-artifact' | 'network-capture';
  size: number;
  hash: { md5: string; sha256: string; sha512: string };
  uploadedAt: string;
  collectedBy: string;
  trustScore: number;
  status: 'queued' | 'processing' | 'verified' | 'analyzed' | 'error';
  metadata: Record<string, unknown>;
  chainOfCustody: CustodyEntry[];
  investigationId: string;
  tags: string[];
}

export interface CustodyEntry {
  id: string;
  action: 'collected' | 'transferred' | 'analyzed' | 'verified' | 'exported' | 'accessed';
  timestamp: string;
  actor: string;
  location: string;
  hash: string;
  signature: string;
  notes: string;
}

export interface Agent {
  id: string;
  name: string;
  type: 'filesystem' | 'memory' | 'malware' | 'timeline' | 'registry' | 'browser' | 'auth' | 'usb' | 'cloud' | 'network' | 'correlation' | 'reasoning' | 'report';
  status: 'idle' | 'running' | 'paused' | 'complete' | 'error';
  currentTask: string;
  progress: number;
  confidence: number;
  evidenceAnalyzed: number;
  findings: number;
  color: string;
  icon: string;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  confidence: number;
  evidenceRefs: string[];
  agentId: string;
  timestamp: string;
  category: string;
  verified: boolean;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'login' | 'file-create' | 'file-delete' | 'usb-event' | 'registry-change' | 'browser' | 'malware' | 'cloud' | 'auth' | 'network' | 'process';
  description: string;
  source: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  evidenceId?: string;
  actor?: string;
  target?: string;
  metadata: Record<string, unknown>;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  investigationId?: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  progress: number;
  confidence: number;
  artifacts: number;
  processingTime: number;
  description: string;
}

export interface Report {
  id: string;
  investigationId: string;
  type: 'executive' | 'technical' | 'legal';
  title: string;
  createdAt: string;
  status: 'generating' | 'complete';
  confidence: number;
  sections: ReportSection[];
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  evidenceRefs: string[];
}
