# AI Autonomous Digital Forensics Investigator — Full System Walkthrough

This document outlines the complete 21-phase implementation and validation of the **AI-Powered Autonomous Digital Forensics Investigator** Django backend and frontend integrations.

---

## 1. Multi-Phase Forensic Architecture

```text
                               EXISTING UI (React + Vite)
                                          │
                                          ▼
                             DJANGO REST BACKEND (v1 API)
                                          │
    ┌─────────────────────────┬───────────┴───────────┬─────────────────────────┐
    ▼                         ▼                       ▼                         ▼
ACCOUNTS & RBAC        CASE MANAGEMENT        EVIDENCE INGESTION         AUDIT & CUSTODY
                              │                       │
                              │             STREAMING HASHING
                              │             (SHA-256 / SHA-512)
                              │                       │
                              │           IMMUTABLE CHAIN OF CUSTODY
                              │                       │
                              │          INTEGRITY VERIFICATION
                              │        (Tamper Detection -> COMPROMISED)
                              │                       │
                              │           CONTENT EXTRACTION
                              │        (PDF, DOCX, TXT, CSV, JSON)
                              │                       │
                              │          PROVENANCE CHUNKING
                              │                       │
                              │          EMBEDDING ENGINE
                              │     (Deterministic / Local / API)
                              │                       │
                              └──────────► CASE-ISOLATED VECTOR STORE
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
                                   (Qwen2.5-1.5B / Other Local / API / Rule-Based)
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

## 2. UI Investigation Workflows

1. **Start Investigation (Dashboard Quick Launcher)**:
   - Primary **"Start Investigation"** button on the Security Operations Dashboard.
   - Instantly opens a case modal, creates the investigation record, adds it to the active list, and refreshes the investigations feed.
2. **New Investigation Workflow Page (`/new-investigation`)**:
   - Comprehensive case planner and evidence uploader with the **"Start Investigation"** trigger.
   - Automatically initializes the multi-agent investigation pipeline and routes back to the dashboard with the new investigation featured at the top.

---

## 3. How to Run Backend & Test Suite

```powershell
# 1. Activate Python virtual environment
.\env\Scripts\activate.ps1

# 2. Navigate to backend directory
cd backend

# 3. Run automated forensic test suite
python -m unittest discover -s tests

# 4. Start Django development server
python manage.py runserver 8000
```
