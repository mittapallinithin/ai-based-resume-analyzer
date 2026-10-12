import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, PlusCircle, Search, Copy, Check } from 'lucide-react';
import { AnalysisResult } from '../types';

interface SkillMatrixProps {
  analysis: AnalysisResult;
}

export const SkillMatrix: React.FC<SkillMatrixProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'matched' | 'missing' | 'additional'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSkill, setCopiedSkill] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSkill(text);
    setTimeout(() => setCopiedSkill(null), 2000);
  };

  const filterQuery = (list: string[]) => {
    if (!searchQuery) return list;
    return list.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const matched = filterQuery(analysis.matchedSkills);
  const missing = filterQuery(analysis.missingSkills);
  const additional = filterQuery(analysis.additionalSkills);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            Technical Skill Gap Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Breakdown of matched competencies versus missing job posting requirements.
          </p>
        </div>

        {/* Search skill bar */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skill (e.g. Docker)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-lg mb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'all'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Skills ({analysis.matchedSkills.length + analysis.missingSkills.length})
        </button>
        <button
          onClick={() => setActiveTab('matched')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
            activeTab === 'matched'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Matched ({analysis.matchedSkills.length})
        </button>
        <button
          onClick={() => setActiveTab('missing')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
            activeTab === 'missing'
              ? 'bg-red-600 text-white shadow-2xs'
              : 'text-red-700 hover:bg-red-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Missing ({analysis.missingSkills.length})
        </button>
        <button
          onClick={() => setActiveTab('additional')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'additional'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Bonus Skills ({analysis.additionalSkills.length})
        </button>
      </div>

      {/* Skills Display Grid */}
      <div className="space-y-4">
        {/* Matched Skills */}
        {(activeTab === 'all' || activeTab === 'matched') && matched.length > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-2">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Matched Skills ({matched.length})
              </span>
              <span className="text-[11px] text-emerald-600 font-normal">Found in both resume & job posting</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {matched.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {(activeTab === 'all' || activeTab === 'missing') && (
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-red-800 mb-2">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                Missing Required Skills ({missing.length})
              </span>
              <span className="text-[11px] text-red-600 font-normal">Requested by recruiter but missing in resume</span>
            </div>
            {missing.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {missing.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => copyToClipboard(skill)}
                    title="Click to copy skill name for study or adding to resume"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 transition-colors group cursor-pointer"
                  >
                    <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                    <span>{skill}</span>
                    {copiedSkill === skill ? (
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    ) : (
                      <Copy className="w-2.5 h-2.5 text-red-400 group-hover:text-red-700 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
                Awesome! No missing required skills detected against this job description.
              </p>
            )}
          </div>
        )}

        {/* Additional Candidate Strengths */}
        {(activeTab === 'all' || activeTab === 'additional') && additional.length > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span className="flex items-center gap-1">
                <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
                Additional Candidate Skills ({additional.length})
              </span>
              <span className="text-[11px] text-slate-500 font-normal">Present on resume, bonus strengths</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {additional.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {matched.length === 0 && missing.length === 0 && additional.length === 0 && (
          <p className="text-xs text-slate-400 py-4 text-center">
            No skills match your search query "{searchQuery}".
          </p>
        )}
      </div>
    </div>
  );
};
