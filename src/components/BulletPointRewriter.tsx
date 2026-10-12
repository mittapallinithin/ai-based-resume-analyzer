import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, Lightbulb } from 'lucide-react';

export const BulletPointRewriter: React.FC = () => {
  const [inputBullet, setInputBullet] = useState('Created a web app using React and Node.js for student notes.');
  const [enhancedBullets, setEnhancedBullets] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const sampleWeakBullets = [
    'Created a web app using React and Node.js for student notes.',
    'Worked on backend database queries in MySQL.',
    'Built machine learning model for image classification.',
    'Helped the team with bug fixes and code testing.'
  ];

  const handleRewrite = () => {
    if (!inputBullet.trim()) return;

    // Deterministic algorithmic enhancement based on Google's XYZ format:
    // "Accomplished [X] as measured by [Y] by doing [Z]"
    const text = inputBullet.trim();
    const suggestions: string[] = [];

    if (text.toLowerCase().includes('react') || text.toLowerCase().includes('web') || text.toLowerCase().includes('frontend')) {
      suggestions.push(
        `Architected responsive web application using React and Node.js; reduced client-side bundle size by 28% and scaled to 1,500+ student users with 99.8% uptime.`,
        `Engineered modular component architecture with React and RESTful APIs, accelerating page interactive load time from 2.4s to 850ms across 20+ university cohorts.`,
        `Developed full-stack web service integrating React with authenticated backend endpoints; implemented optimistic UI updates decreasing perceived latency by 40%.`
      );
    } else if (text.toLowerCase().includes('database') || text.toLowerCase().includes('sql') || text.toLowerCase().includes('mysql')) {
      suggestions.push(
        `Optimized high-volume relational SQL queries and indexed database tables, reducing execution latency by 45% and supporting 2,000+ peak transactions per second.`,
        `Designed normalized database schemas and implemented connection pooling in MySQL; resolved bottleneck issues to cut average query response time to under 35ms.`
      );
    } else if (text.toLowerCase().includes('machine learning') || text.toLowerCase().includes('model') || text.toLowerCase().includes('image')) {
      suggestions.push(
        `Engineered deep learning Convolutional Neural Network (CNN) pipeline with PyTorch; achieved 93.4% classification accuracy across 4,500+ validated test samples.`,
        `Built and fine-tuned predictive machine learning models with Scikit-Learn; boosted inference throughput by 3.2x by deploying optimized ONNX runtime weights.`
      );
    } else {
      suggestions.push(
        `Engineered robust software feature utilizing modern design patterns; increased test code coverage to 92% and decreased critical defect rate by 35%.`,
        `Spearheaded modular implementation of core functionalities; enhanced system throughput by 25% and documented comprehensive API specifications for cross-functional teams.`
      );
    }

    setEnhancedBullets(suggestions);
  };

  const copyBullet = (bullet: string, index: number) => {
    navigator.clipboard.writeText(bullet);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-5 mt-6">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <h4 className="font-bold text-slate-900 text-sm">
          Interactive Resume Bullet Optimizer (Google XYZ Formula)
        </h4>
      </div>
      <p className="text-xs text-slate-500 mb-3">
        Paste any plain bullet point from your projects or experience. The optimizer will rewrite it using strong action verbs and quantified engineering metrics.
      </p>

      {/* Preset weak bullets */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
        <span className="text-[11px] text-slate-400 font-medium">Try example:</span>
        {sampleWeakBullets.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setInputBullet(sample);
              setEnhancedBullets([]);
            }}
            className="text-[11px] text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded truncate max-w-xs"
          >
            {sample}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={inputBullet}
          onChange={(e) => setInputBullet(e.target.value)}
          placeholder="e.g. Worked on database in MySQL and improved app..."
          className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleRewrite}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>Optimize Bullet</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {enhancedBullets.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Quantified Action-Oriented Alternatives:
          </p>
          {enhancedBullets.map((bullet, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-800 flex items-start justify-between gap-3 shadow-2xs hover:border-blue-300 transition-colors"
            >
              <div className="leading-relaxed">
                <span className="font-semibold text-blue-600 mr-1.5">•</span>
                {bullet}
              </div>
              <button
                type="button"
                onClick={() => copyBullet(bullet, idx)}
                className="shrink-0 text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
                title="Copy to clipboard"
              >
                {copiedIndex === idx ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
