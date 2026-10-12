import React from 'react';
import { AlertCircle, CheckCircle, Lightbulb, BookOpen, ChevronRight, Terminal } from 'lucide-react';
import { AnalysisResult } from '../types';
import { BulletPointRewriter } from './BulletPointRewriter';

interface FeedbackSectionProps {
  analysis: AnalysisResult;
}

const CORE_CS_TOPICS = [
  { name: 'Data Structures & Algorithms', key: 'Data Structures & Algorithms', why: 'Primary filter for technical coding rounds (LeetCode / HackerRank).' },
  { name: 'DBMS & SQL', key: 'DBMS', why: 'Essential for indexing, normalization, and ACID transaction questions.' },
  { name: 'Operating Systems', key: 'Operating Systems', why: 'Core questions on threads, process synchronization, paging, and deadlocks.' },
  { name: 'Computer Networks', key: 'Computer Networks', why: 'Tested for TCP/IP, HTTP/HTTPS, DNS, and socket programming.' },
  { name: 'Object-Oriented Programming (OOP)', key: 'Object-Oriented Programming (OOP)', why: 'Polymorphism, inheritance, interfaces, and SOLID principles.' },
  { name: 'System Design Basics', key: 'System Design', why: 'Differentiator for SDE 1 roles (caching, load balancing, databases).' }
];

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ analysis }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
      <div className="mb-5">
        <h3 className="font-bold text-slate-900 text-base">
          Placement Feedback & Optimization Checklist
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Actionable insights derived from B.Tech campus recruitment criteria and technical interview standards.
        </p>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-3">
        {analysis.suggestions.map((rec) => {
          let badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
          if (rec.priority === 'High') badgeColor = 'bg-red-50 text-red-700 border-red-200';
          else if (rec.priority === 'Medium') badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';

          return (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeColor}`}>
                    {rec.priority} Priority
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-semibold text-slate-700">{rec.category}</span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1">{rec.title}</h4>
              <p className="text-xs text-slate-600 mb-2.5 leading-relaxed">{rec.description}</p>

              <div className="bg-white border border-slate-200/90 rounded-lg p-2.5 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900">Recommended Action: </span>
                  {rec.actionableTip}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Core CS Campus Placement Audit */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <h4 className="font-bold text-slate-900 text-sm">
              Core Computer Science Placement Readiness Audit
            </h4>
          </div>
          <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
            {analysis.coreCsPct}% Covered
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {CORE_CS_TOPICS.map((topic) => {
            const isPresent = analysis.resumeSkills.some(
              s => s.toLowerCase().includes(topic.key.toLowerCase()) || topic.key.toLowerCase().includes(s.toLowerCase())
            );

            return (
              <div
                key={topic.name}
                className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                  isPresent
                    ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {isPresent ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-semibold flex items-center justify-between">
                    <span>{topic.name}</span>
                    <span className="text-[10px] font-normal text-slate-400">
                      {isPresent ? 'Present' : 'Missing'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {topic.why}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Interview Prep Triggers based on Missing Skills */}
      {analysis.missingSkills.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-slate-700" />
            <h4 className="font-bold text-slate-900 text-sm">
              Anticipated Interview Questions for Missing Skills
            </h4>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Recruiters hiring for this role will likely probe you on these areas. Prepare these sample answers:
          </p>

          <div className="space-y-2">
            {analysis.missingSkills.slice(0, 3).map((skill, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                <span className="font-bold text-blue-700">Q: How would you approach {skill} in production?</span>
                <p className="text-slate-600 mt-1">
                  Review the official architecture documentation for <span className="font-semibold">{skill}</span>. Focus on how it solves concurrency, horizontal scaling, or latency problems compared to traditional alternatives.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Bullet Point Rewriter */}
      <BulletPointRewriter />
    </div>
  );
};
