// static/js/main.js - Frontend interactions for Flask template

const sampleResumes = {
  sde: `Rahul Sharma
Email: rahul.cse@example.com | Phone: +91 9812345678
GitHub: github.com/rahul-codes | LinkedIn: linkedin.com/in/rahul-sharma

EDUCATION
B.Tech in Computer Science and Engineering, National Institute of Technology (2021-2025) | CGPA: 8.8/10

TECHNICAL SKILLS
Languages: Python, Java, JavaScript, TypeScript, C++, SQL
Frameworks & Libraries: React, Node.js, Express, Tailwind CSS, Next.js
Databases: PostgreSQL, MongoDB, Redis
Cloud & Tools: Docker, Git, Linux, Postman
Core Fundamentals: Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks

PROJECTS
1. E-Commerce Microservices Engine
- Architected scalable RESTful API service using Node.js, Express, and PostgreSQL.
- Implemented Redis caching layer which decreased database read latency by 42%.
- Containerized microservices using Docker and managed Git versioning with 25+ merged PRs.

2. Algorithmic Code Visualizer
- Developed interactive web app with React and TypeScript to visualize sorting and graph algorithms.
- Handled state transitions for 100+ nodes with 60 FPS performance.`,

  ml: `Priya Patel
Email: priya.ml@example.com | Phone: +91 9876501234
GitHub: github.com/priyapatel | LinkedIn: linkedin.com/in/priya-patel

EDUCATION
B.Tech in Computer Science (Artificial Intelligence & ML), 2021-2025 | CGPA: 9.1/10

TECHNICAL SKILLS
Languages: Python, R, SQL, C++
AI / ML: TensorFlow, PyTorch, Scikit-Learn, Pandas, NumPy, OpenCV, Natural Language Processing
Databases & Cloud: MySQL, MongoDB, AWS, Docker, Git
Core CS: Data Structures & Algorithms, DBMS, Object-Oriented Programming

PROJECTS
1. Real-time Brain Tumor MRI Classifier
- Built Convolutional Neural Network (CNN) with PyTorch and OpenCV achieving 94.2% test accuracy.
- Processed and augmented 3,500+ radiological medical images with NumPy and Pandas.
- Deployed inference API using FastAPI and Docker on AWS EC2.`
};

const sampleJDs = {
  fullstack: `Role: Software Development Engineer - SDE 1 (Full Stack)
Requirements:
- Bachelor's degree in Computer Science, IT, or related engineering discipline.
- Proficiency in Python or JavaScript/TypeScript.
- Hands-on experience with modern frontend frameworks (React or Next.js).
- Strong understanding of backend REST APIs with Node.js, Express, or Django.
- Database expertise in SQL (PostgreSQL/MySQL) and familiarity with MongoDB or Redis.
- Solid understanding of Core CS fundamentals: Data Structures, Algorithms, DBMS, and OS.
- Experience with Docker, Git, and Linux is highly desirable.`,

  aiml: `Role: Machine Learning / AI Engineer
Requirements:
- B.Tech/M.Tech in Computer Science, Data Science, or related field.
- Strong programming foundation in Python and SQL.
- Deep understanding of Machine Learning algorithms, Deep Learning, and NLP.
- Practical experience with PyTorch, TensorFlow, Scikit-Learn, Pandas, and NumPy.
- Familiarity with Docker, AWS, and REST API deployment.
- Strong knowledge of Data Structures and Algorithms.`
};

function loadSampleResume(type) {
  document.getElementById('resume-text').value = sampleResumes[type] || '';
  const details = document.querySelector('.manual-input-toggle details');
  if (details) details.open = true;
  alert('Sample resume loaded! Now select a job description or load a sample.');
}

function loadSampleJD(type) {
  document.getElementById('job-description').value = sampleJDs[type] || '';
}

async function submitAnalysis() {
  const fileInput = document.getElementById('resume-file');
  const resumeText = document.getElementById('resume-text').value.trim();
  const jobDescription = document.getElementById('job-description').value.trim();
  const analyzeBtn = document.getElementById('analyze-btn');

  if (!jobDescription) {
    alert('Please paste a job description to calculate match score.');
    return;
  }

  if (!fileInput.files.length && !resumeText) {
    alert('Please upload a resume file (PDF/DOCX) or paste resume text.');
    return;
  }

  const formData = new FormData();
  if (fileInput.files.length > 0) {
    formData.append('resume', fileInput.files[0]);
  } else {
    formData.append('resume_text', resumeText);
  }
  formData.append('job_description', jobDescription);

  try {
    analyzeBtn.disabled = true;
    analyzeBtn.innerText = 'Analyzing Resume...';

    const res = await fetch('/api/analyze', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Failed to analyze resume.');
      return;
    }

    renderResults(data);
  } catch (err) {
    alert('Network error: ' + err.message);
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.innerText = 'Analyze Resume & Calculate Match';
  }
}

function renderResults(data) {
  const resultsSec = document.getElementById('results-section');
  resultsSec.classList.remove('hidden');
  resultsSec.scrollIntoView({ behavior: 'smooth' });

  document.getElementById('score-number').innerText = data.overall_score + '%';
  document.getElementById('formula-text').innerText = data.scoring_formula;
  document.getElementById('metric-skill').innerText = data.skill_coverage_pct + '%';
  document.getElementById('metric-project').innerText = data.project_score_pct + '%';
  document.getElementById('metric-core-cs').innerText = data.core_cs_pct + '%';

  const matchedContainer = document.getElementById('matched-skills-list');
  matchedContainer.innerHTML = data.matched_skills.map(s => 
    `<span class="skill-tag matched">${s}</span>`
  ).join('') || '<span class="hint">No direct technical skills matched.</span>';

  const missingContainer = document.getElementById('missing-skills-list');
  missingContainer.innerHTML = data.missing_skills.map(s => 
    `<span class="skill-tag missing">${s}</span>`
  ).join('') || '<span class="hint">None! Your resume covers all required skills.</span>';

  const feedbackContainer = document.getElementById('feedback-list');
  feedbackContainer.innerHTML = data.suggestions.map(f => 
    `<div class="feedback-item">
      <strong>[${f.priority} Priority] ${f.category}:</strong> ${f.text}
    </div>`
  ).join('');
}
