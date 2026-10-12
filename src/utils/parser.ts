import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
// Use Vite's asset URL import for the bundled pdf.js worker
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { CandidateInfo } from '../types';

// Configure pdfjs worker to use the local bundled asset
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

/**
 * Fallback PDF text extractor that parses text streams directly from PDF ArrayBuffer
 * when Web Workers are blocked by sandbox/iframe constraints.
 */
function extractTextFromPdfBufferFallback(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binaryString = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binaryString += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }

  // Extract text within BT ... ET blocks and Tj/TJ operators
  const textChunks: string[] = [];
  const textBlockRegex = /BT[\s\S]*?ET/g;
  let match: RegExpExecArray | null;

  while ((match = textBlockRegex.exec(binaryString)) !== null) {
    const block = match[0];
    // Match string literals (text)Tj or [(t)(e)(x)(t)]TJ
    const tjRegex = /\(([^)]*)\)\s*(?:Tj|'|")/g;
    let tjMatch: RegExpExecArray | null;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      if (tjMatch[1]) {
        textChunks.push(tjMatch[1]);
      }
    }

    const tjArrayRegex = /\[(.*?)\]\s*TJ/g;
    let tjArrMatch: RegExpExecArray | null;
    while ((tjArrMatch = tjArrayRegex.exec(block)) !== null) {
      const inner = tjArrMatch[1];
      const innerStrings = inner.match(/\(([^)]*)\)/g);
      if (innerStrings) {
        textChunks.push(innerStrings.map(s => s.slice(1, -1)).join(''));
      }
    }
  }

  return textChunks.join(' ').replace(/\\([()\\])/g, '$1');
}

/**
 * Extracts raw text from uploaded File object (PDF, DOCX, TXT)
 */
export async function parseResumeFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (file.size > 16 * 1024 * 1024) {
    throw new Error('File size exceeds the 16MB limit. Please upload a smaller document.');
  }

  if (extension === 'txt') {
    return await file.text();
  }

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('Could not extract text from DOCX file. It might be password-protected or empty.');
    }
    return result.value;
  }

  if (extension === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        useWorkerFetch: false,
        useSystemFonts: true
      });
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageItems = textContent.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');
        fullText += pageItems + '\n';
      }

      if (fullText && fullText.trim().length >= 20) {
        return fullText;
      }
    } catch (pdfErr: any) {
      console.warn('pdfjs worker extraction error, attempting buffer fallback:', pdfErr);
    }

    // Attempt resilient fallback parser
    const fallbackText = extractTextFromPdfBufferFallback(arrayBuffer);
    if (fallbackText && fallbackText.trim().length >= 20) {
      return fallbackText;
    }

    throw new Error('Could not extract readable text from PDF. The document may be a scanned image without OCR.');
  }

  throw new Error(`Unsupported file type: .${extension}. Please upload a .pdf, .docx, or .txt file.`);
}

/**
 * Extracts contact information, social links, and degree keywords from resume text.
 */
export function extractCandidateInfo(text: string): CandidateInfo {
  // Email regex
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);

  // Phone regex
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);

  // GitHub & LinkedIn
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i;
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i;
  const githubMatch = text.match(githubRegex);
  const linkedinMatch = text.match(linkedinRegex);

  // Education / Degrees
  const degrees = [
    'B.Tech', 'Bachelor of Technology', 'B.E.', 'Bachelor of Engineering',
    'M.Tech', 'Master of Technology', 'MCA', 'BCA', 'Computer Science',
    'Information Technology', 'B.Sc'
  ];
  const detectedEducation: string[] = [];
  const textLower = text.toLowerCase();

  for (const degree of degrees) {
    if (textLower.includes(degree.toLowerCase())) {
      detectedEducation.push(degree);
    }
  }

  // Name inference: first non-empty line that isn't an email/link
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let name = 'Candidate';
  for (const line of lines.slice(0, 5)) {
    if (
      line.length > 2 &&
      line.length < 35 &&
      !line.includes('@') &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('curriculum') &&
      !line.toLowerCase().includes('http')
    ) {
      name = line;
      break;
    }
  }

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return {
    name,
    email: emailMatch ? emailMatch[0] : 'Not detected',
    phone: phoneMatch ? phoneMatch[0] : 'Not detected',
    github: githubMatch ? githubMatch[0] : null,
    linkedin: linkedinMatch ? linkedinMatch[0] : null,
    education: Array.from(new Set(detectedEducation)),
    wordCount
  };
}
