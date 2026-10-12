"""
tests/test_analyzer.py - Unit Test Suite for AI-Based Resume Analyzer
Author: B.Tech CSE Final Year Project
Tests parsing logic, skill ontology extraction, and transparent match scoring.
"""

import unittest
from nlp_engine import extract_skills_from_text, calculate_match_metrics, parse_candidate_info

class TestResumeAnalyzer(unittest.TestCase):

    def setUp(self):
        self.sample_resume = """
        John Doe
        Email: john.doe@example.com | Phone: +91 9876543210
        GitHub: https://github.com/johndoe | LinkedIn: https://linkedin.com/in/johndoe
        
        EDUCATION
        B.Tech in Computer Science and Engineering, 2024
        
        SKILLS
        Languages: Python, Java, JavaScript, C++, SQL
        Frameworks: React, Node.js, Express, Django
        Databases: MongoDB, PostgreSQL, Redis
        Cloud & Tools: Docker, Git, Linux
        Core CS: Data Structures & Algorithms, DBMS, Operating Systems
        
        PROJECTS
        AI Resume Matcher: Built using React, Python, and PostgreSQL. Reduced search latency by 45% and served 2,000+ active sessions.
        Distributed Cache: Engineered custom in-memory key-value store using C++ and Redis protocols. Optimized throughput by 30%.
        """

        self.sample_job_description = """
        We are seeking a Software Development Engineer (SDE 1).
        Requirements:
        - Strong proficiency in Python, React, and SQL.
        - Experience with Docker, Git, and Linux.
        - Knowledge of Data Structures, Algorithms, and DBMS.
        - Familiarity with Kubernetes, AWS, and TypeScript is a plus.
        """

    def test_candidate_info_parsing(self):
        info = parse_candidate_info(self.sample_resume)
        self.assertEqual(info['email'], 'john.doe@example.com')
        self.assertIn('github.com/johndoe', info['github'])
        self.assertTrue(len(info['education']) > 0)

    def test_skill_extraction(self):
        skills = extract_skills_from_text(self.sample_resume)
        self.assertIn('Python', skills)
        self.assertIn('React', skills)
        self.assertIn('Docker', skills)
        self.assertIn('Data Structures & Algorithms', skills)

    def test_scoring_with_matched_and_missing_skills(self):
        result = calculate_match_metrics(self.sample_resume, self.sample_job_description)
        self.assertNotIn('error', result)
        self.assertGreater(result['overall_score'], 60)
        self.assertIn('Python', result['matched_skills'])
        self.assertIn('React', result['matched_skills'])
        # Missing skills from JD: Kubernetes, AWS, TypeScript
        self.assertIn('Kubernetes', result['missing_skills'])
        self.assertIn('AWS', result['missing_skills'])
        self.assertIn('TypeScript', result['missing_skills'])

    def test_empty_job_description_handling(self):
        empty_jd = "Great company looking for enthusiastic self-starter. Fast paced environment."
        result = calculate_match_metrics(self.sample_resume, empty_jd)
        self.assertIn('error', result)

if __name__ == '__main__':
    unittest.main()
