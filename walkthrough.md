# AI Autonomous Digital Forensics Investigator — Full System Walkthrough

This document provides a comprehensive guide on **how the application works**, its **architecture**, and **step-by-step instructions** to start both the Django backend server and the React frontend UI.

---

## 1. System Architecture & How the Application Works

```text
                EXISTING UI (React + Vite)
                            │
                            ▼
           DJANGO REST BACKEND (v1 API)
                            │
             ┌──────────────┴──────────────┬─────────────────────────┐
             ▼                             ▼                         ▼
     CASE MANAGEMENT              EVIDENCE INGESTION         AUDIT & CUSTODY
  (MySQL DB Persistence)                  │
             │                   STREAMING HASHING
             │                 (SHA-256 / SHA-512)
             │                            │
             │                 IMMUTABLE CHAIN OF CUSTODY
             │                            │
             │                INTEGRITY VERIFICATION
             │              (Tamper Detection -> COMPROMISED)
             │                            │
             │                 CONTENT EXTRACTION
             │              (PDF, DOCX, TXT, CSV, JSON)
             │                            │
             │                PROVENANCE CHUNKING
             │                            │
             │                EMBEDDING ENGINE
             │           (Deterministic / Local / API)
             │                            │
             └──────────────► CASE-ISOLATED VECTOR STORE
                                          │
                                          ▼
                              RAG RETRIEVAL ENGINE
                        (Strict Case & Compromise Isolation)
                                          │
                                          ▼
                            PROMPT INJECTION SANITIZATION
                                          │
                                          ▼
                                PLUGGABLE AI PROVIDER
                       (Qwen2.5-1.5B / Local / API / Rule-Based)
                                          │
                                          ▼
                            INDEPENDENT VERIFICATION ENGINE
                        (Fact & Claim Evidence Citation)
                                          │
                                          ▼
                                STRUCTURED FINDINGS &
                               FORENSIC REPORT EXPORT
```

---

## 2. Key System Capabilities & Design

### A. Unrestricted Single-Admin Model
- The logged-in user is the sole **System Administrator (Admin)** with full access across all cases, evidence artifacts, settings, and audit logs.
- Role-Based Access Control (RBAC) restrictions have been removed to give the user immediate, unhindered operational control.

### B. Database Persistence (Local MySQL + Django REST API + Storage Sync)
- New cases created via the **"Start Investigation"** quick modal or the `/new-investigation` page are immediately persisted into the local **MySQL database** (`dfir_db`) via `POST /api/v1/cases/`.
- Across browser refreshes or reloads, all cases are automatically fetched from `http://localhost:8000/api/v1/cases/` and cached locally, ensuring **zero data loss**.

### C. Per-Prompt 10-Stage Autonomous Pipeline
Every user query sent in the Live Workspace triggers the full 10-stage forensic analysis pipeline:
1. **User Prompt & Intent Analysis**: Intent parsed & temporal/asset scope extracted.
2. **Task Orchestration Engine**: Tasks scheduled across forensic worker nodes.
3. **Evidence & Vector Retrieval**: Queries case-isolated MySQL/RAG vector store.
4. **Verification & SHA-256 Baseline**: Validates cryptographic hashes against baseline ingestion records.
5. **Security & Prompt Injection Defense**: Sanitizes input context against prompt overrides.
6. **Multi-Agent Investigation**: Deploys Triage, Disk, Memory, Network, and Timeline agents.
7. **Reasoning & Hypothesis Engine**: Evaluates evidence context for key indicators.
8. **Fact Verification Engine**: Grounding claims against original evidence files.
9. **Explainable Response Generation**: Calculates trust score and confidence percentage.
10. **Final Forensic Output**: Emits structured response with evidence citations (`ev-001`, `ev-005`), `96% confidence`, and `Hash Verified` status badge.

### D. Forensic Principles & Evidence Integrity
- **Cryptographic Hashing**: Computes streaming SHA-256 and SHA-512 hashes on evidence ingestion.
- **Chain of Custody**: Append-only log tracking all evidence transfers and analysis events.
- **Tamper Protection**: Any evidence hash mismatch sets status to `COMPROMISED` and automatically excludes its chunks from AI retrieval.
- **Case Isolation**: Vector searches strictly enforce `case_id = current_case_id`.

---

## 3. How to Start the Application

### Step 1: Start the Django Backend Server

Open a terminal in the root project directory (`DF Project`):

```powershell
# 1. Activate Python Virtual Environment
.\env\Scripts\activate.ps1

# 2. Navigate to backend directory
cd backend

# 3. Start Django Server on Port 8000
python manage.py runserver 8000
```
> **Backend Endpoint**: `http://localhost:8000/api/v1/`

---

### Step 2: Start the React Frontend Application

Open a second terminal in the root project directory (`DF Project`):

```powershell
# 1. Navigate to frontend directory
cd dfir-platform

# 2. Run Vite Dev Server
npm run dev
```
> **Frontend Application**: `http://localhost:3000` (or `http://localhost:5173`)

---

### Step 3: Run the Automated Forensic Test Suite

To run the automated backend test suite (hashing, RAG isolation, tampering defense, verification engine, extractors, and AI providers):

```powershell
# Make sure virtual environment is activated
.\env\Scripts\activate.ps1

# Run tests via manage.py inside backend directory
cd backend
python manage.py test tests
```

---

## 4. UI Navigation Quick Reference

| Page / Feature | URL Route | Description |
| :--- | :--- | :--- |
| **Security Operations Dashboard** | `/#/` | Overview of active cases, trust metrics, recent investigations feed, and the primary **"Start Investigation"** quick launcher button. |
| **Live Investigation Workspace** | `/#/workspace` | Interactive workspace with Evidence Explorer, live 10-Stage Pipeline visualizer, and Autonomous Forensic AI Assistant. |
| **New Investigation Planner** | `/#/new-investigation` | Comprehensive case configuration, scope definition, evidence file drag-and-drop, and automated plan generator. |
| **Evidence Vault** | `/#/evidence` | Cryptographic evidence repository displaying SHA-256/SHA-512 hashes, chain of custody logs, and integrity status. |
| **Reports & Verification** | `/#/reports` | Exportable forensic reports, claim verification matrices, and court-admissible audit summary documents. |
| **Settings & Audit Logs** | `/#/settings` | System Administrator profile details, MFA controls, and platform audit trail logs. |
