import { jsPDF } from 'jspdf';
import { AnalysisResult } from '../types';

export function generatePdfReport(analysis: AnalysisResult) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Bar
  doc.setFillColor(37, 99, 235); // Blue primary
  doc.rect(0, 0, pageWidth, 8, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text('AI-Based Resume Analysis Report', 16, y);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Candidate: ${analysis.candidateInfo.name} | Target Role: ${analysis.targetRole} | Date: ${analysis.timestamp}`, 16, y);

  y += 10;
  // Summary Banner
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(16, y, pageWidth - 32, 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  let scoreColor = [37, 99, 235];
  if (analysis.overallScore >= 75) scoreColor = [5, 150, 105]; // Green
  else if (analysis.overallScore < 50) scoreColor = [220, 38, 38]; // Red
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(`${analysis.overallScore}%`, 22, y + 17);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Algorithmic ATS Placement Match Score', 55, y + 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Skill Match: ${analysis.skillCoveragePct}% | Projects: ${analysis.projectScorePct}% | Core CS: ${analysis.coreCsPct}% | Completeness: ${analysis.completenessPct}%`,
    55,
    y + 19
  );

  y += 34;

  // Scoring Formula Note
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Scoring Formula: ${analysis.scoringFormula}`, 16, y);

  y += 8;

  // Candidate Profile Snapshot
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Candidate Contact & Profile Check', 16, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`• Email: ${analysis.candidateInfo.email}`, 18, y);
  y += 5;
  doc.text(`• Phone: ${analysis.candidateInfo.phone}`, 18, y);
  y += 5;
  doc.text(`• GitHub: ${analysis.candidateInfo.github || 'Not detected (Recommended to add)'}`, 18, y);
  y += 5;
  doc.text(`• Degree/Stream: ${analysis.candidateInfo.education.join(', ') || 'Degree keywords not found'}`, 18, y);
  y += 9;

  // Matched Skills
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(5, 150, 105);
  doc.text(`Matched Technical Skills (${analysis.matchedSkills.length})`, 16, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const matchedText = analysis.matchedSkills.length > 0 ? analysis.matchedSkills.join(', ') : 'None detected';
  const splitMatched = doc.splitTextToSize(matchedText, pageWidth - 36);
  doc.text(splitMatched, 18, y);
  y += splitMatched.length * 5 + 6;

  // Missing Skills
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(220, 38, 38);
  doc.text(`Missing Required Skills from Job Description (${analysis.missingSkills.length})`, 16, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const missingText = analysis.missingSkills.length > 0 ? analysis.missingSkills.join(', ') : 'None! Full skill coverage.';
  const splitMissing = doc.splitTextToSize(missingText, pageWidth - 36);
  doc.text(splitMissing, 18, y);
  y += splitMissing.length * 5 + 8;

  // Key Recommendations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Key Improvement Suggestions for Placements', 16, y);
  y += 6;

  for (const sug of analysis.suggestions.slice(0, 4)) {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`• [${sug.priority} Priority] ${sug.title}`, 18, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const tipText = doc.splitTextToSize(sug.actionableTip, pageWidth - 40);
    doc.text(tipText, 22, y);
    y += tipText.length * 4.5 + 3;
  }

  // Footer Disclaimer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Disclaimer: This analysis report is an algorithmic estimation based on keyword extraction and placement heuristics. Not an official ATS score.',
    16,
    288
  );

  // Save the PDF
  const safeName = analysis.candidateInfo.name.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Resume_Analysis_${safeName || 'Report'}.pdf`);
}
