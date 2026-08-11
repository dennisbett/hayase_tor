import React, { useState, useEffect } from 'react';
import { Search, Globe, Filter, Sparkles, Loader2, AlertCircle, RefreshCw, Layers, ArrowUpDown } from 'lucide-react';
import { TorrentCard, TorrentItem } from './TorrentCard';

interface SearchPlaygroundProps {
  defaultMirror: string;
  mirrors: string[];
}

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'anime', label: 'Anime' },
  { id: 'movie', label: 'Movies' },
  { id: 'show', label: 'TV Shows' },
  { id: 'games', label: 'Games' },
  { id: 'music', label: 'Music' },
  { id: 'apps', label: 'Apps / Software' },
  { id: 'other', label: 'Other' },
];

export const SearchPlayground: React.FC<SearchPlaygroundProps> = ({ defaultMirror, mirrors }) => {
  const [query, setQuery] = useState('Cyberpunk');
  const [category, setCategory] = useState('all');
  const [selectedMirror, setSelectedMirror] = useState(defaultMirror || 'https://1337x.to');
  const [forceMock, setForceMock] = useState(false);
  const [sortBy, setSortBy] = useState<'seeders' | 'size' | 'title'>('seeders');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TorrentItem[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [searchSource, setSearchSource] = useState<'live' | 'mock' | null>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setNotice(null);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          category: category === 'all' ? undefined : category,
          mirror: selectedMirror,
          forceMock
        })
      });

      const data = await response.json();
      setResults(data.results || []);
      setSearchSource(data.source);
      if (data.notice) {
        setNotice(data.notice);
      }
    } catch (err: any) {
      setNotice('Network error calling search API. Switching to mock preview mode.');
      setForceMock(true);
    } finally {
      setLoading(false);
      setExecutionTimeMs(Date.now() - startTime);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [forceMock, selectedMirror, category]);

  // Sorting
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'seeders') {
      return b.seeders - a.seeders;
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Control Panel - Artistic Flair Dark Block */}
      <div className="bg-[#141414] border border-[#222] p-6 rounded-sm shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#C0FF00]">
                Live Environment Playground
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight italic flex items-center gap-2">
              1337x Provider Extension
            </h1>
            <p className="text-xs text-[#E0E0E0]/60 mt-1 font-mono">
              Test scraper execution, domain mirror switching, and detail page magnet resolution.
            </p>
          </div>

          {/* Mock Mode & Mirror Controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Mirror Domain Selector */}
            <div className="flex items-center gap-2 bg-[#0A0A0A] border border-[#333] px-3 py-2 text-xs font-mono rounded-sm">
              <Globe className="w-3.5 h-3.5 text-[#C0FF00] shrink-0" />
              <span className="text-[#E0E0E0]/50 hidden sm:inline uppercase text-[10px] tracking-wider font-bold">Mirror:</span>
              <select
                value={selectedMirror}
                onChange={(e) => setSelectedMirror(e.target.value)}
                className="bg-transparent text-[#E0E0E0] font-bold outline-none cursor-pointer font-mono"
              >
                {mirrors.map((m) => (
                  <option key={m} value={m} className="bg-[#141414] text-[#E0E0E0]">
                    {m.replace('https://', '')}
                  </option>
                ))}
              </select>
            </div>

            {/* Mock Mode Toggle */}
            <button
              onClick={() => setForceMock(!forceMock)}
              className={`flex items-center gap-2 px-3 py-2 border text-xs font-mono uppercase font-bold tracking-wider rounded-sm transition-all ${
                forceMock
                  ? 'bg-[#C0FF00]/15 border-[#C0FF00] text-[#C0FF00]'
                  : 'bg-[#0A0A0A] border-[#222] text-[#E0E0E0]/60 hover:text-white hover:border-[#444]'
              }`}
              title="Toggle mock response mode for offline or Cloudflare bypass testing"
            >
              <div className={`w-2 h-2 ${forceMock ? 'bg-[#C0FF00] animate-pulse' : 'bg-slate-600'}`} />
              <span>Mock Mode: {forceMock ? 'ON' : 'OFF'}</span>
            </button>

          </div>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search torrents (e.g. Frieren, Cyberpunk, Elden Ring, Linux, Oppenheimer)..."
              className="w-full bg-[#0A0A0A] text-white placeholder-[#888888] text-sm font-mono rounded-sm pl-11 pr-32 py-3.5 border border-[#333] focus:border-[#C0FF00] outline-none transition-all"
            />
            <Search className="w-5 h-5 text-[#888888] absolute left-3.5 top-4" />
            
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-[#C0FF00] hover:bg-white text-black font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2 disabled:opacity-50 font-mono rounded-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>SEARCH</span>
            </button>
          </div>

          {/* Category Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 uppercase font-bold text-[11px] tracking-wider whitespace-nowrap transition-all rounded-sm ${
                  category === cat.id
                    ? 'bg-[#C0FF00] text-black border border-[#C0FF00]'
                    : 'bg-[#0A0A0A] text-[#E0E0E0]/60 hover:text-white hover:bg-[#1A1A1A] border border-[#222]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </form>

      </div>

      {/* Notice Banner if any */}
      {notice && (
        <div className="bg-[#1A1A1A] border-l-2 border-[#C0FF00] p-4 text-xs font-mono flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-[#C0FF00] mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-white">{notice}</p>
            <p className="text-[#E0E0E0]/60 mt-1">
              Tip: You can enable "Mock Mode" above to test extension search and UI magnet parsing with offline data.
            </p>
          </div>
        </div>
      )}

      {/* Results Header & Sort Controls */}
      <div className="flex items-center justify-between border-b border-[#222] pb-3 font-mono">
        <div className="flex items-center gap-2 text-xs text-[#E0E0E0]/80 font-bold uppercase tracking-wider">
          <Layers className="w-4 h-4 text-[#C0FF00]" />
          <span>Results:</span>
          <span className="text-[#C0FF00] bg-[#141414] px-2 py-0.5 border border-[#333]">
            {sortedResults.length} items
          </span>
          {executionTimeMs !== null && (
            <span className="text-[10px] text-[#E0E0E0]/40 hidden sm:inline">
              ({executionTimeMs}ms • source: {searchSource})
            </span>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs text-[#E0E0E0]/60 uppercase tracking-wider">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#C0FF00]" />
          <span className="hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-[#141414] border border-[#333] text-[#E0E0E0] text-xs font-mono px-2 py-1 outline-none cursor-pointer rounded-sm"
          >
            <option value="seeders">Seeders (High to Low)</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Torrent Results List */}
      {loading ? (
        <div className="py-16 text-center space-y-3 bg-[#141414] border border-[#222] rounded-sm font-mono">
          <Loader2 className="w-8 h-8 text-[#C0FF00] animate-spin mx-auto" />
          <p className="text-sm text-[#E0E0E0] font-bold uppercase tracking-widest">Scraping 1337x Mirror...</p>
          <p className="text-xs text-[#E0E0E0]/40">{selectedMirror}/sort-search/{encodeURIComponent(query)}/seeders/desc/1/</p>
        </div>
      ) : sortedResults.length > 0 ? (
        <div className="space-y-3">
          {sortedResults.map((item) => (
            <TorrentCard key={item.id} item={item} mirror={selectedMirror} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 bg-[#141414] border border-[#222] rounded-sm font-mono">
          <div className="w-12 h-12 rounded-sm bg-[#1A1A1A] border border-[#333] flex items-center justify-center mx-auto text-[#C0FF00]">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">No torrents found for "{query}"</h3>
            <p className="text-xs text-[#E0E0E0]/50 mt-1 max-w-md mx-auto">
              Try adjusting your query or category, choosing a different mirror, or enabling Mock Mode above.
            </p>
          </div>
          <button
            onClick={() => setForceMock(true)}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-2 bg-[#C0FF00] text-black hover:bg-white transition-colors rounded-sm"
          >
            <Sparkles className="w-4 h-4" />
            Switch to Mock Mode
          </button>
        </div>
      )}

    </div>
  );
};
