"""
database.py - SQLite Database Management for AI-Based Resume Analyzer
Author: B.Tech CSE Final Year Project Team
Purpose: Manages persistence for resume parse history, match scoring metrics,
         and candidate skill gap analysis.
"""

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'resume_analyzer.db')

def get_db_connection():
    """Establish and return a connection to the SQLite database with row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize SQLite tables for Candidate, AnalysisReport, and SkillsLog."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Table for storing Candidate Resume Uploads
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS candidates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            candidate_name TEXT,
            email TEXT,
            phone TEXT,
            file_name TEXT NOT NULL,
            file_type TEXT NOT NULL,
            extracted_text TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Table for storing Analysis and Job Matching Results
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analysis_reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            candidate_id INTEGER,
            job_title TEXT,
            job_description TEXT,
            match_score REAL NOT NULL,
            matched_skills TEXT,
            missing_skills TEXT,
            feedback_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (candidate_id) REFERENCES candidates (id)
        )
    ''')

    # Table for storing Predefined Technical Skills Dictionary for NLP matching
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS skill_dictionary (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            skill_name TEXT NOT NULL UNIQUE,
            aliases TEXT
        )
    ''')

    conn.commit()
    conn.close()

def save_analysis(file_name, file_type, extracted_text, candidate_info, job_desc, match_score, matched_skills, missing_skills, feedback_json):
    """Saves candidate details and analysis metrics to SQLite."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO candidates (candidate_name, email, phone, file_name, file_type, extracted_text)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        candidate_info.get('name', 'Anonymous Candidate'),
        candidate_info.get('email', ''),
        candidate_info.get('phone', ''),
        file_name,
        file_type,
        extracted_text
    ))
    candidate_id = cursor.lastrowid

    cursor.execute('''
        INSERT INTO analysis_reports (candidate_id, job_title, job_description, match_score, matched_skills, missing_skills, feedback_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        candidate_id,
        candidate_info.get('target_role', 'Software Development Engineer'),
        job_desc,
        match_score,
        ", ".join(matched_skills),
        ", ".join(missing_skills),
        feedback_json
    ))
    report_id = cursor.lastrowid

    conn.commit()
    conn.close()
    return report_id

def get_recent_analyses(limit=10):
    """Retrieves recent resume analysis reports for the dashboard."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT r.id, c.candidate_name, c.email, r.job_title, r.match_score, r.created_at
        FROM analysis_reports r
        LEFT JOIN candidates c ON r.candidate_id = c.id
        ORDER BY r.created_at DESC
        LIMIT ?
    ''', (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully at", DB_PATH)
