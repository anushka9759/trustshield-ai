import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck
} from 'lucide-react';

interface ExportGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportGuideModal: React.FC<ExportGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCommand = (cmd: string, stepIndex: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      title: 'Step 1: Start your FastAPI Server on Windows',
      desc: 'Open PowerShell or Command Prompt in your Python project directory and launch FastAPI on port 8000:',
      command: 'uvicorn main:app --reload --host 127.0.0.1 --port 8000',
      note: 'Ensure your app exposes GET /health, POST /cyber/message-scans, POST /cyber/url-scans, GET /scans, and POST /auth/login & /auth/register.',
    },
    {
      title: 'Step 2: Export or Download Frontend Files',
      desc: 'Download this project folder to your Windows system (e.g. C:\\Projects\\trustshield-frontend).',
      command: 'cd C:\\Projects\\trustshield-frontend',
      note: 'Confirm package.json and vite.config.ts are in the root directory.',
    },
    {
      title: 'Step 3: Install Node Dependencies',
      desc: 'Run npm install to restore React 19, Tailwind CSS v4, Lucide icons, and dependencies:',
      command: 'npm install',
      note: 'Requires Node.js 18+ installed on your Windows machine.',
    },
    {
      title: 'Step 4: Launch Dev Server on Port 3000',
      desc: 'Start the Vite development server:',
      command: 'npm run dev',
      note: 'Vite automatically proxies /api/v1 to http://127.0.0.1:8000 to eliminate browser CORS hurdles!',
    },
    {
      title: 'Step 5: Open TrustShield AI in Browser',
      desc: 'Open Google Chrome, Edge, or Firefox at:',
      command: 'http://localhost:3000',
      note: 'The dashboard will immediately detect your FastAPI backend online with a green indicator!',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none font-sans">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F3E8FF] border border-[#E9D5FF] text-[#A855F7]">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">
                Windows Local Execution & Export Guide
              </h3>
              <p className="text-xs text-[#6B7280]">Run TrustShield AI alongside your local FastAPI backend</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#F8F7FC] border border-[#E5E7EB] hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#1F2937] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-[#1F2937]">
          
          <div className="p-4 rounded-xl bg-[#F3E8FF] border border-[#E9D5FF] text-[#1F2937]">
            <div className="flex items-center gap-2 font-bold mb-1 text-[#A855F7]">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>Full Local Windows Compatibility Confirmed</span>
            </div>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              TrustShield AI has been built specifically so that when you export it to your Windows workstation, it runs seamlessly side-by-side with your FastAPI backend. Vite&apos;s internal proxy (<code className="bg-white px-1.5 py-0.5 rounded font-mono text-[#A855F7] border border-[#E9D5FF]">vite.config.ts</code>) is preconfigured to route <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[#A855F7] border border-[#E9D5FF]">/api/v1</code> directly to <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[#A855F7] border border-[#E9D5FF]">http://127.0.0.1:8000</code>.
            </p>
          </div>

          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1F2937] text-xs">
                    {step.title}
                  </span>
                  <span className="text-[10px] text-[#6B7280] uppercase font-bold">
                    Step {idx + 1} of 5
                  </span>
                </div>
                
                <p className="text-[11px] text-[#6B7280]">
                  {step.desc}
                </p>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#E5E7EB] font-mono shadow-xs">
                  <code className="text-[#A855F7] text-xs truncate select-all font-semibold">
                    {step.command}
                  </code>
                  <button
                    onClick={() => copyCommand(step.command, idx)}
                    className="ml-2 text-[#6B7280] hover:text-[#1F2937] p-1 shrink-0 transition-colors cursor-pointer"
                    title="Copy command"
                  >
                    {copiedStep === idx ? (
                      <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-[#6B7280] italic">
                  💡 {step.note}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#7E22CE] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
