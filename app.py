"""
app.py - AI-Based Resume Analyzer
Backend: Python 3 with Flask & SQLite
Features: PDF/DOCX Parsing, Rule-Based NLP & Skill Extraction,
          Transparent ATS Match Scoring, Missing Skill Identification,
          Placement & Project Feedback, Privacy Cleanup.
"""

import os
import re
import json
import tempfile
from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename
import database
import nlp_engine

# Optional libraries with graceful fallbacks
try:
    import PyPDF2
except ImportError:
    PyPDF2 = None

try:
    import docx
except ImportError:
    docx = None

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB limit
app.config['UPLOAD_FOLDER'] = os.path.join(tempfile.gettempdir(), 'resume_analyzer_uploads')
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# -----------------------------------------------------------------------------
# Comprehensive Technical Skills Ontology (Targeted for B.Tech CSE Placements)
# -----------------------------------------------------------------------------
SKILLS_TAXONOMY = {
    "Programming Languages": [
        "python", "java", "c++", "c", "c#", "javascript", "typescript",
        "go", "golang", "rust", "kotlin", "ruby", "php", "swift", "dart", "r", "scala"
    ],
    "Web & Frameworks": [
        "react", "react.js", "next.js", "node.js", "express", "express.js",
        "vue", "angular", "django", "flask", "fastapi", "spring boot", "spring",
        "asp.net", "laravel", "tailwind css", "tailwind", "bootstrap", "html5", "css3", "rest api", "graphql"
    ],
    "Databases & Storage": [
        "sql", "postgresql", "mysql", "mongodb", "redis", "sqlite",
        "cassandra", "dynamodb", "oracle", "elasticsearch", "firebase firestore"
    ],
    "Cloud & DevOps": [
        "aws", "amazon web services", "gcp", "google cloud", "azure",
        "docker", "kubernetes", "k8s", "git", "github", "gitlab",
        "ci/cd", "jenkins", "linux", "nginx", "terraform", "bash", "shell scripting"
    ],
    "Core CS & Fundamentals": [
        "data structures", "algorithms", "dsa", "object-oriented programming", "oops", "oop",
        "dbms", "database management", "operating systems", "computer networks",
        "system design", "distributed systems", "software engineering", "sdlc"
    ],
    "AI, Machine Learning & Data": [
        "machine learning", "deep learning", "artificial intelligence", "nlp",
        "natural language processing", "computer vision", "tensorflow", "pytorch",
        "scikit-learn", "pandas", "numpy", "opencv", "data analysis", "llm", "genai"
    ],
    "Testing & Tools": [
        "junit", "pytest", "jest", "postman", "jira", "selenium", "agile", "scrum"
    ]
}

# Skill alias mapping for accurate normalization
SKILL_ALIASES = {
    "react.js": "react",
    "reactjs": "react",
    "node": "node.js",
    "nodejs": "node.js",
    "expressjs": "express",
    "golang": "go",
    "k8s": "kubernetes",
    "amazon web services": "aws",
    "google cloud": "gcp",
    "dsa": "data structures & algorithms",
    "data structures": "data structures & algorithms",
    "algorithms": "data structures & algorithms",
    "oops": "object-oriented programming",
    "oop": "object-oriented programming",
    "tailwind": "tailwind css",
    "rest": "rest api",
    "restful api": "rest api",
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# -----------------------------------------------------------------------------
# Text Extraction Helpers
# -----------------------------------------------------------------------------
def extract_text_from_pdf(filepath):
    """Extracts raw text from a PDF file using PyPDF2."""
    text = ""
    try:
        with open(filepath, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"PDF extraction error: {e}")
    return text.strip()

def extract_text_from_docx(filepath):
    """Extracts raw text from a DOCX file using python-docx."""
    text = ""
    try:
        if docx:
            doc = docx.Document(filepath)
            for para in doc.paragraphs:
                text += para.text + "\n"
    except Exception as e:
        print(f"DOCX extraction error: {e}")
    return text.strip()

def extract_text(filepath, filename):
    ext = filename.rsplit('.', 1)[1].lower()
    if ext == 'pdf':
        return extract_text_from_pdf(filepath)
    elif ext == 'docx':
        return extract_text_from_docx(filepath)
    elif ext == 'txt':
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    return ""

# -----------------------------------------------------------------------------
# Information Parsing & Skill Extraction
# -----------------------------------------------------------------------------
def parse_candidate_info(text):
    """Extracts email, phone, links, and degree keywords."""
    # Email regex
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    emails = re.findall(email_pattern, text)

    # Phone regex (Indian & international standard patterns)
    phone_pattern = r'(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}'
    phones = re.findall(phone_pattern, text)

    # GitHub & LinkedIn
    github_pattern = r'(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+'
    linkedin_pattern = r'(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+'
    github = re.findall(github_pattern, text, re.IGNORECASE)
    linkedin = re.findall(linkedin_pattern, text, re.IGNORECASE)

    # Education / Degree detection
    education_keywords = ['b.tech', 'bachelor', 'b.e.', 'm.tech', 'master', 'computer science', 'information technology', 'bca', 'mca']
    detected_education = []
    text_lower = text.lower()
    for edu in education_keywords:
        if edu in text_lower:
            detected_education.append(edu.upper())

    # Try extracting name from first line
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    candidate_name = lines[0] if lines else "Candidate"
    # Basic sanitize if first line is too long or contains keywords
    if len(candidate_name) > 40 or '@' in candidate_name or 'resume' in candidate_name.lower():
        candidate_name = "Candidate"

    return {
        "name": candidate_name,
        "email": emails[0] if emails else "Not detected",
        "phone": "".join(phones[0]) if phones else "Not detected",
        "github": github[0] if github else None,
        "linkedin": linkedin[0] if linkedin else None,
        "education": list(set(detected_education)),
        "word_count": len(text.split())
    }

def extract_skills_from_text(text):
    """Identifies and normalizes technical skills present in text."""
    found_skills = set()
    text_lower = " " + text.lower() + " "
    # Replace common punctuation with spaces to allow word boundary checking
    cleaned_text = re.sub(r'[,;/|()[\]{}\n\r]', ' ', text_lower)

    for category, skills in SKILLS_TAXONOMY.items():
        for skill in skills:
            # Word boundary regex to avoid false positives (e.g. 'c' inside 'cloud')
            pattern = r'(?:\b|_)' + re.escape(skill) + r'(?:\b|_)'
            if re.search(pattern, cleaned_text):
                normalized = SKILL_ALIASES.get(skill, skill)
                found_skills.add(normalized)

    return sorted(list(found_skills))

# -----------------------------------------------------------------------------
# Scoring Algorithm
# -----------------------------------------------------------------------------
def calculate_match_metrics(resume_text, job_desc_text):
    """
    Computes a transparent, reproducible match score based on:
    1. Skill Match Percentage (55% weight)
    2. Projects & Experience Impact (20% weight)
    3. Core CS Foundation (15% weight)
    4. Resume Formatting & Completeness (10% weight)
    """
    resume_skills = extract_skills_from_text(resume_text)
    job_skills = extract_skills_from_text(job_desc_text)

    # Fallback if JD has no detectable technical skills
    if not job_skills:
        return {
            "error": "The job description does not contain recognized technical skills. Please paste a more detailed job posting containing specific programming languages, frameworks, or tools.",
            "job_skills": [],
            "resume_skills": resume_skills
        }

    matched_skills = [s for s in job_skills if s in resume_skills]
    missing_skills = [s for s in job_skills if s not in resume_skills]
    additional_skills = [s for s in resume_skills if s not in job_skills]

    # Metric 1: Skill Coverage (55%)
    skill_coverage_pct = (len(matched_skills) / len(job_skills)) * 100

    # Metric 2: Core CS Foundation (15%)
    core_cs_list = ["data structures & algorithms", "dbms", "operating systems", "computer networks", "object-oriented programming", "system design"]
    core_cs_found = [s for s in core_cs_list if s in resume_skills]
    core_cs_pct = min(100, (len(core_cs_found) / 3) * 100)

    # Metric 3: Action Verbs & Quantified Results in Projects (20%)
    action_verbs = ['developed', 'engineered', 'built', 'implemented', 'optimized', 'architected', 'reduced', 'improved', 'increased', 'designed']
    action_verb_count = sum(1 for verb in action_verbs if verb in resume_text.lower())
    quantified_metrics = len(re.findall(r'\b\d+(?:%|\+|ms|k|x)\b', resume_text.lower()))
    project_score_pct = min(100, (action_verb_count * 10) + (quantified_metrics * 15))

    # Metric 4: Completeness (10%)
    candidate_info = parse_candidate_info(resume_text)
    completeness_pts = 0
    if candidate_info['email'] != 'Not detected': completeness_pts += 25
    if candidate_info['phone'] != 'Not detected': completeness_pts += 25
    if candidate_info['github'] or candidate_info['linkedin']: completeness_pts += 25
    if len(candidate_info['education']) > 0: completeness_pts += 25

    # Overall Weighted Match Score
    overall_score = round(
        (0.55 * skill_coverage_pct) +
        (0.20 * project_score_pct) +
        (0.15 * core_cs_pct) +
        (0.10 * completeness_pts),
        1
    )
    overall_score = min(100, max(0, overall_score))

    # Categorize Suggestions
    suggestions = []
    if missing_skills:
        suggestions.append({
            "category": "Skill Gap",
            "priority": "High",
            "text": f"Add high-demand missing skills to your resume: {', '.join(missing_skills[:5])}."
        })
    if quantified_metrics < 2:
        suggestions.append({
            "category": "Project Impact",
            "priority": "Medium",
            "text": "Include measurable metrics in project bullet points (e.g. 'Improved API response latency by 35%' or 'Handled 5,000+ daily requests')."
        })
    if not core_cs_found:
        suggestions.append({
            "category": "Core CS Placement Focus",
            "priority": "High",
            "text": "For B.Tech CSE placement shortlisting, explicitly list coursework: Data Structures, Algorithms, DBMS, and OS."
        })
    if not candidate_info['github']:
        suggestions.append({
            "category": "Portfolio Visibility",
            "priority": "Medium",
            "text": "Include a working GitHub profile link with pinned repositories and READMEs."
        })

    return {
        "overall_score": overall_score,
        "skill_coverage_pct": round(skill_coverage_pct, 1),
        "project_score_pct": round(project_score_pct, 1),
        "core_cs_pct": round(core_cs_pct, 1),
        "completeness_pct": round(completeness_pts, 1),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "additional_skills": additional_skills,
        "job_skills": job_skills,
        "resume_skills": resume_skills,
        "candidate_info": candidate_info,
        "suggestions": suggestions,
        "scoring_formula": "Score = 0.55*(Skill Coverage) + 0.20*(Project Metrics) + 0.15*(Core CS) + 0.10*(Completeness)"
    }

# -----------------------------------------------------------------------------
# Flask Routes
# -----------------------------------------------------------------------------
@app.route('/')
def home():
    """Renders main interface."""
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze_resume_endpoint():
    """API endpoint to parse resume and compare with Job Description."""
    if 'resume' not in request.files and 'resume_text' not in request.form:
        return jsonify({"error": "No resume file or resume text provided"}), 400

    job_description = request.form.get('job_description', '').strip()
    if not job_description:
        return jsonify({"error": "Please provide a job description to calculate matching scores."}), 400

    resume_text = ""
    file_name = "pasted_text.txt"
    file_type = "txt"

    # File upload handling with automatic temporary cleanup
    if 'resume' in request.files and request.files['resume'].filename:
        file = request.files['resume']
        if not allowed_file(file.filename):
            return jsonify({"error": "Unsupported file format. Please upload PDF, DOCX, or TXT."}), 400

        file_name = secure_filename(file.filename)
        file_type = file_name.rsplit('.', 1)[1].lower()
        temp_filepath = os.path.join(app.config['UPLOAD_FOLDER'], file_name)

        try:
            file.save(temp_filepath)
            resume_text = extract_text(temp_filepath, file_name)
        finally:
            # Privacy Protection: Immediately remove temporary file from disk
            if os.path.exists(temp_filepath):
                try:
                    os.remove(temp_filepath)
                except Exception:
                    pass
    else:
        resume_text = request.form.get('resume_text', '')

    if not resume_text or len(resume_text.strip()) < 40:
        return jsonify({"error": "Could not extract readable text from the uploaded resume. Please verify the document is not an image-only scan."}), 400

    metrics = calculate_match_metrics(resume_text, job_description)
    if "error" in metrics:
        return jsonify(metrics), 400

    # Save to SQLite database
    try:
        report_id = database.save_analysis(
            file_name=file_name,
            file_type=file_type,
            extracted_text=resume_text[:2000],
            candidate_info=metrics['candidate_info'],
            job_desc=job_description[:1000],
            match_score=metrics['overall_score'],
            matched_skills=metrics['matched_skills'],
            missing_skills=metrics['missing_skills'],
            feedback_json=json.dumps(metrics['suggestions'])
        )
        metrics['report_id'] = report_id
    except Exception as db_err:
        print(f"Database save error: {db_err}")

    return jsonify(metrics)

@app.route('/api/history', methods=['GET'])
def get_history():
    """Returns past analysis entries from SQLite database."""
    history = database.get_recent_analyses(limit=10)
    return jsonify(history)

if __name__ == '__main__':
    database.init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
