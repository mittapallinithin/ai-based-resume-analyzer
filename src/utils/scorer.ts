import { AnalysisResult, Recommendation } from '../types';
import { extractCandidateInfo } from './parser';
import { extractSkills } from './skillOntology';

const ACTION_VERBS = [
  'developed', 'engineered', 'built', 'implemented', 'optimized',
  'architected', 'reduced', 'improved', 'increased', 'designed',
  'deployed', 'automated', 'streamlined', 'scaled', 'refactored',
  'orchestrated', 'integrated', 'accelerated', 'benchmarked'
];

const CORE_CS_SKILLS = [
  'Data Structures & Algorithms',
  'DBMS',
  'Operating Systems',
  'Computer Networks',
  'Object-Oriented Programming (OOP)',
  'System Design'
];

export function computeAnalysis(
  resumeText: string,
  jobDescriptionText: string,
  resumeFileName: string = 'Resume.pdf',
  targetRole: string = 'Software Engineer'
): AnalysisResult {
  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobDescriptionText);

  if (jobSkills.length === 0) {
    throw new Error(
      'The provided job description does not contain recognized technical skills. Please include specific technical requirements (e.g., Python, React, SQL, Docker, Data Structures).'
    );
  }

  const matchedSkills = jobSkills.filter(s => resumeSkills.includes(s));
  const missingSkills = jobSkills.filter(s => !resumeSkills.includes(s));
  const additionalSkills = resumeSkills.filter(s => !jobSkills.includes(s));

  // 1. Skill Coverage Metric (55% weight)
  const skillCoveragePct = Math.round((matchedSkills.length / jobSkills.length) * 100);

  // 2. Core CS Fundamentals Metric (15% weight)
  const coreCsFound = CORE_CS_SKILLS.filter(s => resumeSkills.includes(s));
  const coreCsPct = Math.min(100, Math.round((coreCsFound.length / 3) * 100));

  // 3. Project Impact & Action Verbs (20% weight)
  const lowerText = resumeText.toLowerCase();
  const matchedVerbs = ACTION_VERBS.filter(verb => lowerText.includes(verb));
  const quantifiedMetrics = (resumeText.match(/\b\d+(?:%|\+|ms|k|m|x|fps|users|requests)\b/gi) || []).length;
  
  const projectScorePct = Math.min(
    100,
    Math.round(matchedVerbs.length * 8 + quantifiedMetrics * 14)
  );

  // 4. Candidate Info & Completeness Metric (10% weight)
  const candidateInfo = extractCandidateInfo(resumeText);
  let completenessScore = 0;
  if (candidateInfo.email !== 'Not detected') completenessScore += 25;
  if (candidateInfo.phone !== 'Not detected') completenessScore += 25;
  if (candidateInfo.github || candidateInfo.linkedin) completenessScore += 25;
  if (candidateInfo.education.length > 0) completenessScore += 25;

  // Overall Weighted Score
  const overallScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        0.55 * skillCoveragePct +
        0.20 * projectScorePct +
        0.15 * coreCsPct +
        0.10 * completenessScore
      )
    )
  );

  // Structured Placement Recommendations
  const suggestions: Recommendation[] = [];

  if (missingSkills.length > 0) {
    suggestions.push({
      id: 'rec-missing-skills',
      category: 'Skill Gap',
      priority: 'High',
      title: 'Address Critical Job Requirement Gaps',
      description: `Your resume is missing ${missingSkills.length} key skill${missingSkills.length > 1 ? 's' : ''} requested in the job description: ${missingSkills.slice(0, 4).join(', ')}.`,
      actionableTip: `If you have academic, project, or coursework experience in ${missingSkills[0]}, explicitly add it under your Skills and Projects sections.`
    });
  }

  if (quantifiedMetrics < 3) {
    suggestions.push({
      id: 'rec-metrics',
      category: 'Project Impact',
      priority: 'High',
      title: 'Apply Google\'s XYZ Formula to Project Bullets',
      description: `We detected only ${quantifiedMetrics} quantified achievement metric(s). Top tech recruiters filter for measurable business or engineering impact.`,
      actionableTip: 'Frame bullets as: "Accomplished [X], measured by [Y]%, by implementing [Z]" (e.g., "Reduced database query latency by 35% through Redis indexing").'
    });
  }

  if (coreCsFound.length < 2) {
    suggestions.push({
      id: 'rec-core-cs',
      category: 'Core CS Fundamentals',
      priority: 'High',
      title: 'Explicitly List Core CS Coursework for Placement Screening',
      description: 'Campus placement shortlisting bots prioritize candidates who demonstrate strong CS fundamentals.',
      actionableTip: 'Ensure your coursework list mentions Data Structures & Algorithms, DBMS, Operating Systems, and Computer Networks.'
    });
  }

  if (!candidateInfo.github) {
    suggestions.push({
      id: 'rec-github',
      category: 'Profile Visibility',
      priority: 'Medium',
      title: 'Add a Visible GitHub Profile Link',
      description: 'Software Engineering recruiters check your GitHub to evaluate code quality, commit consistency, and documentation.',
      actionableTip: 'Add "GitHub: github.com/your-handle" at the top contact header with 2-3 well-documented pinned repositories.'
    });
  }

  if (candidateInfo.wordCount < 250) {
    suggestions.push({
      id: 'rec-brevity',
      category: 'Formatting',
      priority: 'Medium',
      title: 'Resume Appears Too Brief',
      description: `Your resume has only ~${candidateInfo.wordCount} words. Standard single-page undergraduate resumes typically have 400-600 words.`,
      actionableTip: 'Expand on your project architectures, tech stacks, and team contributions.'
    });
  } else if (candidateInfo.wordCount > 900) {
    suggestions.push({
      id: 'rec-length',
      category: 'Formatting',
      priority: 'Medium',
      title: 'Resume May Exceed 1-Page Placement Standard',
      description: `Your resume has ~${candidateInfo.wordCount} words, which often spills into 2 pages. Freshers and campus placements strongly benefit from a concise 1-page format.`,
      actionableTip: 'Trim redundant bullets, condense older school achievements, and keep only high-impact college projects.'
    });
  }

  return {
    id: 'eval-' + Date.now().toString(36),
    timestamp: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    overallScore,
    skillCoveragePct,
    projectScorePct,
    coreCsPct,
    completenessPct: completenessScore,
    matchedSkills,
    missingSkills,
    additionalSkills,
    jobSkills,
    resumeSkills,
    candidateInfo,
    suggestions,
    quantifiedBulletCount: quantifiedMetrics,
    actionVerbCount: matchedVerbs.length,
    targetRole,
    resumeFileName,
    scoringFormula: '0.55 × Skill Coverage + 0.20 × Project Impact + 0.15 × Core CS + 0.10 × Profile Completeness'
  };
}
