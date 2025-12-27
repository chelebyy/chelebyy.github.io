import React, { useState, Suspense, lazy, useEffect } from 'react';
import { Language, Project, GitHubUser } from './src/types';
import { translations } from './src/constants/translations';
import { useSoundEffects } from './src/hooks/useSoundEffects';
import { useGitHubData } from './src/hooks/useGitHubData';

// Eager Imports (Critical for First Paint)
import BootSequence from './src/components/BootSequence';
import CustomCursor from './src/components/CustomCursor';
import Header from './src/components/Header';
import Hero from './src/components/Hero';
import Marquee from './src/components/Marquee';
import Sidebar from './src/components/Sidebar';
import ProjectCard from './src/components/ProjectCard';
import SystemMonitor from './src/components/SystemMonitor';
import ActivityLogList from './src/components/ActivityLogList';
import Footer from './src/components/Footer';

// Lazy Imports (Interactive/Conditional/Heavy)
const MatrixRain = lazy(() => import('./src/components/MatrixRain'));
const ControlPanel = lazy(() => import('./src/components/ControlPanel'));
const CommandPalette = lazy(() => import('./src/components/CommandPalette'));
const LogTerminal = lazy(() => import('./src/components/LogTerminal'));
const TerminalOverlay = lazy(() => import('./src/components/TerminalOverlay'));

// Mock Data (temporarily kept here or ideally move to a service)
const mockProjects: Record<Language, Project[]> = {
  en: [
    { id: '1', name: 'Neural_Network_Visualizer', description: 'A 3D interactive visualization regarding how neural networks process data.', tags: ['Python', 'Three.js', 'TensorFlow'], stars: '1.2k', order: '01' },
    { id: '2', name: 'Cyber_Security_Dash', description: 'Real-time threat monitoring dashboard for enterprise networks.', tags: ['React', 'D3.js', 'Socket.io'], stars: '850', order: '02' },
    { id: '3', name: 'Quantum_Encryption_Lib', description: 'Post-quantum cryptography library for secure communications.', tags: ['Rust', 'WASM'], stars: '2.4k', order: '03' },
    { id: '4', name: 'AI_Code_Assistant', description: 'VS Code extension utilizing LLMs to suggest optimal code patterns.', tags: ['TypeScript', 'OpenAI'], stars: '3.1k', order: '04' },
    { id: '5', name: 'Blockchain_Vote_Sys', description: 'Decentralized voting mechanism ensuring transparency and anonymity.', tags: ['Solidity', 'Web3'], stars: '500', order: '05' },
  ],
  tr: [
    { id: '1', name: 'Sinir_Ağı_Görselleştirici', description: 'Sinir ağlarının veriyi nasıl işlediğine dair 3B etkileşimli görselleştirme.', tags: ['Python', 'Three.js', 'TensorFlow'], stars: '1.2k', order: '01' },
    { id: '2', name: 'Siber_Güvenlik_Paneli', description: 'Kurumsal ağlar için gerçek zamanlı tehdit izleme paneli.', tags: ['React', 'D3.js', 'Socket.io'], stars: '850', order: '02' },
    { id: '3', name: 'Kuantum_Şifreleme_Kütüphanesi', description: 'Güvenli iletişim için kuantum sonrası kriptografi kütüphanesi.', tags: ['Rust', 'WASM'], stars: '2.4k', order: '03' },
    { id: '4', name: 'Yapay_Zeka_Kod_Asistanı', description: 'Optimal kod desenlerini önermek için LLM kullanan VS Code eklentisi.', tags: ['TypeScript', 'OpenAI'], stars: '3.1k', order: '04' },
    { id: '5', name: 'Blokzincir_Oylama_Sis', description: 'Şeffaflık ve anonimlik sağlayan merkeziyetsiz oylama mekanizması.', tags: ['Solidity', 'Web3'], stars: '500', order: '05' },
  ]
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');

  // Sound Hook
  const { playLogOpenSound, playBootPhaseSound, initAudio } = useSoundEffects();

  // System Boot State (Session Storage Check)
  const [isBooting, setIsBooting] = useState(() => {
    // Check if we've already booted in this session
    return !sessionStorage.getItem('hasBooted');
  });

  const handleBootComplete = () => {
    setIsBooting(false);
    sessionStorage.setItem('hasBooted', 'true');
  };

  const [isInit, setIsInit] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [matrixEnabled, setMatrixEnabled] = useState(false); // Matrix State

  // Custom Hook for Data
  const { userData, projects, activityLogs } = useGitHubData(mockProjects['en']);

  // Secure Sector States
  const [isSectorUnlocked, setIsSectorUnlocked] = useState(false);
  const [showUnlockInput, setShowUnlockInput] = useState(false);
  const [unlockInput, setUnlockInput] = useState('');
  const [unlockError, setUnlockError] = useState(false);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // THE ANSWER TO LIFE, THE UNIVERSE, AND EVERYTHING
    if (unlockInput.trim() === '1905') {
      setIsSectorUnlocked(true);
      setShowUnlockInput(false);
    } else {
      setUnlockError(true);
      setUnlockInput('');
      setTimeout(() => setUnlockError(false), 800);
    }
  };

  const handleOpenLogs = () => {
    playLogOpenSound();
    setIsLogsOpen(true);
  };

  const handleInit = () => {
    initAudio(); // Wake up AudioContext on user click
    setIsInit(true);
  };

  const onOverlayComplete = () => {
    setIsInit(false);
    document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleOpenCmd = () => setIsCmdOpen(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      }
    };

    window.addEventListener('open-cmd', handleOpenCmd);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-cmd', handleOpenCmd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background-dark cursor-none relative overflow-hidden">
      {isBooting && <BootSequence onComplete={handleBootComplete} playPhaseSound={playBootPhaseSound} initAudio={initAudio} />}
      <CustomCursor />

      <Suspense fallback={null}>
        {matrixEnabled && <MatrixRain />}
      </Suspense>

      <Suspense fallback={null}>
        <ControlPanel
          isOpen={isControlPanelOpen}
          onClose={() => setIsControlPanelOpen(false)}
          lang={lang}
          crtEnabled={crtEnabled}
          setCrtEnabled={setCrtEnabled}
          user={userData}
        />
        <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} lang={lang} matrixEnabled={matrixEnabled} setMatrixEnabled={setMatrixEnabled} />
      </Suspense>

      {/* CRT Effect Overlay */}
      {crtEnabled && (
        <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,3px_100%] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,0.4)_100%)]"></div>
        </div>
      )}

      <Header lang={lang} setLang={setLang} onOpenControlPanel={() => setIsControlPanelOpen(true)} />

      <main className="flex-grow flex flex-col w-full">
        <Suspense fallback={null}>
          <LogTerminal isOpen={isLogsOpen} onClose={() => setIsLogsOpen(false)} lang={lang} />
          {isInit && <TerminalOverlay onComplete={onOverlayComplete} lang={lang} initAudio={initAudio} />}
        </Suspense>

        <Hero lang={lang} onInit={handleInit} onOpenLogs={handleOpenLogs} />
        <Marquee lang={lang} />

        <div className="flex flex-col md:flex-row max-w-[1440px] mx-auto w-full border-x border-border-dark flex-grow">
          <Sidebar lang={lang} />

          <div className="flex-1 bg-background-dark border-t md:border-t-0">
            {/* Projects Header */}
            <div id="projects-section" className="border-b border-border-dark px-6 py-8 md:px-12 flex justify-between items-end">
              <div>
                <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tight mb-2 uppercase">{translations[lang].indexOf}</h2>
                <p className="text-gray-500 font-mono text-sm">
                  {translations[lang].listing(projects.length)}
                </p>
              </div>
              <div className="hidden md:block">
                <span className="material-symbols-outlined text-gray-600 text-4xl">
                  folder_open
                </span>
              </div>
            </div>

            {/* Split View Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-b border-border-dark min-h-[600px]">

              {/* Left Column: First 3 Projects */}
              <div className="flex flex-col border-r border-border-dark">
                {projects.slice(0, 3).map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}

                {/* Load More / Unlock Mechanism */}
                {!isSectorUnlocked && projects.length > 3 && (
                  <div className={`flex-1 flex items-center justify-center p-8 bg-surface-dark/30 border-t border-border-dark transition-all duration-300 relative overflow-hidden ${showUnlockInput ? 'bg-black' : 'hover:bg-surface-dark/50 cursor-pointer group'}`}
                    onClick={() => !showUnlockInput && setShowUnlockInput(true)}>

                    {!showUnlockInput ? (
                      <div className="text-center">
                        <span className="material-symbols-outlined text-4xl text-gray-700 group-hover:text-primary mb-4 transition-colors">lock_open</span>
                        <p className="font-mono text-primary text-xs tracking-widest uppercase mb-1">{translations[lang].loadMore}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{translations[lang].unlockHint}</p>
                      </div>
                    ) : (
                      <form onSubmit={handleUnlockSubmit} className="w-full max-w-[200px] relative z-10">
                        <label className="block text-[10px] text-primary font-mono mb-2 uppercase tracking-widest text-center animate-pulse">
                          {unlockError ? 'ACCESS_DENIED' : 'ENTER_PASSCODE'}
                        </label>
                        <div className={`flex items-center border-b-2 ${unlockError ? 'border-red-500' : 'border-primary'} bg-black/50`}>
                          <span className="text-gray-500 pl-2 font-mono">&gt;</span>
                          <input
                            type="text"
                            autoFocus
                            className="w-full bg-transparent border-none outline-none text-white font-mono text-center p-2 uppercase tracking-widest"
                            value={unlockInput}
                            onChange={(e) => setUnlockInput(e.target.value)}
                            maxLength={10}
                            onBlur={() => !unlockInput && setShowUnlockInput(false)}
                          />
                        </div>
                        <p className="text-[9px] text-gray-600 mt-2 text-center font-mono">Hint: Check system logs...</p>
                      </form>
                    )}

                    {/* Error Flash Overlay */}
                    {unlockError && <div className="absolute inset-0 bg-red-500/20 animate-pulse pointer-events-none"></div>}
                  </div>
                )}

                {/* Fallback space filler if unlocked */}
                {isSectorUnlocked && (
                  <div className="flex-1 bg-surface-dark/10 border-t border-border-dark flex items-center justify-center opacity-20">
                    <span className="material-symbols-outlined text-6xl">grid_view</span>
                  </div>
                )}
              </div>

              {/* Right Column: Secure Sector */}
              <div className="relative bg-[#030303] flex flex-col">
                {!isSectorUnlocked ? (
                  /* Locked State */
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-800 font-mono text-xs gap-4 p-8 text-center select-none">
                    <div className="w-16 h-16 border border-white/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl text-gray-800 animate-pulse">lock</span>
                    </div>
                    <div>
                      <p className="uppercase tracking-widest text-gray-700 mb-2">{translations[lang].lockedTitle}</p>
                      <p className="text-[10px] text-gray-800 max-w-[200px] mx-auto leading-relaxed opacity-50">
                        {translations[lang].lockedDesc}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Unlocked State (Scrollable List) */
                  <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                    <div className="p-4 md:p-8 space-y-4">
                      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <h3 className="text-white font-mono text-sm uppercase tracking-widest">{translations[lang].sectorUnlocked} // {projects.slice(3).length} {translations[lang].items}</h3>
                      </div>

                      <div className="grid grid-cols-1 gap-0">
                        {projects.slice(3).map(project => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>

                      <div className="text-center py-8 opacity-30 font-mono text-[10px] uppercase">
                        {translations[lang].endOfData}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* System Monitor */}
            <SystemMonitor lang={lang} />

            <ActivityLogList logs={activityLogs} lang={lang} />
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
};

export default App;
