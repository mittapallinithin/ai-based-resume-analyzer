/**
 * skillOntology.ts - Technical Skill Dictionary & Normalization Rules
 * Specifically curated for B.Tech Computer Science campus placements and tech hiring.
 */

export const SKILL_TAXONOMY: Record<string, string[]> = {
  "Programming Languages": [
    "python", "java", "c++", "c", "c#", "javascript", "typescript",
    "go", "golang", "rust", "kotlin", "ruby", "php", "swift", "dart", "r", "scala"
  ],
  "Frontend & UI Frameworks": [
    "react", "next.js", "vue", "angular", "tailwind css", "html5", "css3",
    "redux", "sass", "bootstrap", "vite", "webpack", "graphql"
  ],
  "Backend & APIs": [
    "node.js", "express", "django", "flask", "fastapi", "spring boot", "spring",
    "asp.net", "nest.js", "rest api", "microservices", "grpc", "websockets"
  ],
  "Databases & Caching": [
    "sql", "postgresql", "mysql", "mongodb", "redis", "sqlite",
    "cassandra", "dynamodb", "elasticsearch", "firebase firestore", "prisma"
  ],
  "Cloud & DevOps": [
    "aws", "gcp", "azure", "docker", "kubernetes", "git", "github", "gitlab",
    "ci/cd", "jenkins", "linux", "nginx", "terraform", "bash", "shell scripting", "github actions"
  ],
  "Core CS & Systems (Placements)": [
    "data structures", "algorithms", "dsa", "object-oriented programming", "oops", "oop",
    "dbms", "operating systems", "computer networks", "system design",
    "distributed systems", "computer architecture", "compiler design"
  ],
  "AI, Data Science & Machine Learning": [
    "machine learning", "deep learning", "artificial intelligence", "nlp",
    "natural language processing", "computer vision", "tensorflow", "pytorch",
    "scikit-learn", "pandas", "numpy", "opencv", "data analysis", "llm", "genai", "transformer"
  ],
  "Testing & Quality Assurance": [
    "junit", "pytest", "jest", "postman", "selenium", "cypress", "unit testing"
  ]
};

export const SKILL_ALIASES: Record<string, string> = {
  "react.js": "React",
  "reactjs": "React",
  "react": "React",
  "nextjs": "Next.js",
  "next.js": "Next.js",
  "node": "Node.js",
  "nodejs": "Node.js",
  "node.js": "Node.js",
  "expressjs": "Express",
  "express": "Express",
  "golang": "Go",
  "go": "Go",
  "k8s": "Kubernetes",
  "kubernetes": "Kubernetes",
  "amazon web services": "AWS",
  "aws": "AWS",
  "google cloud": "GCP",
  "google cloud platform": "GCP",
  "gcp": "GCP",
  "azure": "Microsoft Azure",
  "dsa": "Data Structures & Algorithms",
  "data structures": "Data Structures & Algorithms",
  "algorithms": "Data Structures & Algorithms",
  "oops": "Object-Oriented Programming (OOP)",
  "oop": "Object-Oriented Programming (OOP)",
  "object-oriented programming": "Object-Oriented Programming (OOP)",
  "dbms": "DBMS",
  "database management": "DBMS",
  "os": "Operating Systems",
  "operating systems": "Operating Systems",
  "cn": "Computer Networks",
  "computer networks": "Computer Networks",
  "system design": "System Design",
  "tailwind": "Tailwind CSS",
  "tailwind css": "Tailwind CSS",
  "rest": "REST API",
  "rest api": "REST API",
  "restful api": "REST API",
  "ml": "Machine Learning",
  "machine learning": "Machine Learning",
  "ai": "Artificial Intelligence",
  "artificial intelligence": "Artificial Intelligence",
  "nlp": "Natural Language Processing (NLP)",
  "natural language processing": "Natural Language Processing (NLP)",
  "docker": "Docker",
  "git": "Git",
  "github": "GitHub",
  "linux": "Linux",
  "sql": "SQL",
  "postgresql": "PostgreSQL",
  "postgres": "PostgreSQL",
  "mysql": "MySQL",
  "mongodb": "MongoDB",
  "mongo": "MongoDB",
  "redis": "Redis",
  "sqlite": "SQLite",
  "python": "Python",
  "java": "Java",
  "c++": "C++",
  "cpp": "C++",
  "c": "C",
  "c#": "C#",
  "javascript": "JavaScript",
  "js": "JavaScript",
  "typescript": "TypeScript",
  "ts": "TypeScript",
  "spring boot": "Spring Boot",
  "django": "Django",
  "flask": "Flask",
  "fastapi": "FastAPI",
  "pytorch": "PyTorch",
  "tensorflow": "TensorFlow",
  "pandas": "Pandas",
  "numpy": "NumPy",
  "scikit-learn": "Scikit-Learn",
  "ci/cd": "CI/CD",
  "postman": "Postman"
};

/**
 * Extracts normalized skills from any block of text using boundary-safe regex.
 */
export function extractSkills(text: string): string[] {
  if (!text) return [];

  const foundNormalized = new Set<string>();
  const normalizedText = " " + text.toLowerCase().replace(/[,;/|()[\]{}\n\r]/g, " ") + " ";

  // Iterate through all skills in taxonomy
  for (const category in SKILL_TAXONOMY) {
    const skills = SKILL_TAXONOMY[category];
    for (const skill of skills) {
      // Escape for regex
      const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const pattern = new RegExp(`(?:^|\\s|_|/)${escaped}(?:\\s|_|/|,|\\.|$)`, 'i');

      if (pattern.test(normalizedText)) {
        const canonical = SKILL_ALIASES[skill] || skill.charAt(0).toUpperCase() + skill.slice(1);
        foundNormalized.add(canonical);
      }
    }
  }

  return Array.from(foundNormalized).sort();
}
