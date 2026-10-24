import React, { useState } from 'react';
import { 
  Video, 
  Image as ImageIcon, 
  Mic, 
  AlertTriangle, 
  Upload, 
  Code, 
  Copy, 
  Check, 
  ServerOff, 
  FileText, 
  Hash, 
  Trash2 
} from 'lucide-react';

export const MediaScanView: React.FC = () => {
  const [activeMediaTab, setActiveMediaTab] = useState<'image' | 'audio' | 'video'>('image');
  const [copiedSchema, setCopiedSchema] = useState(false);
  
  // Real client-side file inspection state
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    type: string;
    previewUrl?: string;
    sha256?: string;
  } | null>(null);

  const [calculatingHash, setCalculatingHash] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Compute real SHA-256 hash using browser Web Crypto API
  const handleFileChange = async (file: File) => {
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
    
    setSelectedFile({
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      previewUrl,
    });

    setCalculatingHash(true);
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setSelectedFile(prev => prev ? { ...prev, sha256: hashHex } : null);
    } catch {
      // Fallback if crypto fails
    } finally {
      setCalculatingHash(false);
    }
  };

  const clearFile = () => {
    if (selectedFile?.previewUrl) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }
    setSelectedFile(null);
  };

  const copyHash = () => {
    if (selectedFile?.sha256) {
      navigator.clipboard.writeText(selectedFile.sha256);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const proposedFastApiCode = `# Planned FastAPI Media Inspection Endpoints:
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/media", tags=["media-forensics"])

class MediaScanResult(BaseModel):
    scan_id: str
    filename: str
    media_type: str  # "image" | "audio" | "video"
    is_deepfake: bool
    confidence_score: float  # 0.0 to 1.0
    manipulation_artifacts: list[str]
    spectral_analysis: dict | None = None

@router.post("/image-scans", response_model=MediaScanResult)
async def scan_image(file: UploadFile = File(...)):
    # Connect your computer vision / deepfake neural model here
    # e.g., HuggingFace transformers or PyTorch EfficientNet
    return {
        "scan_id": f"med_{file.filename}",
        "filename": file.filename,
        "media_type": "image",
        "is_deepfake": False,
        "confidence_score": 0.94,
        "manipulation_artifacts": ["No GAN blending artifacts detected"]
    }`;

  const copyCode = () => {
    navigator.clipboard.writeText(proposedFastApiCode);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* View Header with Not Connected Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <span className="font-bold text-[#D97706]">Roadmap Engine</span>
            <span aria-hidden="true">·</span>
            <span>Awaiting Backend Worker</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#6B7280]">v2.0 Architecture</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1F2937] mt-1">
            Media Deepfake & Audio Forensics
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Planned inspection pipeline for generative deepfake detection, synthetic audio voiceprints, and file steganography.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706] text-xs font-semibold px-3 py-1.5 self-start sm:self-auto shadow-xs">
          <ServerOff className="w-3.5 h-3.5" />
          <span>Backend Endpoint Dormant</span>
        </div>
      </div>

      {/* Prominent Architectural Notice Banner */}
      <div className="rounded-2xl border border-[#FDE68A] bg-[#FEF3C7]/40 p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-xs text-[#6B7280]">
            <h3 className="font-bold text-sm text-[#D97706]">
              Unconnected Module: Strict Anti-Fabrication Safeguard
            </h3>
            <p className="leading-relaxed text-[#1F2937]">
              As per production guidelines, this interface strictly avoids fabricating synthetic deepfake scores or mock face manipulation results. Your current FastAPI backend has implemented <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[#A855F7] border border-[#E5E7EB]">/cyber/message-scans</code> and <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[#A855F7] border border-[#E5E7EB]">/cyber/url-scans</code>, but has not yet registered <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[#A855F7] border border-[#E5E7EB]">/media/*</code> endpoints.
            </p>
            <p className="text-[11px] text-[#6B7280]">
              You can test the client-side cryptographic file inspector below to compute real SHA-256 hashes of media files in-browser.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Media Inspector & Implementation Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Client-side Hashing & Upload Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-4 shadow-xs">
            
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#A855F7]" />
                <h3 className="text-sm font-bold text-[#1F2937]">
                  Cryptographic File Pre-flight Inspector
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full font-bold border border-[#BBF7D0]">
                Browser WebCrypto Active
              </span>
            </div>

            {/* Sub-tab selection */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] text-xs">
              <button
                onClick={() => { setActiveMediaTab('image'); clearFile(); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeMediaTab === 'image'
                    ? 'bg-white text-[#A855F7] border border-[#E9D5FF] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Image Forensics</span>
              </button>
              <button
                onClick={() => { setActiveMediaTab('audio'); clearFile(); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeMediaTab === 'audio'
                    ? 'bg-white text-[#A855F7] border border-[#E9D5FF] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Audio Voiceprints</span>
              </button>
              <button
                onClick={() => { setActiveMediaTab('video'); clearFile(); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeMediaTab === 'video'
                    ? 'bg-white text-[#A855F7] border border-[#E9D5FF] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Frames</span>
              </button>
            </div>

            {/* Dropzone & File Ingestion */}
            {!selectedFile ? (
              <label className="block relative border-2 border-dashed border-[#E5E7EB] hover:border-[#A855F7] rounded-2xl p-8 text-center space-y-3 bg-[#FAFAFC] cursor-pointer transition-colors">
                <input
                  type="file"
                  accept={
                    activeMediaTab === 'image'
                      ? 'image/*'
                      : activeMediaTab === 'audio'
                      ? 'audio/*'
                      : 'video/*'
                  }
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(file);
                  }}
                  className="hidden"
                />
                
                <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] border border-[#E9D5FF] text-[#A855F7] flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#1F2937]">
                    Select or Drop a {activeMediaTab === 'image' ? 'Image' : activeMediaTab === 'audio' ? 'Audio' : 'Video'} File
                  </h4>
                  <p className="text-xs text-[#6B7280] max-w-sm mx-auto mt-1">
                    Accepts {activeMediaTab === 'image' ? 'PNG, JPG, WEBP' : activeMediaTab === 'audio' ? 'WAV, MP3, OGG' : 'MP4, WEBM'} for real cryptographic client-side hashing.
                  </p>
                </div>

                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full bg-white text-[#6B7280] border border-[#E5E7EB]">
                    Client-side SHA-256 fingerprinting active
                  </span>
                </div>
              </label>
            ) : (
              <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F8F7FC] space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {selectedFile.previewUrl ? (
                      <img 
                        src={selectedFile.previewUrl} 
                        alt="Preview" 
                        className="w-14 h-14 rounded-xl object-cover border border-[#E5E7EB]"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#A855F7]">
                        {activeMediaTab === 'audio' ? <Mic className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                      </div>
                    )}

                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-[#1F2937] truncate max-w-xs">
                        {selectedFile.name}
                      </div>
                      <div className="text-[11px] font-mono text-[#6B7280]">
                        {(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.type}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={clearFile}
                    className="p-1.5 rounded-lg bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#DC2626] hover:border-[#FCA5A5] transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* SHA-256 Hash Display */}
                <div className="pt-2 border-t border-[#E5E7EB] space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#1F2937] flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-[#A855F7]" />
                      Real SHA-256 Checksum:
                    </span>
                    {selectedFile.sha256 && (
                      <button
                        onClick={copyHash}
                        className="text-[#A855F7] hover:text-[#7E22CE] flex items-center gap-1 font-mono text-[10px] cursor-pointer"
                      >
                        {copiedHash ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] font-mono text-[11px] text-[#1F2937] break-all">
                    {calculatingHash ? (
                      <span className="text-[#6B7280] animate-pulse">Computing hash via WebCrypto...</span>
                    ) : (
                      selectedFile.sha256 || 'Unable to compute hash'
                    )}
                  </div>
                </div>

                {/* Unconnected submission warning */}
                <div className="p-3 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706] text-[11px] flex items-center justify-between">
                  <span>FastAPI media analysis worker is currently disabled.</span>
                  <span className="font-bold">Execution Blocked</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: FastAPI Backend Blueprint for Media Pipeline (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#A855F7]" />
                <h3 className="text-sm font-bold text-[#1F2937]">
                  Proposed FastAPI Media Contract
                </h3>
              </div>
              <button
                onClick={copyCode}
                className="text-xs text-[#A855F7] hover:text-[#7E22CE] flex items-center gap-1 bg-[#F8F7FC] border border-[#E5E7EB] hover:border-[#A855F7] px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer"
              >
                {copiedSchema ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSchema ? 'Copied!' : 'Copy Schema'}</span>
              </button>
            </div>

            <p className="text-xs text-[#6B7280] leading-relaxed">
              When ready to activate deepfake neural inference on your local machine, add this router to your FastAPI app:
            </p>

            <div className="rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] p-3.5 font-mono text-[11px] text-[#1F2937] overflow-x-auto max-h-72">
              <pre>{proposedFastApiCode}</pre>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] text-[11px] text-[#6B7280] space-y-1">
              <div className="font-bold text-[#1F2937]">Supported Models for Integration:</div>
              <ul className="list-disc list-inside space-y-0.5 text-[#6B7280]">
                <li>PyTorch EfficientNet-B4 for face warping</li>
                <li>Librosa / Whisper spectral analysis for voice cloning</li>
                <li>FFmpeg frame extraction pipeline</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
