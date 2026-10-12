export interface CandidateInfo {
  name: string;
  email: string;
  phone: string;
  github: string | null;
  linkedin: string | null;
  education: string[];
  wordCount: number;
}

export interface SkillCategoryGroup {
  category: string;
  skills: string[];
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  overallScore: number;
  skillCoveragePct: number;
  projectScorePct: number;
  coreCsPct: number;
  completenessPct: number;
  matchedSkills: string[];
  missingSkills: string[];
  additionalSkills: string[];
  jobSkills: string[];
  resumeSkills: string[];
  candidateInfo: CandidateInfo;
  suggestions: Recommendation[];
  quantifiedBulletCount: number;
  actionVerbCount: number;
  targetRole: string;
  resumeFileName: string;
  scoringFormula: string;
}

export interface Recommendation {
  id: string;
  category: 'Skill Gap' | 'Project Impact' | 'Core CS Fundamentals' | 'Profile Visibility' | 'Formatting';
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  actionableTip: string;
}

export interface SampleResume {
  id: string;
  label: string;
  role: string;
  experienceLevel: string;
  text: string;
}

export interface SampleJobDescription {
  id: string;
  title: string;
  companyTier: string;
  text: string;
}
