import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { SAMPLE_RESUMES } from '../data/sampleData';
import { parseResumeFile } from '../utils/parser';

interface ResumeUploaderProps {
  resumeText: string;
  onResumeTextChange: (text: string) => void;
  fileName: string;
  onFileNameChange: (name: string) => void;
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
  errorMessage: string | null;
  onErrorMessageChange: (msg: string | null) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  resumeText,
  onResumeTextChange,
  fileName,
  onFileNameChange,
  isLoading,
  onLoadingChange,
  errorMessage,
  onErrorMessageChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isManualExpanded, setIsManualExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    onErrorMessageChange(null);
    onLoadingChange(true);

    try {
      const extracted = await parseResumeFile(file);
      onResumeTextChange(extracted);
      onFileNameChange(file.name);
    } catch (err: any) {
      onErrorMessageChange(err.message || 'Failed to parse resume file.');
    } finally {
      onLoadingChange(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_RESUMES.find(s => s.id === sampleId);
    if (sample) {
      onResumeTextChange(sample.text);
      onFileNameChange(`${sample.label.split('—')[0].trim()}_Resume.txt`);
      onErrorMessageChange(null);
    }
  };

  const clearResume = () => {
    onResumeTextChange('');
    onFileNameChange('');
    onErrorMessageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="font-bold text-slate-900 text-base">Candidate Resume</h2>
          </div>
          {resumeText && (
            <button
              onClick={clearResume}
              className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Upload PDF or DOCX file. Analyzed in-memory; never stored on external servers.
        </p>

        {/* Drag and Drop Zone */}
        {!resumeText ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-12 h-12 rounded-full bg-blue-100/70 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>

            <p className="text-sm font-semibold text-slate-800">
              {isLoading ? 'Extracting text...' : 'Click to upload or drag & drop'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports PDF and DOCX (Max 16MB)
            </p>
          </div>
        ) : (
          /* Uploaded File Pill Card */
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {fileName || 'Extracted Resume'}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Text Extracted
                  </span>
                  <span>·</span>
                  <span>{resumeText.split(/\s+/).length} words</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors shrink-0 ml-2"
            >
              Replace
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Parse Error: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Quick Sample Resumes */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-600 mb-2">
            Or test instantly with preloaded candidate profiles:
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_RESUMES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample.id)}
                className="text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 hover:border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors text-left"
              >
                {sample.label.split('—')[0].trim()}
                <span className="text-[10px] text-slate-400 block font-normal">
                  {sample.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Text Editor Dropdown */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setIsManualExpanded(!isManualExpanded)}
          className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 py-1"
        >
          <span className="font-medium">
            {isManualExpanded ? 'Hide raw extracted text' : 'View / Edit extracted text manually'}
          </span>
          {isManualExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {isManualExpanded && (
          <div className="mt-2">
            <textarea
              value={resumeText}
              onChange={(e) => {
                onResumeTextChange(e.target.value);
                if (!fileName) onFileNameChange('Manual_Input_Resume.txt');
              }}
              rows={6}
              placeholder="Paste raw resume text here if preferred..."
              className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white resize-y"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Changes made here are reflected immediately in the matching score.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
