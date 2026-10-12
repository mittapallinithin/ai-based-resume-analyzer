# AI-Based Resume Analyzer

> **B.Tech Computer Science and Engineering — Major Project & Placement Portfolio**  
> An intelligent, transparent ATS resume evaluation and job description matching platform powered by rule-based NLP, canonical technical taxonomies, and multi-factor scoring algorithms.

---

## 📌 Project Overview

During campus placements and technical hiring rounds, Applicant Tracking Systems (ATS) filter out over 75% of undergraduate resumes due to missing keywords, non-standard section headers, and unquantified achievements.

The **AI-Based Resume Analyzer** solves this problem by providing students with an algorithmic assessment of how their resume compares against specific Job Descriptions (JDs). It identifies technical skill gaps, evaluates Core Computer Science fundamentals, audits project impact bullets using Google's XYZ formula, and calculates a fully transparent, explainable match score.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS | High-performance, responsive UI with zero dead clicks |
| **Backend (Python)** | Python 3, Flask, Werkzeug | REST API endpoints, multipart file handling, privacy wiping |
| **Document Parsing** | PyPDF2, pdfplumber, python-docx, Mammoth | Text extraction from PDF and DOCX files |
| **NLP & Extraction** | Python Regex, Boundary-Safe Ontology | 250+ normalized skills across 8 technical domains |
| **Database** | SQLite3 (`resume_analyzer.db`) | Relational persistence for candidate scan logs & history |
| **Report Generation**| ReportLab & jsPDF | Downloadable executive placement PDF reports |
| **Unit Testing** | Python `unittest` / `pytest` | Automated verification of scoring & extraction |

---

## 🧮 Mathematical Scoring Algorithm

Unlike closed-source black-box ATS models, this system implements an open, mathematically rigorous multi-factor scoring model:

$$\text{Overall Score} = 0.55 \times S + 0.20 \times P + 0.15 \times C + 0.10 \times F$$

### Factor Breakdown:

1. **Skill Coverage ($S$, 55% Weight):**
   $$\text{Skill Coverage} = \left( \frac{\text{Matched Skills from JD}}{\text{Total Required Skills in JD}} \right) \times 100$$
   *Skills are normalized using alias dictionaries (e.g., `React.js` $\to$ `React`, `k8s` $\to$ `Kubernetes`, `DSA` $\to$ `Data Structures & Algorithms`).*

2. **Project Impact & Engineering Action Verbs ($P$, 20% Weight):**
   - Evaluates the presence of strong engineering action verbs (`engineered`, `optimized`, `architected`, `reduced`, `deployed`).
   - Quantifies metrics detected in project bullets (e.g., `45%`, `200ms`, `5,000+ users`, `1,500 RPS`).

3. **Core CS Placement Foundation ($C$, 15% Weight):**
   - Directly checks for undergraduate coursework prerequisites for SDE campus recruitment:
     - Data Structures & Algorithms
     - Database Management Systems (DBMS)
     - Operating Systems
     - Computer Networks
     - Object-Oriented Programming (OOP)
     - System Design

4. **Profile Completeness & Formatting ($F$, 10% Weight):**
   - Evaluates presence of candidate email, phone number, GitHub/LinkedIn links, and degree keywords.

---

## 📁 Repository Structure

```text
├── app.py                     # Main Python Flask backend & API routes
├── database.py                # SQLite connection, DDL schema, and queries
├── requirements.txt           # Python package dependencies
├── resume_analyzer.db         # Local SQLite database (created on init)
├── templates/                 # Flask HTML templates
│   ├── index.html
│   └── dashboard.html
├── static/                    # Flask static assets
│   ├── css/style.css
│   └── js/main.js
├── tests/                     # Unit test suite
│   └── test_analyzer.py
├── src/                       # React TypeScript Single-Page Application
│   ├── components/            # ScoreGauge, SkillMatrix, FeedbackSection, etc.
│   ├── utils/                 # parser.ts, scorer.ts, skillOntology.ts, pdfExport.ts
│   ├── data/                  # Preloaded sample resumes & job descriptions
│   └── App.tsx
├── package.json               # Node.js dependencies
└── README.md                  # Project documentation & viva guide
```

---

## 🚀 Local Setup & Installation

### Option 1: Running the Python Flask Backend

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ai-resume-analyzer.git
   cd ai-resume-analyzer
   ```

2. **Create a Python virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate       # On Linux/macOS
   # venv\Scripts\activate        # On Windows
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize database & run unit tests:**
   ```bash
   python database.py
   python -m unittest tests/test_analyzer.py
   ```

5. **Start the Flask server:**
   ```bash
   python app.py
   ```
   *Access the web app at `http://127.0.0.1:5000`*

---

### Option 2: Running the React / Vite Full-Stack Application

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm run dev
   ```
   *Access the interface at `http://localhost:3000`*

3. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🧪 Unit Testing

Run the automated test suite to verify parsing and scoring calculations:

```bash
python -m unittest tests/test_analyzer.py -v
```

**Tested Scenarios:**
- Contact information parsing (Email, Phone, GitHub, LinkedIn).
- Normalized skill extraction with word-boundary safety.
- Scoring accuracy against sample candidate resumes and job postings.
- Graceful error handling when a job posting contains no recognizable technical skills.

---

## 🔒 Candidate Privacy & Security

- **In-Memory Text Processing:** Files uploaded are parsed in transient memory.
- **Immediate Disk Unlink:** Temporary files created during multipart upload are deleted immediately in a `finally:` block.
- **Zero-PII Storage:** No resumes are permanently exposed via public web folders.

---

## 🎓 Academic Viva Questions & Model Answers

### Q1: Why did you use word-boundary matching rather than simple substring searching?
> **Answer:** Substring searching (`text.includes("C")` or `"c" in text`) results in catastrophic false positives, recognizing "C" within words like "Cloud", "Cascading", or "Customer". Regex word-boundary anchors (`\bC\b`) ensure that only the standalone language is identified.

### Q2: What is the benefit of rule-based ontology vs large language model embeddings?
> **Answer:** Rule-based skill extraction is 100% deterministic, audit-friendly, zero-cost, and executes in sub-10 milliseconds with no API token dependency or hallucinations. For deep feedback and bullet rewriting, generative AI can supplement the rule-based core.

### Q3: How do you handle non-searchable or image-only PDF resumes?
> **Answer:** When text extractors yield insufficient characters (<20 words), the system flags an error informing the candidate that their resume is an un-OCR'd scanned image, which would also fail automated ATS screening at major tech employers.

---

## 📜 License
Distributed under the Apache 2.0 License. Built for academic, recruitment portfolio, and career development purposes.
