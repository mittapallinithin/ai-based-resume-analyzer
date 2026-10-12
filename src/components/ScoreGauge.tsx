import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Cpu, Award, Target, FileCheck } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ScoreGaugeProps {
  analysis: AnalysisResult;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ analysis }) => {
  const [showFormula, setShowFormula] = useState(false);
  const score = analysis.overallScore;

  // Determine tier label and colors
  let statusText = 'Needs Improvement';
  let badgeClass = 'bg-red-50 text-red-700 border-red-200';
  let strokeColor = '#dc2626'; // Red

  if (score >= 75) {
    statusText = 'Placement Ready / Strong Match';
    badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    strokeColor = '#059669'; // Emerald
  } else if (score >= 60) {
    statusText = 'Competitive Candidate';
    badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
    strokeColor = '#2563eb'; // Blue
  } else if (score >= 45) {
    statusText = 'Moderate Alignment';
    badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
    strokeColor = '#d97706'; // Amber
  }

  // Circular progress math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
        {/* Radial Gauge */}
        <div className="relative flex flex-col items-center justify-center shrink-0">
          <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#e2e8f0"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={strokeColor}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Number in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {score}%
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Match Score
            </span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">
                  Resume Match Assessment
                </h3>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                  {statusText}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Role: <span className="font-semibold text-slate-700">{analysis.targetRole}</span>
              </p>
            </div>

            <button
              onClick={() => setShowFormula(!showFormula)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Scoring Logic</span>
              {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Sub-metric progress bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {/* 1. Skill Coverage */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Target className="w-3.5 h-3.5 text-blue-600" />
                  Required Skill Match (55%)
                </span>
                <span className="font-bold text-slate-900">{analysis.skillCoveragePct}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${analysis.skillCoveragePct}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {analysis.matchedSkills.length} of {analysis.jobSkills.length} required skills found
              </p>
            </div>

            {/* 2. Project Impact */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  Project Metrics & Action (20%)
                </span>
                <span className="font-bold text-slate-900">{analysis.projectScorePct}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${analysis.projectScorePct}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {analysis.quantifiedBulletCount} quantified metric(s) & {analysis.actionVerbCount} action verbs
              </p>
            </div>

            {/* 3. Core CS Fundamentals */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  Core CS Placement (15%)
                </span>
                <span className="font-bold text-slate-900">{analysis.coreCsPct}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${analysis.coreCsPct}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                DSA, DBMS, OS, Computer Networks & OOP
              </p>
            </div>

            {/* 4. Formatting & Completeness */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Profile Completeness (10%)
                </span>
                <span className="font-bold text-slate-900">{analysis.completenessPct}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${analysis.completenessPct}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Contact email, phone, links, and degree
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Formula Explanation */}
      {showFormula && (
        <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50/70 -mx-5 -mb-5 p-5 rounded-b-xl">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
            Transparent Scoring Algorithm (B.Tech CSE Criteria)
          </h4>
          <p className="text-xs text-slate-600 mb-2 font-mono bg-white p-2.5 rounded border border-slate-200">
            Overall Match = (0.55 × Skill Match %) + (0.20 × Project Impact %) + (0.15 × Core CS %) + (0.10 × Profile Completeness %)
          </p>
          <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
            <li><strong>Skill Coverage (55%):</strong> Evaluates canonical technical skills extracted against the job description using word-boundary NLP.</li>
            <li><strong>Project Action & Metrics (20%):</strong> Detects quantifiable engineering impacts (e.g. latency reductions, RPS, percentiles) and strong technical action verbs.</li>
            <li><strong>Core CS Foundation (15%):</strong> Checks for academic placement prerequisites (DSA, Operating Systems, DBMS, Networks).</li>
            <li><strong>Completeness (10%):</strong> Validates phone, email, GitHub/LinkedIn URLs, and academic degrees.</li>
          </ul>
          <p className="text-[11px] text-slate-400 mt-2 italic">
            * Note: This score is an algorithmic skill-match estimate designed for campus placement preparation and student self-audits, not an official closed-source ATS algorithm.
          </p>
        </div>
      )}
    </div>
  );
};
