import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SearchPlayground } from './components/SearchPlayground';
import { InstallGuide } from './components/InstallGuide';
import { CodeViewer } from './components/CodeViewer';
import { TestRunner } from './components/TestRunner';
import { metadata } from '../hayase/1337x.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'guide' | 'code' | 'test'>('search');
  const [manifestCode, setManifestCode] = useState<string>('Loading manifest...');
  const [scriptCode, setScriptCode] = useState<string>('Loading script...');
  const [testCode, setTestCode] = useState<string>('Loading test...');
  const [appUrl, setAppUrl] = useState<string>(window.location.origin);

  useEffect(() => {
    // Fetch raw files for code viewer
    fetch('/api/hayase/manifest')
      .then((res) => res.text())
      .then((text) => setManifestCode(text))
      .catch(() => setManifestCode('// Error loading manifest'));

    fetch('/api/hayase/1337x.js')
      .then((res) => res.text())
      .then((text) => setScriptCode(text))
      .catch(() => setScriptCode('// Error loading script'));

    // Fetch test script
    fetch('/test.js')
      .then((res) => res.text())
      .then((text) => setTestCode(text))
      .catch(() => {
        // Fallback test string if file fetch is direct
        setTestCode(`import { metadata, search, resolveMagnet } from './hayase/1337x.js';\n\nconsole.log("Testing 1337x extension v" + metadata.version);`);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#E0E0E0] flex flex-col font-sans antialiased selection:bg-[#C0FF00] selection:text-black">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        version={metadata.version}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' && (
          <SearchPlayground
            defaultMirror={metadata.defaultMirror}
            mirrors={metadata.mirrors}
          />
        )}

        {activeTab === 'guide' && (
          <InstallGuide appUrl={appUrl} />
        )}

        {activeTab === 'code' && (
          <CodeViewer
            manifestCode={manifestCode}
            scriptCode={scriptCode}
            testCode={testCode}
          />
        )}

        {activeTab === 'test' && (
          <TestRunner />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222] bg-[#0F0F0F] py-6 mt-12 font-mono">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-[#E0E0E0]/40 space-y-2">
          <p className="uppercase tracking-widest font-bold">
            1337x Torrent Provider Extension • Hayase & Shiru Architecture
          </p>
          <p className="text-[10px] text-[#888888]">
            Engineered with dual DOMParser/Regex parsing, mirror routing, and magnet URI resolver.
          </p>
        </div>
      </footer>

    </div>
  );
}
