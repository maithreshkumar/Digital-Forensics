from django.core.management.base import BaseCommand
from api.models import (
    DFIRUser, Investigation, Evidence, Agent, Notification,
    TimelineEvent, Finding, AuditLog, Report, CustodyEntry
)
from app.data.seed import get_seed_data

class Command(BaseCommand):
    help = 'Seeds the local MySQL database with DFIR mock data'

    def handle(self, *args, **options):
        self.stdout.write("Seeding local MySQL database...")
        seed = get_seed_data()

        # Seed Users
        for item in seed.get("users", []):
            DFIRUser.objects.update_or_create(
                id=item["id"],
                defaults={
                    "name": item["name"],
                    "email": item["email"],
                    "password_hash": item.get("password_hash", ""),
                    "role": item.get("role", "investigator"),
                    "mfa_enabled": item.get("mfa_enabled", False),
                }
            )

        # Seed Investigations / Cases
        for item in seed.get("investigations", []):
            Investigation.objects.update_or_create(
                id=item["id"],
                defaults={
                    "name": item["name"],
                    "case_id": item["case_id"],
                    "priority": item.get("priority", "medium"),
                    "type": item.get("type", "general"),
                    "status": item.get("status", "processing"),
                    "description": item.get("description", ""),
                    "prompt": item.get("prompt", ""),
                    "assigned_to": item.get("assigned_to", ""),
                    "trust_score": item.get("trust_score", 90),
                    "confidence": item.get("confidence", 85),
                    "progress": item.get("progress", 0),
                    "evidence_count": item.get("evidence_count", 0),
                    "agents_active": item.get("agents_active", 0),
                }
            )

        # Seed Evidence
        for item in seed.get("evidence", []):
            Evidence.objects.update_or_create(
                id=item["id"],
                defaults={
                    "name": item["name"],
                    "type": item["type"],
                    "size": item.get("size", 0),
                    "hash_md5": item.get("hash_md5", ""),
                    "hash_sha256": item.get("hash_sha256", ""),
                    "hash_sha512": item.get("hash_sha512", ""),
                    "collected_by": item.get("collected_by", ""),
                    "trust_score": item.get("trust_score", 95),
                    "status": item.get("status", "verified"),
                    "metadata": item.get("metadata", {}),
                    "investigation_id": item.get("investigation_id", ""),
                    "tags": item.get("tags", []),
                }
            )

        # Seed Agents
        for item in seed.get("agents", []):
            Agent.objects.update_or_create(
                id=item["id"],
                defaults={
                    "name": item["name"],
                    "type": item["type"],
                    "status": item.get("status", "idle"),
                    "current_task": item.get("current_task", ""),
                    "progress": item.get("progress", 0),
                    "confidence": item.get("confidence", 90),
                    "evidence_analyzed": item.get("evidence_analyzed", 0),
                    "findings": item.get("findings", 0),
                    "color": item.get("color", "#2563eb"),
                    "icon": item.get("icon", "Cpu"),
                }
            )

        # Seed Notifications
        for item in seed.get("notifications", []):
            Notification.objects.update_or_create(
                id=item["id"],
                defaults={
                    "title": item["title"],
                    "message": item["message"],
                    "type": item.get("type", "info"),
                    "time": item.get("time", ""),
                    "read": item.get("read", False),
                    "investigation_id": item.get("investigation_id", ""),
                }
            )

        # Seed Timeline Events
        for item in seed.get("timeline_events", []):
            TimelineEvent.objects.update_or_create(
                id=item["id"],
                defaults={
                    "timestamp": item.get("timestamp", ""),
                    "description": item.get("description", item.get("title", "")),
                    "source": item.get("source", ""),
                    "severity": item.get("severity", "medium"),
                    "case_id": item.get("investigation_id", ""),
                }
            )

        # Seed Findings
        for item in seed.get("findings", []):
            Finding.objects.update_or_create(
                id=item["id"],
                defaults={
                    "title": item["title"],
                    "severity": item.get("severity", "medium"),
                    "category": item.get("category", ""),
                    "confidence": item.get("confidence", 90),
                    "description": item.get("description", ""),
                    "case_id": item.get("investigation_id", ""),
                }
            )

        # Seed Reports
        for item in seed.get("reports", []):
            Report.objects.update_or_create(
                id=item["id"],
                defaults={
                    "title": item["title"],
                    "case_id": item.get("case_id", item.get("investigation_id", "inv-001")),
                    "status": item.get("status", "complete"),
                }
            )

        # Seed Custody Entries
        for item in seed.get("custody_entries", []):
            CustodyEntry.objects.update_or_create(
                id=item["id"],
                defaults={
                    "evidence_id": item["evidence_id"],
                    "action": item.get("action", "ACQUIRED"),
                    "actor": item.get("performed_by", "Investigator"),
                    "notes": item.get("notes", ""),
                    "hash": item.get("verification_hash", ""),
                }
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded local MySQL database!"))
