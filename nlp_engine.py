"""
nlp_engine.py - Core NLP, Skill Extraction & Scoring Logic
Author: B.Tech CSE Final Year Project
Provides zero-dependency text extraction heuristics, canonical skill ontology matching,
and deterministic multi-factor match scoring.
"""

import re
import json

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

SKILL_ALIASES = {
    "react.js": "React",
    "reactjs": "React",
    "react": "React",
    "node": "Node.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "expressjs": "Express",
    "express": "Express",
    "golang": "Go",
    "go": "Go",
    "k8s": "Kubernetes",
    "kubernetes": "Kubernetes",
    "amazon web services": "AWS",
    "aws": "AWS",
    "google cloud": "GCP",
    "gcp": "GCP",
    "dsa": "Data Structures & Algorithms",
    "data structures": "Data Structures & Algorithms",
    "algorithms": "Data Structures & Algorithms",
    "oops": "Object-Oriented Programming (OOP)",
    "oop": "Object-Oriented Programming (OOP)",
    "object-oriented programming": "Object-Oriented Programming (OOP)",
    "dbms": "DBMS",
    "operating systems": "Operating Systems",
    "computer networks": "Computer Networks",
    "system design": "System Design",
    "tailwind": "Tailwind CSS",
    "tailwind css": "Tailwind CSS",
    "rest": "REST API",
    "rest api": "REST API",
    "python": "Python",
    "java": "Java",
    "c++": "C++",
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "sql": "SQL",
    "postgresql": "PostgreSQL",
    "mysql": "MySQL",
    "mongodb": "MongoDB",
    "redis": "Redis",
    "docker": "Docker",
    "git": "Git",
    "linux": "Linux"
}

def extract_skills_from_text(text):
    """Identifies and normalizes technical skills present in text using word-boundary regex."""
    if not text:
        return []

    found_skills = set()
    cleaned_text = " " + re.sub(r'[,;/|()[\]{}\n\r]', ' ', text.lower()) + " "

    for category, skills in SKILLS_TAXONOMY.items():
        for skill in skills:
            pattern = r'(?:\b|_)' + re.escape(skill) + r'(?:\b|_)'
            if re.search(pattern, cleaned_text):
                normalized = SKILL_ALIASES.get(skill, skill.title())
                found_skills.add(normalized)

    return sorted(list(found_skills))

def parse_candidate_info(text):
    """Extracts email, phone, links, and degree keywords."""
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    emails = re.findall(email_pattern, text)

    phone_pattern = r'(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}'
    phones = re.findall(phone_pattern, text)

    github_pattern = r'(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+'
    linkedin_pattern = r'(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+'
    github = re.findall(github_pattern, text, re.IGNORECASE)
    linkedin = re.findall(linkedin_pattern, text, re.IGNORECASE)

    education_keywords = ['b.tech', 'bachelor', 'b.e.', 'm.tech', 'master', 'computer science', 'information technology', 'bca', 'mca']
    detected_education = []
    text_lower = text.lower()
    for edu in education_keywords:
        if edu in text_lower:
            detected_education.append(edu.upper())

    lines = [line.strip() for line in text.split('\n') if line.strip()]
    candidate_name = lines[0] if lines else "Candidate"
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

def calculate_match_metrics(resume_text, job_desc_text):
    """Computes transparent scoring based on skills, project metrics, core CS, and completeness."""
    resume_skills = extract_skills_from_text(resume_text)
    job_skills = extract_skills_from_text(job_desc_text)

    if not job_skills:
        return {
            "error": "The job description does not contain recognized technical skills. Please include specific programming languages, frameworks, or tools.",
            "job_skills": [],
            "resume_skills": resume_skills
        }

    matched_skills = [s for s in job_skills if s in resume_skills]
    missing_skills = [s for s in job_skills if s not in resume_skills]
    additional_skills = [s for s in resume_skills if s not in job_skills]

    # Skill Coverage (55%)
    skill_coverage_pct = (len(matched_skills) / len(job_skills)) * 100

    # Core CS (15%)
    core_cs_list = ["Data Structures & Algorithms", "DBMS", "Operating Systems", "Computer Networks", "Object-Oriented Programming (OOP)", "System Design"]
    core_cs_found = [s for s in core_cs_list if s in resume_skills]
    core_cs_pct = min(100, (len(core_cs_found) / 3) * 100)

    # Action Verbs & Quantified Metrics (20%)
    action_verbs = ['developed', 'engineered', 'built', 'implemented', 'optimized', 'architected', 'reduced', 'improved', 'increased', 'designed']
    action_verb_count = sum(1 for verb in action_verbs if verb in resume_text.lower())
    quantified_metrics = len(re.findall(r'\b\d+(?:%|\+|ms|k|x)\b', resume_text.lower()))
    project_score_pct = min(100, (action_verb_count * 10) + (quantified_metrics * 15))

    # Profile Completeness (10%)
    candidate_info = parse_candidate_info(resume_text)
    completeness_pts = 0
    if candidate_info['email'] != 'Not detected': completeness_pts += 25
    if candidate_info['phone'] != 'Not detected': completeness_pts += 25
    if candidate_info['github'] or candidate_info['linkedin']: completeness_pts += 25
    if len(candidate_info['education']) > 0: completeness_pts += 25

    overall_score = round(
        (0.55 * skill_coverage_pct) +
        (0.20 * project_score_pct) +
        (0.15 * core_cs_pct) +
        (0.10 * completeness_pts),
        1
    )
    overall_score = min(100, max(0, overall_score))

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
            "text": "Include measurable metrics in project bullet points (e.g. 'Improved response latency by 35%')."
        })
    if not core_cs_found:
        suggestions.append({
            "category": "Core CS Placement Focus",
            "priority": "High",
            "text": "For campus placement shortlisting, explicitly list coursework: Data Structures, Algorithms, DBMS, and OS."
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
