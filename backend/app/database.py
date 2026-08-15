"""
Database layer — connects to local MySQL database using configurable environment variables,
with in-memory fallback store if MySQL is temporarily offline.
"""
from typing import Optional, Dict, Any, List
import logging
import pymysql
from app.config import settings
from app.data.seed import get_seed_data

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# In-memory store fallback
# ---------------------------------------------------------------------------
_store: Dict[str, List[Dict[str, Any]]] = {}

def _init_store():
    global _store
    seed = get_seed_data()
    _store = {
        "users": seed["users"],
        "investigations": seed["investigations"],
        "evidence": seed["evidence"],
        "agents": seed["agents"],
        "notifications": seed["notifications"],
        "timeline_events": seed["timeline_events"],
        "findings": seed["findings"],
        "audit_logs": [],
        "reports": seed["reports"],
        "custody_entries": seed["custody_entries"],
        "agent_tasks": [],
    }

_init_store()

# ---------------------------------------------------------------------------
# Local MySQL connection helper
# ---------------------------------------------------------------------------
def get_mysql_connection():
    """Returns PyMySQL connection using configurable host, port, user, password, db."""
    try:
        conn = pymysql.connect(
            host=settings.mysql_host,
            port=settings.mysql_port,
            user=settings.mysql_user,
            password=settings.mysql_password,
            database=settings.mysql_database,
            cursorclass=pymysql.cursors.DictCursor,
            connect_timeout=3
        )
        return conn
    except Exception as e:
        logger.warning(f"Local MySQL connection unavailable: {e}")
        return None

# ---------------------------------------------------------------------------
# Generic CRUD helpers — queries local MySQL, falls back to in-memory store
# ---------------------------------------------------------------------------
def db_find_all(table: str, filters: Optional[Dict] = None) -> List[Dict]:
    conn = get_mysql_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                query = f"SELECT * FROM `{table}`"
                params = []
                if filters:
                    where_clauses = [f"`{k}` = %s" for k in filters.keys()]
                    query += " WHERE " + " AND ".join(where_clauses)
                    params = list(filters.values())
                cursor.execute(query, params)
                results = cursor.fetchall()
                conn.close()
                return list(results)
        except Exception as e:
            logger.warning(f"MySQL query failed ({table}): {e}")
            if conn:
                conn.close()

    rows = _store.get(table, [])
    if filters:
        for k, v in filters.items():
            rows = [r for r in rows if r.get(k) == v]
    return rows

def db_find_one(table: str, id_value: str, id_field: str = "id") -> Optional[Dict]:
    rows = db_find_all(table, {id_field: id_value})
    return rows[0] if rows else None

def db_insert(table: str, data: Dict) -> Dict:
    conn = get_mysql_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                columns = ", ".join([f"`{k}`" for k in data.keys()])
                placeholders = ", ".join(["%s"] * len(data))
                query = f"INSERT INTO `{table}` ({columns}) VALUES ({placeholders})"
                cursor.execute(query, list(data.values()))
                conn.commit()
                conn.close()
                return data
        except Exception as e:
            logger.warning(f"MySQL insert failed ({table}): {e}")
            if conn:
                conn.close()

    _store.setdefault(table, []).append(data)
    return data

def db_update(table: str, id_value: str, data: Dict, id_field: str = "id") -> Optional[Dict]:
    conn = get_mysql_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                set_clause = ", ".join([f"`{k}` = %s" for k in data.keys()])
                query = f"UPDATE `{table}` SET {set_clause} WHERE `{id_field}` = %s"
                params = list(data.values()) + [id_value]
                cursor.execute(query, params)
                conn.commit()
                conn.close()
                return db_find_one(table, id_value, id_field)
        except Exception as e:
            logger.warning(f"MySQL update failed ({table}): {e}")
            if conn:
                conn.close()

    rows = _store.get(table, [])
    for i, row in enumerate(rows):
        if row.get(id_field) == id_value:
            rows[i] = {**row, **data}
            return rows[i]
    return None

def db_delete(table: str, id_value: str, id_field: str = "id") -> bool:
    conn = get_mysql_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                query = f"DELETE FROM `{table}` WHERE `{id_field}` = %s"
                cursor.execute(query, [id_value])
                conn.commit()
                conn.close()
                return True
        except Exception as e:
            logger.warning(f"MySQL delete failed ({table}): {e}")
            if conn:
                conn.close()

    rows = _store.get(table, [])
    original_len = len(rows)
    _store[table] = [r for r in rows if r.get(id_field) != id_value]
    return len(_store[table]) < original_len
