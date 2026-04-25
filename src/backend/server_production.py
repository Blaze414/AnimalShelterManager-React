#!/usr/bin/env python3
"""
Production server: serves API + static files from dist/.
Handles client-side routing (all non-API routes → index.html).
"""

from __future__ import annotations

import json
import os
import sqlite3
from datetime import UTC, datetime, timedelta
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
DIST_DIR = ROOT_DIR / "dist"
DB_PATH = DATA_DIR / "shelter.db"
HOST = os.environ.get("SHELTER_API_HOST", "127.0.0.1")
PORT = int(os.environ.get("SHELTER_API_PORT", "8000"))

ANIMAL_STATUSES = ("Available", "Medical Check", "Adopted", "Quarantine")
MEDICAL_STATUSES = ("Completed", "Scheduled", "In Progress")
REPORT_STATUSES = ("Ready", "Processing")


def utc_now() -> datetime:
    return datetime.now(UTC)


def db_connection() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db() -> None:
    with db_connection() as connection:
        cursor = connection.cursor()
        cursor.executescript(
            """
            CREATE TABLE IF NOT EXISTS animals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                species TEXT NOT NULL,
                breed TEXT NOT NULL,
                age TEXT NOT NULL,
                gender TEXT NOT NULL,
                weight TEXT NOT NULL,
                status TEXT NOT NULL,
                arrived_date TEXT NOT NULL,
                behavior TEXT NOT NULL,
                description TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS medical_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                animal_id INTEGER NOT NULL,
                type TEXT NOT NULL,
                doctor TEXT NOT NULL,
                date TEXT NOT NULL,
                status TEXT NOT NULL,
                notes TEXT NOT NULL,
                FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                date TEXT NOT NULL,
                status TEXT NOT NULL,
                format TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS financial_entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                month TEXT NOT NULL UNIQUE,
                donations INTEGER NOT NULL,
                adoptions INTEGER NOT NULL,
                expenses INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                initials TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS animal_overview (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                month TEXT NOT NULL UNIQUE,
                animals INTEGER NOT NULL
            );
            """
        )

        existing_animals = cursor.execute("SELECT COUNT(*) FROM animals").fetchone()[0]
        if existing_animals:
            return

        now_iso = utc_now().isoformat()
        animals = [
            ("Max", "Dog", "German Shepherd", "3 years", "Male", "30 kg", "Available", "2024-01-15", "Friendly, Active, Trained", "Max is a friendly and energetic German Shepherd who loves to play and learn new tricks. He's great with children and other dogs.", now_iso),
            ("Luna", "Cat", "Siamese", "2 years", "Female", "4 kg", "Medical Check", "2024-01-20", "Calm, Independent", "Luna is a beautiful Siamese cat with striking blue eyes. She enjoys lounging in sunny spots and gentle pets.", now_iso),
            ("Charlie", "Dog", "Labrador Retriever", "4 years", "Male", "28 kg", "Adopted", "2024-02-02", "Gentle, Playful", "Charlie is a steady, social Labrador who thrives on walks and training sessions.", now_iso),
            ("Milo", "Cat", "Domestic Shorthair", "1 year", "Male", "5 kg", "Available", "2024-03-11", "Curious, Social", "Milo is an outgoing young cat who adapts quickly and enjoys busy spaces.", now_iso),
            ("Bella", "Rabbit", "Mini Lop", "18 months", "Female", "2 kg", "Quarantine", "2024-04-04", "Quiet, Sweet", "Bella is gentle and easy to handle while she finishes intake checks.", now_iso),
            ("Coco", "Bird", "Cockatiel", "2 years", "Female", "0.1 kg", "Available", "2024-05-10", "Alert, Vocal", "Coco is a bright cockatiel who responds well to calm routines and enrichment.", now_iso),
        ]
        cursor.executemany(
            """
            INSERT INTO animals (
                name, species, breed, age, gender, weight, status,
                arrived_date, behavior, description, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            animals,
        )

        medical_records = [
            (1, "Vaccination", "Dr. Smith", "2024-02-01", "Completed", "Annual vaccines updated"),
            (1, "Health Check", "Dr. Smith", "2024-01-16", "Completed", "General health assessment upon arrival"),
            (2, "Health Check", "Dr. Johnson", "2024-01-20", "Scheduled", "Annual vaccination follow-up"),
            (3, "Dental Exam", "Dr. Adams", "2024-02-20", "Completed", "Routine cleaning completed"),
            (4, "Neutering", "Dr. Nguyen", "2024-03-18", "Completed", "Recovery was smooth and uneventful"),
            (5, "Quarantine Intake", "Dr. Patel", "2024-04-04", "In Progress", "Monitoring appetite and hydration"),
            (6, "Wing Check", "Dr. Johnson", "2024-05-12", "Scheduled", "Follow-up exam booked after intake"),
        ]
        cursor.executemany(
            """
            INSERT INTO medical_records (
                animal_id, type, doctor, date, status, notes
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            medical_records,
        )

        reports = [
            ("Monthly Animal Statistics", "Statistics", "2024-06-01", "Ready", "PDF"),
            ("Q2 Donation Summary", "Financial", "2024-06-03", "Ready", "Excel"),
            ("Annual Medical Summary", "Medical", "2024-06-04", "Processing", "PDF"),
            ("Adoption Pipeline Review", "Operations", "2024-06-06", "Ready", "PDF"),
        ]
        cursor.executemany(
            "INSERT INTO reports (title, category, date, status, format) VALUES (?, ?, ?, ?)",
            reports,
        )

        financial_entries = [
            ("Jan", 3500, 1500, 5200),
            ("Feb", 6200, 2100, 4800),
            ("Mar", 3200, 1800, 5000),
            ("Apr", 6500, 2500, 3000),
            ("May", 4500, 3000, 5500),
            ("Jun", 5200, 2000, 6800),
        ]
        cursor.executemany(
            "INSERT INTO financial_entries (month, donations, adoptions, expenses) VALUES (?, ?, ?, ?)",
            financial_entries,
        )

        now = utc_now()
        activities = [
            ("New Animal", "Max - German Shepherd was added to the shelter", "JD", (now.replace(microsecond=0) - timedelta(hours=2)).isoformat()),
            ("Medical Check", "Luna received her annual vaccination follow-up", "SS", (now.replace(microsecond=0) - timedelta(hours=4)).isoformat()),
            ("Adoption", "Charlie completed the adoption process", "AR", (now.replace(microsecond=0) - timedelta(hours=6)).isoformat()),
            ("Intake", "Bella entered quarantine for observation", "NP", (now.replace(microsecond=0) - timedelta(days=1)).isoformat()),
        ]
        cursor.executemany(
            "INSERT INTO activities (title, description, initials, created_at) VALUES (?, ?, ?, ?)",
            activities,
        )

        overview = [
            ("Jan", 10),
            ("Feb", 15),
            ("Mar", 18),
            ("Apr", 12),
            ("May", 22),
            ("Jun", 28),
        ]
        cursor.executemany(
            "INSERT INTO animal_overview (month, animals) VALUES (?, ?)",
            overview,
        )
        connection.commit()


def format_currency(amount: int) -> str:
    return f"${amount:,.0f}"


def format_relative_time(timestamp: str) -> str:
    created_at = datetime.fromisoformat(timestamp)
    delta = utc_now() - created_at
    seconds = max(int(delta.total_seconds()), 0)
    if seconds < 60:
        return "Just now"
    if seconds < 3600:
        minutes = seconds // 60
        return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
    if seconds < 86400:
        hours = seconds // 3600
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    days = seconds // 86400
    return f"{days} day{'s' if days != 1 else ''} ago"


def required_animal_fields() -> tuple[str, ...]:
    return (
        "name",
        "species",
        "breed",
        "age",
        "gender",
        "weight",
        "status",
        "description",
        "behavior",
    )


def validate_animal_payload(payload: dict[str, Any]) -> None:
    missing_fields = [field for field in required_animal_fields() if not str(payload.get(field, "")).strip()]
    if missing_fields:
        raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

    status = str(payload["status"]).strip()
    if status not in ANIMAL_STATUSES:
        raise ValueError(f"Unsupported animal status: {status}")


def sync_intake_note(cursor: sqlite3.Cursor, animal_id: int, arrived_date: str, medical_history: str) -> None:
    existing_note = cursor.execute(
        """
        SELECT id
        FROM medical_records
        WHERE animal_id = ? AND type = 'Intake Note'
        ORDER BY date(date) DESC, id DESC
        LIMIT 1
        """,
        (animal_id,),
    ).fetchone()

    if medical_history:
        if existing_note is None:
            cursor.execute(
                """
                INSERT INTO medical_records (animal_id, type, doctor, date, status, notes)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    animal_id,
                    "Intake Note",
                    "Shelter Team",
                    arrived_date,
                    "Completed",
                    medical_history,
                ),
            )
        else:
            cursor.execute(
                """
                UPDATE medical_records
                SET notes = ?, date = ?, doctor = 'Shelter Team', status = 'Completed'
                WHERE id = ?
                """,
                (medical_history, arrived_date, existing_note["id"]),
            )
    elif existing_note is not None:
        cursor.execute("DELETE FROM medical_records WHERE id = ?", (existing_note["id"],))


def animal_summary(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "name": row["name"],
        "species": row["species"],
        "breed": row["breed"],
        "age": row["age"],
        "gender": row["gender"],
        "weight": row["weight"],
        "status": row["status"],
        "arrivedDate": row["arrived_date"],
        "behavior": row["behavior"],
        "description": row["description"],
    }


def list_animals() -> list[dict[str, Any]]:
    with db_connection() as connection:
        rows = connection.execute(
            """
            SELECT id, name, species, breed, age, gender, weight, status,
                   arrived_date, behavior, description
            FROM animals
            ORDER BY date(arrived_date) DESC, id DESC
            """
        ).fetchall()
    return [animal_summary(row) for row in rows]


def animal_detail(animal_id: int) -> dict[str, Any] | None:
    with db_connection() as connection:
        animal = connection.execute(
            """
            SELECT id, name, species, breed, age, gender, weight, status,
                   arrived_date, behavior, description
            FROM animals
            WHERE id = ?
            """,
            (animal_id,),
        ).fetchone()
        if animal is None:
            return None

        medical_history = connection.execute(
            """
            SELECT type, date, notes
            FROM medical_records
            WHERE animal_id = ?
            ORDER BY date(date) DESC, id DESC
            """,
            (animal_id,),
        ).fetchall()

    payload = animal_summary(animal)
    payload["medicalHistory"] = [
        {"type": row["type"], "date": row["date"], "notes": row["notes"]}
        for row in medical_history
    ]
    return payload


def list_medical_records() -> list[dict[str, Any]]:
    with db_connection() as connection:
        rows = connection.execute(
            """
            SELECT a.id AS animal_id, a.name AS animal_name, m.type, m.doctor, m.date, m.status, m.notes
            FROM medical_records m
            JOIN animals a ON a.id = m.animal_id
            ORDER BY date(m.date) DESC, m.id DESC
            """
        ).fetchall()
    return [
        {
            "animalId": row["animal_id"],
            "animalName": row["animal_name"],
            "type": row["type"],
            "doctor": row["doctor"],
            "date": row["date"],
            "status": row["status"],
            "notes": row["notes"],
        }
        for row in rows
    ]


def create_medical_record(payload: dict[str, Any]) -> dict[str, Any]:
    animal_id = int(payload.get("animalId", 0))
    record_type = str(payload.get("type", "")).strip()
    doctor = str(payload.get("doctor", "")).strip()
    date = str(payload.get("date", "")).strip()
    status = str(payload.get("status", "")).strip()
    notes = str(payload.get("notes", "")).strip()

    missing_fields = []
    if animal_id <= 0:
        missing_fields.append("animalId")
    if not record_type:
        missing_fields.append("type")
    if not doctor:
        missing_fields.append("doctor")
    if not date:
        missing_fields.append("date")
    if not status:
        missing_fields.append("status")
    if missing_fields:
        raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

    if status not in MEDICAL_STATUSES:
        raise ValueError(f"Unsupported medical record status: {status}")

    with db_connection() as connection:
        cursor = connection.cursor()
        animal = cursor.execute(
            "SELECT id, name FROM animals WHERE id = ?",
            (animal_id,),
        ).fetchone()
        if animal is None:
            raise ValueError("Animal not found")

        cursor.execute(
            """
            INSERT INTO medical_records (animal_id, type, doctor, date, status, notes)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (animal_id, record_type, doctor, date, status, notes),
        )
        cursor.execute(
            """
            INSERT INTO activities (title, description, initials, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (
                "Medical Record",
                f"{animal['name']} received a new {record_type.lower()} record",
                animal["name"][:2].upper(),
                utc_now().isoformat(),
            ),
        )
        connection.commit()

    return {
        "animalId": animal["id"],
        "animalName": animal["name"],
        "type": record_type,
        "doctor": doctor,
        "date": date,
        "status": status,
        "notes": notes,
    }


def list_reports() -> list[dict[str, Any]]:
    with db_connection() as connection:
        rows = connection.execute(
            "SELECT title, category, date, status, format FROM reports ORDER BY date(date) DESC, id DESC"
        ).fetchall()
    return [dict(row) for row in rows]


def list_financial_entries() -> list[dict[str, Any]]:
    with db_connection() as connection:
        rows = connection.execute(
            "SELECT month, donations, adoptions, expenses FROM financial_entries ORDER BY id ASC"
        ).fetchall()
    return [
        {
            "month": row["month"],
            "Donations": row["donations"],
            "Adoptions": row["adoptions"],
            "Expenses": row["expenses"],
        }
        for row in rows
    ]


def dashboard_payload() -> dict[str, Any]:
    with db_connection() as connection:
        total_animals = connection.execute("SELECT COUNT(*) FROM animals").fetchone()[0]
        adopted_animals = connection.execute(
            "SELECT COUNT(*) FROM animals WHERE status = 'Adopted'"
        ).fetchone()[0]
        available_animals = connection.execute(
            "SELECT COUNT(*) FROM animals WHERE status = 'Available'"
        ).fetchone()[0]
        distinct_vets = connection.execute(
            "SELECT COUNT(DISTINCT doctor) FROM medical_records WHERE doctor <> ''"
        ).fetchone()[0]
        scheduled_visits = connection.execute(
            "SELECT COUNT(*) FROM medical_records WHERE status IN ('Scheduled', 'In Progress')"
        ).fetchone()[0]
        finance_rows = connection.execute(
            "SELECT donations, adoptions, expenses FROM financial_entries ORDER BY id ASC"
        ).fetchall()
        overview_rows = connection.execute(
            "SELECT month, animals FROM animal_overview ORDER BY id ASC"
        ).fetchall()
        activity_rows = connection.execute(
            """
            SELECT title, description, initials, created_at
            FROM activities
            ORDER BY datetime(created_at) DESC, id DESC
            LIMIT 4
            """
        ).fetchall()

    gross_revenue = sum(row["donations"] + row["adoptions"] for row in finance_rows)
    net_balance = sum(row["donations"] + row["adoptions"] - row["expenses"] for row in finance_rows)
    latest_overview = overview_rows[-1]["animals"] if overview_rows else total_animals
    previous_overview = overview_rows[-2]["animals"] if len(overview_rows) > 1 else latest_overview
    overview_change = latest_overview - previous_overview

    return {
        "stats": [
            {
                "label": "Total Animals",
                "value": str(total_animals),
                "change": f"{overview_change:+d} compared with the previous month",
                "icon": "paw",
            },
            {
                "label": "Adoptions",
                "value": str(adopted_animals),
                "change": f"{available_animals} currently available for adoption",
                "icon": "heart",
            },
            {
                "label": "Revenue",
                "value": format_currency(gross_revenue),
                "change": f"Net balance {format_currency(net_balance)}",
                "icon": "dollar",
            },
            {
                "label": "Active Vets",
                "value": str(distinct_vets),
                "change": f"{scheduled_visits} medical visits scheduled or in progress",
                "icon": "users",
            },
        ],
        "overviewData": [dict(row) for row in overview_rows],
        "recentActivities": [
            {
                "title": row["title"],
                "description": row["description"],
                "time": format_relative_time(row["created_at"]),
                "initials": row["initials"],
            }
            for row in activity_rows
        ],
    }


def create_animal(payload: dict[str, Any]) -> dict[str, Any]:
    validate_animal_payload(payload)

    status = str(payload["status"]).strip()
    arrived_date = str(payload.get("arrivedDate") or utc_now().date().isoformat())
    medical_history = str(payload.get("medicalHistory", "")).strip()
    now_iso = utc_now().isoformat()

    with db_connection() as connection:
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO animals (
                name, species, breed, age, gender, weight, status,
                arrived_date, behavior, description, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload["name"].strip(),
                payload["species"].strip(),
                payload["breed"].strip(),
                payload["age"].strip(),
                payload["gender"].strip(),
                payload["weight"].strip(),
                status,
                arrived_date,
                payload["behavior"].strip(),
                payload["description"].strip(),
                now_iso,
            ),
        )
        animal_id = cursor.lastrowid

        if medical_history:
            sync_intake_note(cursor, animal_id, arrived_date, medical_history)

        cursor.execute(
            """
            INSERT INTO activities (title, description, initials, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (
                "New Animal",
                f"{payload['name'].strip()} - {payload['breed'].strip()} was added to the shelter",
                payload["name"].strip()[:2].upper(),
                now_iso,
            ),
        )
        connection.commit()

    detail = animal_detail(animal_id)
    if detail is None:
        raise RuntimeError("Failed to load created animal")
    return detail


def update_animal(animal_id: int, payload: dict[str, Any]) -> dict[str, Any] | None:
    validate_animal_payload(payload)

    with db_connection() as connection:
        cursor = connection.cursor()
        existing = cursor.execute(
            """
            SELECT id, name, breed, status, arrived_date
            FROM animals
            WHERE id = ?
            """,
            (animal_id,),
        ).fetchone()
        if existing is None:
            return None

        status = str(payload["status"]).strip()
        arrived_date = str(payload.get("arrivedDate") or existing["arrived_date"])
        medical_history = str(payload.get("medicalHistory", "")).strip()
        now_iso = utc_now().isoformat()

        cursor.execute(
            """
            UPDATE animals
            SET name = ?, species = ?, breed = ?, age = ?, gender = ?, weight = ?,
                status = ?, arrived_date = ?, behavior = ?, description = ?
            WHERE id = ?
            """,
            (
                payload["name"].strip(),
                payload["species"].strip(),
                payload["breed"].strip(),
                payload["age"].strip(),
                payload["gender"].strip(),
                payload["weight"].strip(),
                status,
                arrived_date,
                payload["behavior"].strip(),
                payload["description"].strip(),
                animal_id,
            ),
        )

        sync_intake_note(cursor, animal_id, arrived_date, medical_history)

        activity_title = "Animal Updated"
        activity_description = f"{payload['name'].strip()} details were updated"
        if existing["status"] != status:
            activity_title = "Status Updated"
            activity_description = f"{payload['name'].strip()} moved from {existing['status']} to {status}"

        cursor.execute(
            """
            INSERT INTO activities (title, description, initials, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (
                activity_title,
                activity_description,
                payload["name"].strip()[:2].upper(),
                now_iso,
            ),
        )
        connection.commit()

    return animal_detail(animal_id)


class ShelterRequestHandler(BaseHTTPRequestHandler):
    server_version = "ShelterBackend/1.0"

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, OPTIONS")
        super().end_headers()

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(HTTPStatus.NO_CONTENT)
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        try:
            parsed = urlparse(self.path)
            path = parsed.path.rstrip("/") or "/"

            if path == "/api/health":
                self.write_json({"status": "ok"})
                return
            if path == "/api/dashboard":
                self.write_json(dashboard_payload())
                return
            if path == "/api/animals":
                self.write_json(list_animals())
                return
            if path.startswith("/api/animals/"):
                animal_id = int(path.split("/")[-1])
                animal = animal_detail(animal_id)
                if animal is None:
                    self.write_json({"error": "Animal not found"}, HTTPStatus.NOT_FOUND)
                    return
                self.write_json(animal)
                return
            if path == "/api/medical-records":
                self.write_json(list_medical_records())
                return
            if path == "/api/financial":
                self.write_json(list_financial_entries())
                return
            if path == "/api/reports":
                self.write_json(list_reports())
                return

            # Serve static files
            if path.startswith("/api/"):
                self.write_json({"error": "Not found"}, HTTPStatus.NOT_FOUND)
                return

            # SPA fallback - serve index.html for non-file paths
            file_path = DIST_DIR / path.lstrip("/")
            if file_path.is_file():
                self.serve_file(file_path)
            else:
                self.serve_file(DIST_DIR / "index.html")

        except ValueError as error:
            self.write_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
        except Exception as error:  # pragma: no cover - defensive path
            self.write_json({"error": str(error)}, HTTPStatus.INTERNAL_SERVER_ERROR)

    def do_POST(self) -> None:  # noqa: N802
        try:
            parsed = urlparse(self.path)
            path = parsed.path.rstrip("/") or "/"

            content_length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(content_length) if content_length else b"{}"
            payload = json.loads(raw_body.decode("utf-8"))
            if path == "/api/animals":
                animal = create_animal(payload)
                self.write_json(animal, HTTPStatus.CREATED)
                return
            if path == "/api/medical-records":
                record = create_medical_record(payload)
                self.write_json(record, HTTPStatus.CREATED)
                return

            self.write_json({"error": "Not found"}, HTTPStatus.NOT_FOUND)
        except json.JSONDecodeError:
            self.write_json({"error": "Request body must be valid JSON"}, HTTPStatus.BAD_REQUEST)
        except ValueError as error:
            self.write_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
        except Exception as error:  # pragma: no cover - defensive path
            self.write_json({"error": str(error)}, HTTPStatus.INTERNAL_SERVER_ERROR)

    def do_PUT(self) -> None:  # noqa: N802
        self._update_animal()

    def do_PATCH(self) -> None:  # noqa: N802
        self._update_animal()

    def _update_animal(self) -> None:
        try:
            parsed = urlparse(self.path)
            path = parsed.path.rstrip("/") or "/"
            if not path.startswith("/api/animals/"):
                self.write_json({"error": "Not found"}, HTTPStatus.NOT_FOUND)
                return

            animal_id = int(path.split("/")[-1])
            content_length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(content_length) if content_length else b"{}"
            payload = json.loads(raw_body.decode("utf-8"))
            animal = update_animal(animal_id, payload)
            if animal is None:
                self.write_json({"error": "Animal not found"}, HTTPStatus.NOT_FOUND)
                return
            self.write_json(animal)
        except json.JSONDecodeError:
            self.write_json({"error": "Request body must be valid JSON"}, HTTPStatus.BAD_REQUEST)
        except ValueError as error:
            self.write_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
        except Exception as error:  # pragma: no cover - defensive path
            self.write_json({"error": str(error)}, HTTPStatus.INTERNAL_SERVER_ERROR)

    def serve_file(self, file_path: Path) -> None:
        mime_types = {
            ".html": "text/html; charset=utf-8",
            ".js": "application/javascript; charset=utf-8",
            ".mjs": "application/javascript; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".json": "application/json; charset=utf-8",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".ico": "image/x-icon",
            ".woff": "font/woff",
            ".woff2": "font/woff2",
            ".ttf": "font/ttf",
            ".eot": "application/vnd.ms-fontobject",
        }
        ext = file_path.suffix.lower()
        mime_type = mime_types.get(ext, "application/octet-stream")
        body = file_path.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", mime_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "public, max-age=3600")
        self.end_headers()
        self.wfile.write(body)

    def write_json(self, payload: Any, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format_string: str, *args: Any) -> None:
        return


def run() -> None:
    init_db()
    server = ThreadingHTTPServer((HOST, PORT), ShelterRequestHandler)
    print(f"Shelter backend running at http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    run()