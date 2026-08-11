import React, { useState } from 'react';
import { Copy, Check, Download, Settings, CheckCircle2 } from 'lucide-react';

interface InstallGuideProps {
  appUrl: string;
}

export const InstallGuide: React.FC<InstallGuideProps> = ({ appUrl }) => {
  const [copiedIndex, setCopiedIndex] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const rawGithubPattern = "https://raw.githubusercontent.com/<YOUR_GITHUB_USER>/<YOUR_REPO>/main/hayase/index.json";
  const liveManifestUrl = `${appUrl.replace(/\/$/, '')}/api/hayase/manifest`;

  const copyToClipboard = (text: string, type: 'index' | 'script') => {
    navigator.clipboard.writeText(text);
    if (type === 'index') {
      setCopiedIndex(true);
      setTimeout(() => setCopiedIndex(false), 2500);
    } else {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-mono">
      
      {/* Header Banner */}
      <div className="bg-[#141414] border border-[#222] rounded-sm p-6 shadow-2xl relative overflow-hidden border-l-2 border-l-[#C0FF00]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-[#0A0A0A] border border-[#333] flex items-center justify-center text-[#C0FF00]">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#C0FF00]">
              Deployment Guide
            </span>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">How to Install in Hayase / Shiru</h2>
            <p className="text-xs text-[#E0E0E0]/60">Import the 1337x provider extension into Hayase settings</p>
          </div>
        </div>
      </div>

      {/* Primary Installation Step Box */}
      <div className="bg-[#141414] border border-[#222] rounded-sm p-6 space-y-6">
        
        <div className="flex items-center justify-between border-b border-[#222] pb-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-sm bg-[#C0FF00] text-black font-black text-xs flex items-center justify-center">1</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Copy Extension Repository URL</h3>
          </div>
          <span className="text-[10px] font-mono uppercase bg-[#1A1A1A] text-[#C0FF00] px-2.5 py-1 rounded-sm border border-[#333] font-bold">
            index.json
          </span>
        </div>

        <p className="text-xs text-[#E0E0E0]/80 leading-relaxed font-sans">
          Hayase loads extensions from a repository manifest file (<code className="text-[#C0FF00] font-mono">index.json</code>). You can use either your hosted GitHub raw URL or this Studio's live URL:
        </p>

        {/* GitHub Raw Pattern Box */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#C0FF00] uppercase tracking-widest">
            Option A: GitHub Raw URL (For Deployed Repositories)
          </label>
          <div className="flex items-center justify-between gap-2 bg-[#0A0A0A] p-3 rounded-sm border border-[#333] font-mono text-xs text-[#E0E0E0]">
            <span className="truncate select-all text-amber-300">{rawGithubPattern}</span>
            <button
              onClick={() => copyToClipboard(rawGithubPattern, 'index')}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#C0FF00] text-black font-black uppercase text-[10px] tracking-wider hover:bg-white transition-colors"
            >
              {copiedIndex ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex ? 'COPIED!' : 'COPY URL'}</span>
            </button>
          </div>
        </div>

        {/* Studio Live Mirror Box */}
        <div className="space-y-2 pt-2">
          <label className="text-[10px] font-bold text-[#C0FF00] uppercase tracking-widest">
            Option B: Live AI Studio Sandbox URL
          </label>
          <div className="flex items-center justify-between gap-2 bg-[#0A0A0A] p-3 rounded-sm border border-[#333] font-mono text-xs text-[#E0E0E0]">
            <span className="truncate select-all text-[#C0FF00]">{liveManifestUrl}</span>
            <button
              onClick={() => copyToClipboard(liveManifestUrl, 'index')}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#1A1A1A] hover:bg-[#222] text-[#E0E0E0] border border-[#333] text-[10px] uppercase font-bold tracking-wider transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Live Link</span>
            </button>
          </div>
        </div>

      </div>

      {/* Visual Step by Step Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Step 1 */}
        <div className="bg-[#141414] border border-[#222] rounded-sm p-5 space-y-3 relative border-t-2 border-t-[#C0FF00]">
          <div className="w-7 h-7 rounded-sm bg-[#0A0A0A] border border-[#333] flex items-center justify-center font-black text-[#C0FF00] text-xs">
            2
          </div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider">Open Hayase Settings</h4>
          <p className="text-xs text-[#E0E0E0]/60 leading-relaxed font-sans">
            Launch Hayase or Shiru on your device. Click on the gear icon (<Settings className="w-3.5 h-3.5 inline text-[#C0FF00]" />) to enter <b>Settings</b>.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-[#141414] border border-[#222] rounded-sm p-5 space-y-3 relative border-t-2 border-t-[#C0FF00]">
          <div className="w-7 h-7 rounded-sm bg-[#0A0A0A] border border-[#333] flex items-center justify-center font-black text-[#C0FF00] text-xs">
            3
          </div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider">Navigate to Extensions</h4>
          <p className="text-xs text-[#E0E0E0]/60 leading-relaxed font-sans">
            Select <b>Extensions</b> or <b>Scraper Providers</b> from the menu, then click <b>Add Repository</b>.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-[#141414] border border-[#222] rounded-sm p-5 space-y-3 relative border-t-2 border-t-[#C0FF00]">
          <div className="w-7 h-7 rounded-sm bg-[#0A0A0A] border border-[#333] flex items-center justify-center font-black text-[#C0FF00] text-xs">
            4
          </div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider">Paste & Enable 1337x</h4>
          <p className="text-xs text-[#E0E0E0]/60 leading-relaxed font-sans">
            Paste the copied <code className="text-[#C0FF00]">index.json</code> URL into the input field and hit <b>Install</b>. Toggle 1337x ON.
          </p>
        </div>

      </div>

      {/* Verification Checklist */}
      <div className="bg-[#141414] border border-[#222] rounded-sm p-6 space-y-4">
        <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#C0FF00]" />
          Extension Compliance & Architecture Checklist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#E0E0E0]/80">
          <div className="bg-[#0A0A0A] p-3 rounded-sm border border-[#222] flex items-center gap-2.5">
            <div className="w-2 h-2 bg-[#C0FF00]" />
            <span>Repository Manifest format matches Hayase standard</span>
          </div>
          <div className="bg-[#0A0A0A] p-3 rounded-sm border border-[#222] flex items-center gap-2.5">
            <div className="w-2 h-2 bg-[#C0FF00]" />
            <span>Exports metadata, search(), and resolveMagnet()</span>
          </div>
          <div className="bg-[#0A0A0A] p-3 rounded-sm border border-[#222] flex items-center gap-2.5">
            <div className="w-2 h-2 bg-[#C0FF00]" />
            <span>Dual DOMParser & Regex HTML parsing engine</span>
          </div>
          <div className="bg-[#0A0A0A] p-3 rounded-sm border border-[#222] flex items-center gap-2.5">
            <div className="w-2 h-2 bg-[#C0FF00]" />
            <span>7 pre-configured 1337x mirror fallback domains</span>
          </div>
        </div>
      </div>

    </div>
  );
};
