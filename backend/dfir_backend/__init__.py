import os
import pymysql
from pathlib import Path
from dotenv import load_dotenv

pymysql.install_as_MySQLdb()

# Ensure environment variables are loaded
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

def ensure_database_exists():
    host = os.getenv('MYSQL_HOST', 'localhost')
    try:
        port = int(os.getenv('MYSQL_PORT', '3306'))
    except ValueError:
        port = 3306
    user = os.getenv('MYSQL_USER', 'root')
    password = os.getenv('MYSQL_PASSWORD', '')
    db_name = os.getenv('MYSQL_DATABASE', 'dfir_db')

    try:
        connection = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            connect_timeout=3
        )
        with connection.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4;")
        connection.close()
    except Exception:
        pass

ensure_database_exists()
