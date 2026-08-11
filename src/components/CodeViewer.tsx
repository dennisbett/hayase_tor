import React, { useState } from 'react';
import { Copy, Check, FileJson, FileCode } from 'lucide-react';

interface CodeViewerProps {
  manifestCode: string;
  scriptCode: string;
  testCode: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ manifestCode, scriptCode, testCode }) => {
  const [selectedFile, setSelectedFile] = useState<'manifest' | 'script' | 'test'>('script');
  const [copied, setCopied] = useState(false);

  const getActiveCode = () => {
    if (selectedFile === 'manifest') return manifestCode;
    if (selectedFile === 'test') return testCode;
    return scriptCode;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-mono">
      
      {/* File Selector Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#141414] p-4 rounded-sm border border-[#222]">
        
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          
          <button
            onClick={() => setSelectedFile('script')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-mono uppercase font-bold transition-all ${
              selectedFile === 'script'
                ? 'bg-[#C0FF00] text-black border border-[#C0FF00]'
                : 'bg-[#0A0A0A] text-[#E0E0E0]/60 hover:text-white border border-[#222]'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>hayase/1337x.js</span>
          </button>

          <button
            onClick={() => setSelectedFile('manifest')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-mono uppercase font-bold transition-all ${
              selectedFile === 'manifest'
                ? 'bg-[#C0FF00] text-black border border-[#C0FF00]'
                : 'bg-[#0A0A0A] text-[#E0E0E0]/60 hover:text-white border border-[#222]'
            }`}
          >
            <FileJson className="w-4 h-4" />
            <span>hayase/index.json</span>
          </button>

          <button
            onClick={() => setSelectedFile('test')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-mono uppercase font-bold transition-all ${
              selectedFile === 'test'
                ? 'bg-[#C0FF00] text-black border border-[#C0FF00]'
                : 'bg-[#0A0A0A] text-[#E0E0E0]/60 hover:text-white border border-[#222]'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>test.js</span>
          </button>

        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-sm bg-[#1A1A1A] hover:bg-[#222] text-xs font-bold uppercase tracking-wider text-[#E0E0E0] border border-[#333] transition-colors shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#C0FF00]" />
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#888888]" />
              <span>COPY SOURCE</span>
            </>
          )}
        </button>

      </div>

      {/* Code Editor Preview Window */}
      <div className="bg-[#0A0A0A] border border-[#222] rounded-sm overflow-hidden shadow-2xl font-mono text-xs">
        
        {/* Window Header */}
        <div className="bg-[#141414] px-4 py-3 border-b border-[#222] flex items-center justify-between text-[#E0E0E0]/60 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#C0FF00]" />
            <div className="w-2.5 h-2.5 bg-amber-400" />
            <div className="w-2.5 h-2.5 bg-[#444]" />
            <span className="ml-2 font-bold text-white uppercase text-[11px] tracking-wider">
              {selectedFile === 'manifest' ? 'hayase/index.json' : selectedFile === 'test' ? 'test.js' : 'hayase/1337x.js'}
            </span>
          </div>
          <span className="text-[10px] text-[#888888] font-bold">
            {getActiveCode().split('\n').length} LINES
          </span>
        </div>

        {/* Code Content Container */}
        <div className="p-4 overflow-x-auto max-h-[600px] text-[#E0E0E0] leading-relaxed select-all whitespace-pre font-mono">
          {getActiveCode()}
        </div>

      </div>

    </div>
  );
};
