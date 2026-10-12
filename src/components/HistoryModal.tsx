import React from 'react';
import { X, Trash2, Calendar, FileText, ArrowUpRight } from 'lucide-react';
import { AnalysisResult } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: AnalysisResult[];
  onSelectEntry: (item: AnalysisResult) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectEntry,
  onClearHistory
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Analysis History & Past Scans</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and compare your resume score progressions across different job roles.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No Past Scans Yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Run your first resume analysis and results will be saved here for progress comparison.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                let badgeClass = 'bg-red-50 text-red-700 border-red-200';
                if (item.overallScore >= 75) badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                else if (item.overallScore >= 60) badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                else if (item.overallScore >= 45) badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectEntry(item);
                      onClose();
                    }}
                    className="p-3.5 bg-slate-50/70 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {item.candidateInfo.name}
                        </span>
                        <span className="text-[11px] text-slate-400">·</span>
                        <span className="text-xs text-slate-600 truncate">{item.targetRole}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.timestamp}
                        </span>
                        <span>·</span>
                        <span>{item.matchedSkills.length} matched / {item.missingSkills.length} missing</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClass}`}>
                        {item.overallScore}%
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <span className="text-[11px] text-slate-400">
              {history.length} stored scan{history.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
