import { SampleJobDescription, SampleResume } from '../types';

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'sde-fullstack',
    label: 'Rahul Sharma — SDE 1 (Full Stack)',
    role: 'Full Stack Web Developer',
    experienceLevel: 'B.Tech CSE Graduate (2025)',
    text: `Rahul Sharma
Hyderabad, India | +91 98765 43210 | rahul.sharma.cse@gmail.com
LinkedIn: linkedin.com/in/rahulsharma-dev | GitHub: github.com/rahulsharma-tech

EDUCATION
Bachelor of Technology in Computer Science and Engineering
Vellore Institute of Technology (VIT) | 2021 – 2025
CGPA: 8.92 / 10.0 | Relevant Coursework: Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, OOP

TECHNICAL SKILLS
• Programming Languages: C++, Python, JavaScript, TypeScript, SQL, HTML5, CSS3
• Frameworks & Web: React, Node.js, Express, Next.js, Tailwind CSS, REST API
• Databases & Storage: PostgreSQL, MongoDB, Redis
• Developer Tools & Cloud: Docker, Git, GitHub, Linux, Postman, AWS EC2
• Core Concepts: Object-Oriented Programming (OOP), System Design, CI/CD

PROJECTS
DevConnect — Developer Collaboration Platform | React, Node.js, PostgreSQL, Docker
• Engineered full-stack web application with role-based access control, serving 1,200+ active student developers.
• Optimized relational PostgreSQL queries with custom composite indexes, decreasing database read latency by 45%.
• Containerized client and microservices using Docker and deployed with automated GitHub Actions CI/CD pipeline.
• Implemented Redis in-memory caching for trending discussions, reducing API response times from 320ms to 48ms.

AlgoVisualizer — Interactive Algorithm Visualizer | React, TypeScript, Tailwind CSS
• Developed responsive single-page web app to visualize sorting (Quick, Merge) and graph pathfinding (Dijkstra, A*).
• Designed interactive state controllers with custom React hooks, rendering 100+ node grids at smooth 60 FPS.
• Attracted 3,500+ monthly unique visitors from developer communities on GitHub and Reddit.

ACHIEVEMENTS & CERTIFICATIONS
• Solved 450+ problems on LeetCode (Knight badge, Top 5% globally in DSA).
• Finalist at Smart India Hackathon (SIH 2024) among 15,000+ national teams.`
  },
  {
    id: 'ai-ml',
    label: 'Sneha Reddy — AI / Data Science Specialist',
    role: 'Machine Learning Engineer',
    experienceLevel: 'B.Tech CSE (AI & ML) 2025',
    text: `Sneha Reddy
Bengaluru, India | +91 99887 76655 | sneha.reddy.ml@gmail.com
LinkedIn: linkedin.com/in/snehareddy-ai | GitHub: github.com/snehareddy-data

EDUCATION
B.Tech in Computer Science & Engineering (Specialization in AI & ML)
National Institute of Technology (NIT) Karnataka | 2021 – 2025
CGPA: 9.15 / 10.0 | Core: Machine Learning, Deep Learning, NLP, Data Structures, DBMS

TECHNICAL SKILLS
• Languages: Python, SQL, C++, R
• AI / Machine Learning: PyTorch, TensorFlow, Scikit-Learn, OpenCV, Pandas, NumPy, Natural Language Processing
• Databases & Cloud: MySQL, MongoDB, AWS S3, Docker, Git
• Fundamentals: Data Structures & Algorithms, Object-Oriented Programming, Linear Algebra

PROJECTS
Medical Image Diagnostic Assistant | PyTorch, OpenCV, Flask, Docker
• Built deep learning Convolutional Neural Network (CNN) to classify chest X-ray pathologies across 4 conditions.
• Augmented 5,000+ radiological scans using OpenCV and NumPy, improving validation F1-score from 0.82 to 0.94.
• Packaged inference server into a lightweight Docker container and hosted REST API endpoint on AWS EC2.

Smart Document Query Bot | Python, NLP, Scikit-Learn, Transformers
• Implemented semantic search pipeline utilizing dense embeddings to search through 10,000+ technical PDF pages.
• Reduced document information retrieval turnaround from 15 minutes to under 800ms.
• Evaluated BLEU and ROUGE metrics to benchmark summary generation quality.`
  },
  {
    id: 'fresher-backend',
    label: 'Amit Verma — Backend Java & Systems',
    role: 'Backend SDE',
    experienceLevel: 'B.Tech CSE Graduate (2025)',
    text: `Amit Verma
New Delhi, India | +91 91234 56789 | amit.verma.cse@gmail.com
LinkedIn: linkedin.com/in/amit-verma | GitHub: github.com/amit-backend

EDUCATION
Bachelor of Technology in Computer Science & Engineering
Delhi Technological University (DTU) | 2021 – 2025
CGPA: 8.4 / 10.0 | Coursework: Operating Systems, Computer Networks, DBMS, Data Structures

TECHNICAL SKILLS
• Languages: Java, C++, Python, SQL
• Frameworks: Spring Boot, Spring, Hibernate, REST API
• Databases: MySQL, PostgreSQL, Redis
• Core CS: Object-Oriented Programming, DBMS, Operating Systems, Computer Networks, Data Structures & Algorithms
• Tools: Git, Linux, JUnit, Maven

PROJECTS
Banking Transaction Ledger API | Java, Spring Boot, MySQL, Redis
• Developed secure high-throughput REST API processing simulated financial ledger accounts.
• Handled concurrent fund transfers using pessimistic database locking, preventing race conditions and double-spends.
• Integrated Redis distributed lock mechanism and achieved 1,500+ requests per second throughput in load tests.`
  }
];

export const SAMPLE_JOB_DESCRIPTIONS: SampleJobDescription[] = [
  {
    id: 'sde-general',
    title: 'Software Development Engineer - SDE 1 (Full Stack)',
    companyTier: 'Tier 1 Product Company',
    text: `Role: Software Development Engineer (SDE 1)
Location: Bengaluru / Hyderabad / Remote

About the Role:
We are looking for ambitious Software Engineers to join our core engineering squad. You will design, build, and maintain mission-critical web applications, high-performance microservices, and user-centric interfaces.

Key Qualifications:
• B.Tech / B.E. / M.Tech in Computer Science, Information Technology, or related discipline.
• Strong foundation in core computer science subjects: Data Structures, Algorithms, DBMS, Operating Systems, and Computer Networks.
• Proficiency in modern programming languages such as Python, JavaScript, TypeScript, or C++.
• Hands-on experience developing responsive web applications using React or Next.js with modern CSS (e.g. Tailwind CSS).
• Experience designing robust backend REST APIs using Node.js, Express, or Python frameworks.
• Working knowledge of relational databases such as PostgreSQL or MySQL, and familiarity with Redis caching.
• Understanding of containerization using Docker, Git version control, and Linux command-line environments.
• Excellent problem-solving abilities and ability to write clean, maintainable, modular code.`
  },
  {
    id: 'ml-engineer',
    title: 'Associate AI / Machine Learning Engineer',
    companyTier: 'AI SaaS Unicorn',
    text: `Role: Machine Learning Engineer - Campus Placement
Location: Bengaluru, India

Requirements:
• B.Tech or M.Tech degree in Computer Science, Data Science, Artificial Intelligence, or equivalent.
• High proficiency in Python and statistical data manipulation using Pandas and NumPy.
• Demonstrated knowledge of classical Machine Learning algorithms (Scikit-Learn) and Deep Learning architectures (PyTorch or TensorFlow).
• Familiarity with Computer Vision (OpenCV) or Natural Language Processing (NLP).
• Hands-on experience building REST APIs with Flask or FastAPI and packaging code in Docker containers.
• Solid background in Data Structures, Algorithms, SQL, and Git.`
  },
  {
    id: 'backend-cloud',
    title: 'Backend Systems Engineer (Java / Cloud)',
    companyTier: 'Enterprise Cloud Platform',
    text: `Role: Backend Engineer (SDE 1)
Requirements:
• Bachelor's degree in Computer Science or Software Engineering.
• Strong command of Java or C++ and Object-Oriented Programming principles.
• Experience building enterprise REST APIs using Spring Boot or Node.js.
• Practical understanding of relational databases (MySQL, PostgreSQL) and SQL optimization.
• Solid grasp of Operating Systems, Multi-threading, Computer Networks, and System Design fundamentals.
• Exposure to Docker, Kubernetes, AWS, and Linux scripting is an advantage.`
  }
];
