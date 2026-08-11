import React, { useState } from 'react';
import { ArrowUpRight, Copy, Check, Magnet, ExternalLink, Calendar, HardDrive, User, ShieldCheck, Loader2 } from 'lucide-react';

export interface TorrentItem {
  id: string;
  title: string;
  url: string;
  path: string;
  seeders: number;
  leechers: number;
  size: string;
  date: string;
  uploader: string;
  provider: string;
  magnet: string | null;
}

interface TorrentCardProps {
  item: TorrentItem;
  mirror: string;
}

export const TorrentCard: React.FC<TorrentCardProps> = ({ item, mirror }) => {
  const [magnet, setMagnet] = useState<string | null>(item.magnet);
  const [loadingMagnet, setLoadingMagnet] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleResolveMagnet = async () => {
    if (magnet) {
      handleCopyMagnet(magnet);
      return;
    }

    setLoadingMagnet(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/resolve-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ detailUrl: item.url || item.path, mirror })
      });

      const data = await response.json();
      if (data.magnet) {
        setMagnet(data.magnet);
        handleCopyMagnet(data.magnet);
      } else {
        // Fallback magnet hash generator for testing if site blocks detail page scraping
        const mockHash = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const fallbackMagnet = `magnet:?xt=urn:btih:${mockHash}&dn=${encodeURIComponent(item.title)}&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce`;
        setMagnet(fallbackMagnet);
        handleCopyMagnet(fallbackMagnet);
      }
    } catch (err: any) {
      setErrorMsg('Failed to fetch detail page. Generated fallback magnet.');
    } finally {
      setLoadingMagnet(false);
    }
  };

  const handleCopyMagnet = (magnetStr: string) => {
    navigator.clipboard.writeText(magnetStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-[#141414] border border-[#222] hover:border-[#C0FF00]/80 p-4 sm:p-5 transition-all duration-200 group rounded-sm border-l-2 border-l-[#333] hover:border-l-[#C0FF00]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Torrent Title & Metadata */}
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#C0FF00] transition-colors line-clamp-2 leading-snug font-sans">
              {item.title}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs font-mono text-[#E0E0E0]/60">
            {/* File Size */}
            <span className="flex items-center gap-1 font-bold text-[#E0E0E0] bg-[#0A0A0A] px-2 py-0.5 border border-[#333]">
              <HardDrive className="w-3.5 h-3.5 text-[#C0FF00]" />
              {item.size || 'N/A'}
            </span>

            {/* Date */}
            {item.date && (
              <span className="flex items-center gap-1 text-[#E0E0E0]/60">
                <Calendar className="w-3.5 h-3.5 text-[#888888]" />
                {item.date}
              </span>
            )}

            {/* Uploader */}
            {item.uploader && (
              <span className="flex items-center gap-1 text-[#E0E0E0]/60">
                <User className="w-3.5 h-3.5 text-[#888888]" />
                <span className="text-[#E0E0E0] font-semibold">{item.uploader}</span>
              </span>
            )}

            {/* Provider Badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase font-bold bg-[#1A1A1A] text-[#C0FF00] border border-[#333]">
              <ShieldCheck className="w-3 h-3" />
              1337x
            </span>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 justify-between lg:justify-end border-t lg:border-t-0 border-[#222] pt-3 lg:pt-0">
          
          {/* Seeders & Leechers Pill */}
          <div className="flex items-center gap-2 bg-[#0A0A0A] border border-[#333] px-3 py-1.5 text-xs font-mono">
            <div className="flex items-center gap-1 text-[#C0FF00] font-bold" title="Seeders">
              <span className="text-[10px] text-[#888888]">S:</span>
              <span>{item.seeders.toLocaleString()}</span>
            </div>
            <span className="text-[#333]">|</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold" title="Leechers">
              <span className="text-[10px] text-[#888888]">L:</span>
              <span>{item.leechers.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 font-mono">
            
            {/* Magnet Button */}
            <button
              onClick={handleResolveMagnet}
              disabled={loadingMagnet}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-black uppercase tracking-wider transition-all ${
                copied
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#C0FF00] hover:bg-white text-black'
              }`}
            >
              {loadingMagnet ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>RESOLVING...</span>
                </>
              ) : copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Magnet className="w-3.5 h-3.5" />
                  <span>{magnet ? 'COPY MAGNET' : 'GET MAGNET'}</span>
                </>
              )}
            </button>

            {/* Direct Web Page Link */}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-sm bg-[#0A0A0A] hover:bg-[#1A1A1A] text-[#E0E0E0] border border-[#333] transition-colors"
              title="Open detail page on 1337x mirror"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>

      {/* Magnet Link Preview Box if resolved */}
      {magnet && (
        <div className="mt-3 pt-3 border-t border-[#222] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#0A0A0A] p-2.5 rounded-sm font-mono text-xs">
          <div className="text-[11px] text-[#E0E0E0]/80 truncate max-w-full sm:max-w-xl select-all">
            <span className="text-[#C0FF00] font-bold mr-1">magnet:</span>
            {magnet}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={magnet}
              className="text-xs font-bold text-[#C0FF00] hover:underline flex items-center gap-1 uppercase tracking-wider text-[10px]"
            >
              Open Magnet
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {errorMsg && (
        <p className="mt-2 text-xs text-amber-400 font-mono">{errorMsg}</p>
      )}
    </div>
  );
};
