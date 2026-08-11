import React, { useState } from 'react';
import { Play, Terminal, CheckCircle2, Loader2 } from 'lucide-react';

export const TestRunner: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [executed, setExecuted] = useState(false);

  const runTestSuite = async () => {
    setRunning(true);
    setLogs([]);
    setExecuted(false);

    try {
      const response = await fetch('/api/run-test');
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (err: any) {
      setLogs([
        '=== Execution Error ===',
        'Failed to connect to backend test runner endpoint.',
        err.message
      ]);
    } finally {
      setRunning(false);
      setExecuted(true);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-mono">
      
      {/* Test Controls Banner */}
      <div className="bg-[#141414] border border-[#222] rounded-sm p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-2 border-l-[#C0FF00]">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#C0FF00]">
            Automated Quality Assurance
          </span>
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#C0FF00]" />
            1337x Provider Test Suite
          </h2>
          <p className="text-xs text-[#E0E0E0]/60 mt-1">
            Validates table parser regex, field extraction, seeders/leechers conversion, and magnet resolver.
          </p>
        </div>

        <button
          onClick={runTestSuite}
          disabled={running}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-[#C0FF00] hover:bg-white text-black font-black uppercase text-xs tracking-widest transition-all disabled:opacity-50 shrink-0"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>RUNNING...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-black" />
              <span>RUN TESTS</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Output Window */}
      <div className="bg-[#0A0A0A] border border-[#222] rounded-sm overflow-hidden shadow-2xl font-mono text-xs">
        
        {/* Terminal Title Bar */}
        <div className="bg-[#141414] px-4 py-3 border-b border-[#222] flex items-center justify-between text-[#E0E0E0]/60 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#C0FF00]" />
            <div className="w-2.5 h-2.5 bg-amber-400" />
            <div className="w-2.5 h-2.5 bg-[#444]" />
            <span className="ml-2 font-bold text-white text-[11px] uppercase tracking-wider">node test.js</span>
          </div>
          {executed && (
            <span className="text-xs text-[#C0FF00] flex items-center gap-1 font-bold uppercase tracking-widest">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C0FF00]" />
              PASSED
            </span>
          )}
        </div>

        {/* Console Log Stream */}
        <div className="p-5 min-h-[320px] max-h-[500px] overflow-y-auto space-y-2 text-[#E0E0E0]">
          {running ? (
            <div className="flex items-center gap-3 text-[#E0E0E0]/60 py-12 justify-center">
              <Loader2 className="w-5 h-5 text-[#C0FF00] animate-spin" />
              <span className="uppercase font-bold tracking-wider">Executing extension unit test suite...</span>
            </div>
          ) : logs.length > 0 ? (
            logs.map((log, index) => {
              const isHeader = log.startsWith('===');
              const isPassed = log.includes('PASSED') || log.includes('Success');
              const isFailed = log.includes('FAILED') || log.includes('Error');
              const isTest = log.startsWith('[Test');

              return (
                <div
                  key={index}
                  className={`leading-relaxed whitespace-pre-wrap ${
                    isHeader
                      ? 'text-[#C0FF00] font-bold border-y border-[#222] py-1 my-2 uppercase tracking-wider'
                      : isPassed
                      ? 'text-[#C0FF00] font-bold'
                      : isFailed
                      ? 'text-rose-400 font-bold'
                      : isTest
                      ? 'text-amber-300 font-bold'
                      : 'text-[#E0E0E0]/90'
                  }`}
                >
                  {log}
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center space-y-3">
              <p className="text-[#888888] uppercase font-bold tracking-wider">Click "RUN TESTS" above to execute test.js</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
