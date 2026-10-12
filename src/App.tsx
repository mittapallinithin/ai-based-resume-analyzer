import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ResumeUploader } from './components/ResumeUploader';
import { JobDescriptionInput } from './components/JobDescriptionInput';
import { ScoreGauge } from './components/ScoreGauge';
import { SkillMatrix } from './components/SkillMatrix';
import { FeedbackSection } from './components/FeedbackSection';
import { ProjectKitModal } from './components/ProjectKitModal';
import { HistoryModal } from './components/HistoryModal';
import { AnalysisResult } from './types';
import { computeAnalysis } from './utils/scorer';
import { generatePdfReport } from './utils/pdfExport';
import { Download, RefreshCw, Sparkles, CheckCircle2, User, Mail, Phone, ExternalLink } from 'lucide-react';
import { SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS } from './data/sampleData';

const LOCAL_STORAGE_KEY = 'ai_resume_analyzer_history_v1';

export default function App() {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isProjectKitOpen, setIsProjectKitOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      } else {
        // Pre-seed with one initial benchmark run for smooth first-time experience
        const initialBenchmark = computeAnalysis(
          SAMPLE_RESUMES[0].text,
          SAMPLE_JOB_DESCRIPTIONS[0].text,
          'Rahul_Sharma_Resume.pdf',
          'Software Development Engineer (SDE 1)'
        );
        setHistory([initialBenchmark]);
      }
    } catch {
      // Local storage disabled or error
    }
  }, []);

  const saveToHistory = (result: AnalysisResult) => {
    const updated = [result, ...history.filter(h => h.id !== result.id)].slice(0, 15);
    setHistory(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleAnalyze = () => {
    if (!resumeText.trim() || !jobDescriptionText.trim()) return;

    setErrorMessage(null);
    setIsAnalyzing(true);

    try {
      // Extract target role from first line of job description if available
      const lines = jobDescriptionText.split('\n').filter(l => l.trim().length > 0);
      let targetRole = 'Software Development Engineer (SDE 1)';
      if (lines.length > 0 && lines[0].toLowerCase().includes('role:')) {
        targetRole = lines[0].replace(/role:/i, '').trim();
      } else if (lines.length > 0 && lines[0].length < 60) {
        targetRole = lines[0].trim();
      }

      const result = computeAnalysis(
        resumeText,
        jobDescriptionText,
        fileName || 'Uploaded_Resume.pdf',
        targetRole
      );

      setAnalysisResult(result);
      saveToHistory(result);

      // Smooth scroll down to dashboard
      setTimeout(() => {
        document.getElementById('analysis-dashboard')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Please check inputs.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPdf = () => {
    if (analysisResult) {
      generatePdfReport(analysisResult);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Header */}
      <Navbar
        onOpenProjectKit={() => setIsProjectKitOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Placement & ATS Scoring Engine 2026</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            AI-Based Resume Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed">
            Upload your technical resume, match against any job description, pinpoint missing skills, and calculate a transparent, mathematically sound ATS match score with actionable B.Tech CSE placement feedback.
          </p>
        </div>

        {/* Global Error Notice */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">Error:</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-800 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* 2-Column Input Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-10">
          {/* 1. Resume Uploader */}
          <ResumeUploader
            resumeText={resumeText}
            onResumeTextChange={setResumeText}
            fileName={fileName}
            onFileNameChange={setFileName}
            isLoading={isLoading}
            onLoadingChange={setIsLoading}
            errorMessage={errorMessage}
            onErrorMessageChange={setErrorMessage}
          />

          {/* 2. Job Description Input */}
          <JobDescriptionInput
            jobDescriptionText={jobDescriptionText}
            onJobDescriptionChange={setJobDescriptionText}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            canAnalyze={Boolean(resumeText.trim() && jobDescriptionText.trim())}
          />
        </div>

        {/* Analysis Dashboard Section */}
        {analysisResult && (
          <div id="analysis-dashboard" className="space-y-6 pt-4 animate-in fade-in duration-300">
            {/* Action Bar & Candidate Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg border border-blue-100 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {analysisResult.candidateInfo.name}
                    </h2>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Analyzed
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    {analysisResult.candidateInfo.email !== 'Not detected' && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {analysisResult.candidateInfo.email}
                      </span>
                    )}
                    {analysisResult.candidateInfo.phone !== 'Not detected' && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {analysisResult.candidateInfo.phone}
                      </span>
                    )}
                    {analysisResult.candidateInfo.github && (
                      <span className="flex items-center gap-1 text-blue-600 font-mono">
                        GitHub linked
                      </span>
                    )}
                    <span>·</span>
                    <span>{analysisResult.candidateInfo.wordCount} words</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </button>
                <button
                  type="button"
                  onClick={handleNewAnalysis}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Run new analysis"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Analysis</span>
                </button>
              </div>
            </div>

            {/* Score Radial Gauge & Formula Card */}
            <ScoreGauge analysis={analysisResult} />

            {/* Skill Matrix: Matched vs Missing */}
            <SkillMatrix analysis={analysisResult} />

            {/* Comprehensive Placement & Project Feedback */}
            <FeedbackSection analysis={analysisResult} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700">
            AI-Based Resume Analyzer — B.Tech Computer Science & Engineering Final Year Project
          </p>
          <p className="text-[11px] text-slate-400 max-w-xl mx-auto">
            Designed for software placement preparation, campus hiring audits, and transparent skill-gap detection.
            Includes complete Python Flask backend, SQLite database schemas, and unit test suites.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 text-slate-400">
            <span>Client & In-Memory NLP</span>
            <span>·</span>
            <span>Zero-PII Storage</span>
            <span>·</span>
            <span>ReportLab & jsPDF Export</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProjectKitModal
        isOpen={isProjectKitOpen}
        onClose={() => setIsProjectKitOpen(false)}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectEntry={(item) => setAnalysisResult(item)}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
