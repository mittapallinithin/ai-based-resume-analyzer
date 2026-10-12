import React from 'react';
import { Briefcase, Sparkles, X, CheckCircle, ArrowRight } from 'lucide-react';
import { SAMPLE_JOB_DESCRIPTIONS } from '../data/sampleData';
import { extractSkills } from '../utils/skillOntology';

interface JobDescriptionInputProps {
  jobDescriptionText: string;
  onJobDescriptionChange: (text: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  jobDescriptionText,
  onJobDescriptionChange,
  onAnalyze,
  isAnalyzing,
  canAnalyze
}) => {
  const detectedSkills = extractSkills(jobDescriptionText);
  const wordCount = jobDescriptionText.trim().split(/\s+/).filter(Boolean).length;

  const handleSelectPreset = (id: string) => {
    const preset = SAMPLE_JOB_DESCRIPTIONS.find(j => j.id === id);
    if (preset) {
      onJobDescriptionChange(preset.text);
    }
  };

  const handleClear = () => {
    onJobDescriptionChange('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="font-bold text-slate-900 text-base">Target Job Description</h2>
          </div>
          {jobDescriptionText && (
            <button
              onClick={handleClear}
              className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Paste the job posting requirements or select a preset job description.
        </p>

        {/* Quick Role Presets */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-medium">Quick presets:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_JOB_DESCRIPTIONS.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => handleSelectPreset(job.id)}
                className="text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 hover:border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors text-left"
              >
                {job.title.split('—')[0].replace('Software Development Engineer - ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* JD Textarea */}
        <div className="relative">
          <textarea
            value={jobDescriptionText}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            rows={7}
            placeholder="Paste the target job description here... e.g. Requirements: B.Tech in CSE, strong knowledge of Python, React, PostgreSQL, Docker, Git, Data Structures..."
            className="w-full p-3.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-y transition-all"
          />

          {/* Real-time skills detected preview in JD */}
          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              {detectedSkills.length > 0 ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {detectedSkills.length} required skill{detectedSkills.length > 1 ? 's' : ''} detected
                </span>
              ) : (
                <span className="text-slate-400">No skills recognized yet</span>
              )}
            </div>
            <span>{wordCount} words</span>
          </div>
        </div>
      </div>

      {/* Main Call to Action Button */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            canAnalyze && !isAnalyzing
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-[0.99] cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Match Metrics...</span>
            </>
          ) : (
            <>
              <span>Analyze Resume & Calculate Match Score</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        {!canAnalyze && (
          <p className="text-[11px] text-center text-slate-400 mt-2">
            Please provide both a resume and a job description to trigger analysis.
          </p>
        )}
      </div>
    </div>
  );
};
