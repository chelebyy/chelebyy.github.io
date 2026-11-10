import React, { useState, Suspense, lazy, useEffect, useMemo, useCallback } from 'react';
import { Language } from './src/types';
import { useSoundEffects } from './src/hooks/useSoundEffects';
import { useGitHubData } from './src/hooks/useGitHubData';
import { SECRET_THEME_COLOR } from './src/constants/theme';
import { searchFold } from './src/lib/format';

// Eager imports (first paint)
import BootSequence from './src/components/BootSequence';
import CustomCursor from './src/components/CustomCursor';
import Header from './src/components/Header';
import Hero from './src/components/Hero';
import Sidebar from './src/components/Sidebar';
import ProjectList from './src/components/ProjectList';
import SecretSector from './src/components/SecretSector';
import ActivityLogList from './src/components/ActivityLogList';
import Footer from './src/components/Footer';

// Lazy imports (interactive / conditional)
const MatrixRain = lazy(() => import('./src/components/MatrixRain'));
const ControlPanel = lazy(() => import('./src/components/ControlPanel'));
const CommandPalette = lazy(() => import('./src/components/CommandPalette'));
const LogTerminal = lazy(() => import('./src/components/LogTerminal'));
const TerminalOverlay = lazy(() => import('./src/components/TerminalOverlay'));

const LANG_KEY = 'cheleby:lang';

const initialLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'tr') return saved;
  } catch { /* storage unavailable */ }
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : 'en';
};

const App: React.FC = () => {
  const [lang, setLangState] = useState<Language>(initialLanguage);
  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try { localStorage.setItem(LANG_KEY, next); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const { playLogOpenSound, playBootPhaseSound, initAudio } = useSoundEffects();

  const [isBooting, setIsBooting] = useState(() => !sessionStorage.getItem('hasBooted'));
  const handleBootComplete = () => {
    setIsBooting(false);
    sessionStorage.setItem('hasBooted', 'true');
  };

  const [isInit, setIsInit] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [matrixEnabled, setMatrixEnabled] = useState(false);

  const { status, user, projects, activity, syncedAt, retry } = useGitHubData();

  const [query, setQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const languages = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach(project => {
      if (project.language) counts.set(project.language, (counts.get(project.language) ?? 0) + 1);
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([language, count]) => ({ language, count }));
  }, [projects]);

  const visibleProjects = useMemo(() => {
    const needle = searchFold(query.trim());
    return projects.filter(project => {
      if (selectedLanguage && project.language !== selectedLanguage) return false;
      if (!needle) return true;
      const haystack = [project.name, project.description, project.language ?? '', ...project.topics]
        .join(' ');
      return searchFold(haystack).includes(needle);
    });
  }, [projects, query, selectedLanguage]);

  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const handleUnlock = () => {
    setSecretUnlocked(true);
    document.documentElement.style.setProperty('--accent', SECRET_THEME_COLOR);
  };

  const handleOpenLogs = () => {
    playLogOpenSound();
    setIsLogsOpen(true);
  };

  const handleInit = () => {
    initAudio();
    setIsInit(true);
  };

  const onOverlayComplete = useCallback(() => {
    setIsInit(false);
    document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleOpenCmd = () => setIsCmdOpen(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
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

  const closeCmd = useCallback(() => setIsCmdOpen(false), []);

  return (
    <div className="relative flex min-h-screen flex-col bg-background-dark">
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
          user={user}
          escapeEnabled={!isCmdOpen}
        />
        <CommandPalette
          isOpen={isCmdOpen}
          onClose={closeCmd}
          lang={lang}
          matrixEnabled={matrixEnabled}
          setMatrixEnabled={setMatrixEnabled}
          projects={projects}
          user={user}
        />
      </Suspense>

      {crtEnabled && (
        <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,3px_100%]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,0.4)_100%)]"></div>
        </div>
      )}

      <Header
        lang={lang}
        setLang={setLang}
        onOpenControlPanel={() => setIsControlPanelOpen(true)}
        onOpenTerminal={() => setIsCmdOpen(true)}
      />

      <main className="flex w-full flex-grow flex-col">
        <Suspense fallback={null}>
          <LogTerminal isOpen={isLogsOpen} onClose={() => setIsLogsOpen(false)} lang={lang} />
          {isInit && <TerminalOverlay onComplete={onOverlayComplete} lang={lang} initAudio={initAudio} />}
        </Suspense>

        <Hero
          lang={lang}
          user={user}
          projects={projects}
          syncedAt={syncedAt}
          loading={status === 'loading'}
          onInit={handleInit}
          onOpenLogs={handleOpenLogs}
        />

        <div className="mx-auto flex w-full max-w-[1440px] flex-grow flex-col border-x border-border-dark md:flex-row">
          <Sidebar
            lang={lang}
            languages={languages}
            total={projects.length}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
            activityCount={activity.length}
            secretUnlocked={secretUnlocked}
          />

          <div className="min-w-0 flex-1">
            <ProjectList
              lang={lang}
              status={status}
              projects={visibleProjects}
              total={projects.length}
              query={query}
              onQueryChange={setQuery}
              languages={languages}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
              onRetry={retry}
            />
            <SecretSector lang={lang} unlocked={secretUnlocked} onUnlock={handleUnlock} />
            <ActivityLogList logs={activity} lang={lang} />
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
};

export default App;
