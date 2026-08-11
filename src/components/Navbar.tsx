import React from 'react';
import { HardDrive, Terminal, Code2, Download, Search } from 'lucide-react';

interface NavbarProps {
  activeTab: 'search' | 'guide' | 'code' | 'test';
  setActiveTab: (tab: 'search' | 'guide' | 'code' | 'test') => void;
  version: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, version }) => {
  return (
    <header className="bg-[#0F0F0F] border-b border-[#222] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-5 gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-baseline space-x-3">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-[#C0FF00] italic uppercase font-sans">
              HAYASE
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E0E0E0]/40 font-bold border-l border-[#222] pl-3">
              1337x Provider Extension v{version}
            </span>
          </div>

          {/* Navigation Tabs - Artistic Flair uppercase monospace style */}
          <nav className="flex items-center space-x-4 sm:space-x-6 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-mono font-semibold">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-1.5 py-1 transition-all ${
                activeTab === 'search'
                  ? 'text-[#C0FF00] border-b-2 border-[#C0FF00] font-bold'
                  : 'text-[#E0E0E0]/50 hover:text-[#E0E0E0]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 py-1 transition-all ${
                activeTab === 'guide'
                  ? 'text-[#C0FF00] border-b-2 border-[#C0FF00] font-bold'
                  : 'text-[#E0E0E0]/50 hover:text-[#E0E0E0]'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Deploy</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 py-1 transition-all ${
                activeTab === 'code'
                  ? 'text-[#C0FF00] border-b-2 border-[#C0FF00] font-bold'
                  : 'text-[#E0E0E0]/50 hover:text-[#E0E0E0]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Source</span>
            </button>

            <button
              onClick={() => setActiveTab('test')}
              className={`flex items-center gap-1.5 py-1 transition-all ${
                activeTab === 'test'
                  ? 'text-[#C0FF00] border-b-2 border-[#C0FF00] font-bold'
                  : 'text-[#E0E0E0]/50 hover:text-[#E0E0E0]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Validator</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
