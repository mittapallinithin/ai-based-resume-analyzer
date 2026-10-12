import React, { useState } from 'react';
import { X, Code, Database, HelpCircle, Layers, Check, Copy, Terminal, CheckCircle2 } from 'lucide-react';

interface ProjectKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectKitModal: React.FC<ProjectKitModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'python-code' | 'sqlite' | 'viva'>('architecture');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const flaskAppCode = `# app.py - Flask Backend for AI-Based Resume Analyzer
from flask import Flask, request, jsonify, render_template
import PyPDF2, docx, re, os, database

app = Flask(__name__)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    # 1. In-memory parse & immediate temporary file cleanup
    # 2. Extract technical skills using boundary-safe regex & ontology
    # 3. Transparent scoring formula:
    #    Score = 0.55*Skills + 0.20*Projects + 0.15*CoreCS + 0.10*Completeness
    # 4. Save to SQLite database (candidates & analysis_reports)
    return jsonify(metrics)`;

  const sqliteSchema = `-- database.py - SQLite Schema
CREATE TABLE candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_name TEXT,
    email TEXT,
    phone TEXT,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    extracted_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analysis_reports (
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
);`;

  const vivaQuestions = [
    {
      q: '1. What is the architecture and workflow of the AI-Based Resume Analyzer?',
      a: 'The system uses a 4-tier pipeline: (1) Ingestion Layer (PDF/DOCX byte extraction via PyPDF2/pdfplumber/mammoth), (2) NLP & Information Extraction Layer (Regex entity parsing for emails, links, degrees, and boundary-checked skill ontology), (3) Deterministic Scoring Engine (weighted multi-factor mathematical formula), and (4) Persistence & Reporting Layer (SQLite relational storage and ReportLab/jsPDF generation).'
    },
    {
      q: '2. Why did you use word-boundary matching instead of simple substring matching (like text.includes)?',
      a: 'Simple substring matching causes severe false positives. For example, looking for the programming language "C" in "Cloud Computing" or "CSS" would trigger a false match. By using regex word-boundary anchors (\\bC\\b), we guarantee that only standalone occurrences of the term are recognized.'
    },
    {
      q: '3. Explain the exact mathematical scoring formula.',
      a: 'Overall Score = 0.55 × (Skill Coverage %) + 0.20 × (Project Impact & Metrics %) + 0.15 × (Core CS Foundation %) + 0.10 × (Profile Completeness %). This gives highest weight to genuine technical alignment (55%), while rewarding measurable engineering results (20%) and academic CS fundamentals (15%) crucial for campus placements.'
    },
    {
      q: '4. How does the system protect candidate privacy?',
      a: 'Temporary files saved during multipart upload are unlinked and wiped from the disk immediately after parsing. Text extraction runs in-memory, and no candidate data is exposed through public directories.'
    },
    {
      q: '5. How would you scale this system to process 50,000 resumes concurrently?',
      a: 'For production scale: (1) Decouple file ingestion from parsing using an asynchronous message queue like RabbitMQ or AWS SQS, (2) Deploy worker nodes running Celery/Docker to parse files in parallel, (3) Upgrade SQLite to PostgreSQL with connection pooling, and (4) Store parsed text vectors in a vector database like Pinecone or pgvector for fast semantic similarity searching.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                Academic Kit
              </span>
              <h3 className="font-bold text-slate-900 text-lg">
                B.Tech CSE Project Documentation & Viva Guide
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Source code, SQLite database models, architecture flowcharts, and technical viva answers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-2">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab('python-code')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'python-code'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Python Flask Backend (`app.py`)
          </button>
          <button
            onClick={() => setActiveTab('sqlite')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'sqlite'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            SQLite Database & Schema
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'viva'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Top Viva Questions & Answers
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 text-xs leading-relaxed">
          {/* Architecture Tab */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-900 text-sm mb-2">High-Level System Flow</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                  <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-2xs">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Phase 1</span>
                    <p className="font-semibold text-slate-900 mt-1">Multi-Format Ingestion</p>
                    <p className="text-[11px] text-slate-500 mt-1">PDF (PyPDF2) / DOCX (python-docx) in-memory parsing</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-2xs">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Phase 2</span>
                    <p className="font-semibold text-slate-900 mt-1">NLP Entity & Skill Extraction</p>
                    <p className="text-[11px] text-slate-500 mt-1">Regex patterns & 250+ technical canonical ontology</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-2xs">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Phase 3</span>
                    <p className="font-semibold text-slate-900 mt-1">Transparent Scoring</p>
                    <p className="text-[11px] text-slate-500 mt-1">Multi-factor weighted evaluation (55/20/15/10)</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-2xs">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Phase 4</span>
                    <p className="font-semibold text-slate-900 mt-1">Persistence & Feedback</p>
                    <p className="text-[11px] text-slate-500 mt-1">SQLite logging and executive PDF generation</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-900 text-sm mb-2">Local Execution Commands (CLI)</h4>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
{`# 1. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run unit tests
python -m unittest tests/test_analyzer.py

# 4. Start Flask server
python app.py
# Server runs on: http://127.0.0.1:5000`}
                </pre>
              </div>
            </div>
          )}

          {/* Python Flask Code Tab */}
          {activeTab === 'python-code' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-slate-500">File: app.py & requirements.txt</span>
                <button
                  onClick={() => handleCopy(flaskAppCode)}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[380px]">
{flaskAppCode}
              </pre>
            </div>
          )}

          {/* SQLite Tab */}
          {activeTab === 'sqlite' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-slate-500">File: database.py (SQLite DDL)</span>
                <button
                  onClick={() => handleCopy(sqliteSchema)}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy DDL'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[380px]">
{sqliteSchema}
              </pre>
            </div>
          )}

          {/* Viva Guide Tab */}
          {activeTab === 'viva' && (
            <div className="space-y-4">
              {vivaQuestions.map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 text-xs mb-1.5 text-blue-700">
                    {item.q}
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-xs">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            All files (`app.py`, `database.py`, `requirements.txt`, `README.md`) are saved in the project repository root.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium rounded-lg transition-colors"
          >
            Close Kit
          </button>
        </div>
      </div>
    </div>
  );
};
