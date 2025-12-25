
import React, { useState, useEffect } from 'react';
import { Project, ActivityLog, Language } from './types';
import { mockProjects, mockLogs } from './services/geminiService';

// --- Translations ---

const translations = {
  en: {
    terminal: 'user@github:~',
    connect: 'Connect_Repo',
    systemReady: 'SYSTEM_READY',
    heroLine1: 'Building',
    heroLine2: 'Digital',
    heroLine3: '> Artifacts.',
    heroSub: '// A brutalist approach to open source software. \n// Stripping away the noise to focus on raw functionality.',
    initBtn: 'Execute_Init()',
    readLogsBtn: './Read_Logs',
    directory: 'Directory',
    projectsLink: './projects',
    manifestoLink: './manifesto.md',
    changelogLink: './changelog',
    locationUnknown: 'SYSTEM_CORE',
    indexOf: 'Index Of /Projects',
    compiling: 'Compiling artifacts...',
    listing: (count: number) => `Listing ${count} directories, 0 files.`,
    recentActivity: 'RECENT_ACTIVITY',
    availableForHire: 'AVAILABLE_FOR_HIRE',
    readmeIntro: 'The web has become too heavy.',
    readmeBody1: 'We are building tools that are lightweight, honest, and raw.',
    readmeBody2: 'Function over form. Transparency over polish.',
    server: 'Server',
    marquee: 'WARNING: EXPERIMENTAL BUILDS DETECTED /// PROCEED WITH CURIOSITY /// FUNCTION OVER FORM /// TRANSPARENCY OVER POLISH /// '
  },
  tr: {
    terminal: 'kullanici@github:~',
    connect: 'Depoyu_Bagla',
    systemReady: 'SISTEM_HAZIR',
    heroLine1: 'Dijital',
    heroLine2: 'Eserler',
    heroLine3: '> Insa Ediliyor.',
    heroSub: '// Acik kaynakli yazilima brutalist bir yaklasim. \n// Saf islevsellige odaklanmak icin gurultuyu temizliyoruz.',
    initBtn: 'Baslat_Init()',
    readLogsBtn: './Loglari_Oku',
    directory: 'Dizin',
    projectsLink: './projeler',
    manifestoLink: './manifesto.md',
    changelogLink: './degisim_gunlugu',
    locationUnknown: 'SISTEM_CEKIRDEGI',
    indexOf: 'Dizin /Projeler',
    compiling: 'Eserler derleniyor...',
    listing: (count: number) => `${count} dizin, 0 dosya listeleniyor.`,
    recentActivity: 'SON_AKTIVITELER',
    availableForHire: 'ISE_ALIMA_ACIK',
    readmeIntro: 'Web cok agirlasti.',
    readmeBody1: 'Hafif, durust ve saf araclar insa ediyoruz.',
    readmeBody2: 'Form yerine islev. Cilalamak yerine seffaflik.',
    server: 'Sunucu',
    marquee: 'UYARI: DENEYSEL SURUMLER TESPIT EDILDI /// MERAKLA DEVAM EDIN /// FORM YERINE ISLEV /// CILALAMAK YERINE SEFFAFLIK /// '
  }
};

// --- Helper Components ---

const Header = ({ lang, setLang }: { lang: Language, setLang: (l: Language) => void }) => (
  <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark bg-[#111218]/90 backdrop-blur-sm px-4 py-3 md:px-10">
    <div className="flex items-center gap-4 text-white">
      <div className="size-5 text-primary">
        <span className="material-symbols-outlined text-[20px] leading-none">terminal</span>
      </div>
      <h2 className="text-white text-base md:text-lg font-bold leading-tight tracking-[-0.015em] font-mono">
        {translations[lang].terminal}
      </h2>
    </div>
    <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
      <div className="flex items-center gap-6 font-mono text-xs text-gray-400 border border-border-dark px-3 py-1 rounded-sm">
        <button
          onClick={() => setLang('en')}
          className={`${lang === 'en' ? 'text-primary font-bold' : 'text-gray-600'} hover:text-white transition-colors`}
        >
          EN
        </button>
        <span className="text-gray-800">/</span>
        <button
          onClick={() => setLang('tr')}
          className={`${lang === 'tr' ? 'text-primary font-bold' : 'text-gray-600'} hover:text-white transition-colors`}
        >
          TR
        </button>
      </div>
      <div className="flex items-center gap-6 font-mono text-xs text-gray-400">
        <span>MEM: 64%</span>
        <span>CPU: 12%</span>
        <span className="text-green-500">NET: ONLINE</span>
      </div>
      <a className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-sm h-8 px-4 bg-primary hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors duration-100" href="#">
        <span className="truncate">{translations[lang].connect}</span>
      </a>
    </div>
    <div className="md:hidden flex items-center gap-4 text-white">
      <button onClick={() => setLang(lang === 'en' ? 'tr' : 'en')} className="font-mono text-xs border border-border-dark px-2 py-1">
        {lang.toUpperCase()}
      </button>
      <span className="material-symbols-outlined">menu</span>
    </div>
  </header>
);

const Hero = ({ lang, onInit }: { lang: Language, onInit: () => void }) => (
  <section className="border-b border-border-dark bg-surface-dark relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    <div className="px-4 md:px-12 py-20 md:py-24 flex flex-col md:flex-row max-w-[1440px] mx-auto relative z-10 gap-12 items-center">
      <div className="flex flex-col gap-6 flex-1">
        <div className="inline-flex items-center gap-2 text-primary font-mono text-sm mb-4">
          <span className="animate-pulse">_</span> {translations[lang].systemReady}
        </div>
        <h1 className="text-white text-5xl md:text-7xl font-black leading-[0.9] tracking-[-0.04em] uppercase">
          {translations[lang].heroLine1}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 hover:text-primary transition-colors duration-100 cursor-default">{translations[lang].heroLine2}</span><br />
          <span className="pl-8 md:pl-20 block text-primary">{translations[lang].heroLine3}</span>
        </h1>
        <div className="mt-8 max-w-2xl border-l-2 border-primary pl-6 py-2">
          <p className="text-gray-300 text-lg md:text-xl font-normal leading-relaxed font-mono whitespace-pre-line">
            {translations[lang].heroSub}
          </p>
        </div>
        <div className="flex gap-4 mt-8">
          <button
            onClick={onInit}
            className="flex items-center justify-center h-12 px-6 bg-white text-black hover:bg-primary hover:text-white text-sm font-bold uppercase tracking-widest border border-white hover:border-primary transition-all duration-100 rounded-sm"
          >
            {translations[lang].initBtn}
          </button>
          <button className="flex items-center justify-center h-12 px-6 bg-transparent text-white hover:text-primary text-sm font-bold uppercase tracking-widest border border-border-dark hover:border-primary transition-all duration-100 rounded-sm">
            {translations[lang].readLogsBtn}
          </button>
        </div>
      </div>

      {/* Right Side Visual */}
      <div className="hidden md:flex flex-1 justify-end items-center md:translate-x-52">
        <div className="relative w-[400px] h-[300px] border border-dashed border-gray-700 bg-black/50 p-2 group">
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-primary"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-primary"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-primary"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-primary"></div>

          <div className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWTgp3bL6fzwmhtfxGfaIwYAThlSoMPXimutfwgnhJzbE_DxAGOPDI0878aHY7nIFl9Kdkw6H5rq2W8KbqF_qT89h0A9opqt-unsS4-62TgGu_oxsoTj8MUNILYm2rVf70iHZbHjIV3HPc6AWCtjyIKnqmcpIxwUa9BvwrLYqr4NRPceHW4awyvGkUizOXwGT7hWFQCl2ifjqP0b7reG4fiy1HftYlQJ_mO52Z5I3o6pnrW7KWXDyYcF4U7f26eBYlD3sPVHwYKB1W')` }}>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="bg-black/90 px-3 py-1 border border-white/10">
                <p className="text-[10px] font-mono text-primary mb-0.5">TARGET_ZONE</p>
                <p className="text-xs font-mono text-white font-bold">{translations[lang].locationUnknown}</p>
              </div>
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-primary rounded-full animate-ping"></span>
                <span className="w-1 h-1 bg-primary rounded-full"></span>
                <span className="w-1 h-1 bg-primary rounded-full"></span>
              </div>
            </div>
          </div>

          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
        </div>
      </div>
    </div>
  </section>
);

const Marquee = ({ lang }: { lang: Language }) => (
  <div className="bg-primary text-white py-3 overflow-hidden whitespace-nowrap border-b border-border-dark">
    <div className="animate-marquee inline-block font-mono text-sm font-bold tracking-widest uppercase">
      {translations[lang].marquee}{translations[lang].marquee}
    </div>
  </div>
);

const Sidebar = ({ lang }: { lang: Language }) => (
  <aside className="hidden md:flex flex-col w-64 border-r border-border-dark bg-surface-dark sticky top-[65px] h-[calc(100vh-65px)]">
    <div className="p-6 border-b border-border-dark">
      <h3 className="text-gray-500 font-mono text-xs mb-4 uppercase">{translations[lang].directory}</h3>
      <nav className="flex flex-col gap-3">
        <a className="text-white hover:text-primary font-bold flex items-center gap-2 group" href="#">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">&gt;</span> {translations[lang].projectsLink}
        </a>
        <a className="text-gray-400 hover:text-white font-medium flex items-center gap-2 group transition-colors" href="#">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">&gt;</span> {translations[lang].manifestoLink}
        </a>
        <a className="text-gray-400 hover:text-white font-medium flex items-center gap-2 group transition-colors" href="#">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">&gt;</span> {translations[lang].changelogLink}
        </a>
      </nav>
    </div>
    <div className="p-6 mt-auto">
      {/* Location widget moved to Hero */}
    </div>
  </aside>
);

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <a className="group border-b border-r border-border-dark bg-surface-dark p-8 flex flex-col justify-between h-[320px] border-glitch relative overflow-hidden" href="#">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
      <span className="material-symbols-outlined text-primary">arrow_outward</span>
    </div>
    <div>
      <div className="font-mono text-xs text-primary mb-3 flex items-center gap-2 uppercase">
        <span className="w-2 h-2 bg-primary block"></span> {project.order}_Project
      </div>
      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        {project.description}
      </p>
    </div>
    <div className="mt-6 pt-6 border-t border-dashed border-gray-800 flex justify-between items-end">
      <div className="flex gap-2">
        {project.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300">{tag}</span>
        ))}
      </div>
      <div className="text-right font-mono text-xs text-gray-500">
        ★ {project.stars}
      </div>
    </div>
  </a>
);

const Readme = ({ lang }: { lang: Language }) => (
  <div className="border-b border-border-dark p-8 md:p-12">
    <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-3">
      <span className="material-symbols-outlined text-primary">description</span>
      README.md
    </h2>
    <div className="bg-[#050505] p-6 rounded-sm border border-border-dark font-mono text-sm leading-relaxed text-gray-400 max-w-3xl overflow-x-auto">
      <p className="mb-4">
        <span className="text-gray-600 select-none">01 |</span> <span className="text-primary">/**</span>
      </p>
      <p className="mb-1">
        <span className="text-gray-600 select-none">02 |</span> &nbsp;* {translations[lang].readmeIntro}
      </p>
      <p className="mb-1">
        <span className="text-gray-600 select-none">03 |</span> &nbsp;* {translations[lang].readmeBody1}
      </p>
      <p className="mb-1">
        <span className="text-gray-600 select-none">04 |</span> &nbsp;* {translations[lang].readmeBody2}
      </p>
      <p className="mb-1">
        <span className="text-gray-600 select-none">05 |</span> &nbsp;*
      </p>
      <p className="mb-1">
        <span className="text-gray-600 select-none">06 |</span> &nbsp;* Current Status: <span className="text-green-500">{translations[lang].availableForHire}</span>
      </p>
      <p className="mt-4">
        <span className="text-gray-600 select-none">07 |</span> <span className="text-primary"> */</span>
      </p>
    </div>
  </div>
);

const ActivityLogList = ({ logs, lang }: { logs: ActivityLog[], lang: Language }) => (
  <div className="p-8 md:p-12">
    <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-3">
      <span className="material-symbols-outlined text-primary">history</span>
      {translations[lang].recentActivity}
    </h2>
    <ul className="space-y-0">
      {logs.map((log, idx) => (
        <li key={idx} className="flex flex-col md:flex-row md:items-center gap-4 py-4 border-b border-dashed border-gray-800 text-sm group hover:bg-white/5 px-2 -mx-2 transition-colors rounded-sm">
          <span className="font-mono text-gray-500 text-xs min-w-[120px]">{log.timestamp}</span>
          {log.hash && (
            <span className="font-bold text-white text-primary group-hover:text-primary whitespace-nowrap">
              {log.type} {log.hash}
            </span>
          )}
          {!log.hash && (
            <span className="font-bold text-white text-primary group-hover:text-primary whitespace-nowrap uppercase">
              {log.type}
            </span>
          )}
          <span className="text-gray-400">{log.message}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = ({ lang }: { lang: Language }) => (
  <footer className="border-t border-border-dark bg-[#0a0a0c] z-50">
    <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center px-6 py-4">
      <div className="flex items-center gap-6 mb-4 md:mb-0">
        <p className="text-gray-500 text-xs font-mono uppercase">
          © {new Date().getFullYear()} User_System. All Rights Reserved.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <a className="text-gray-500 hover:text-white transition-colors" href="#">
          <span className="sr-only">Twitter</span>
          <svg aria-hidden="true" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </a>
        <a className="text-gray-500 hover:text-white transition-colors" href="#">
          <span className="sr-only">GitHub</span>
          <svg aria-hidden="true" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
          </svg>
        </a>
        <div className="h-4 w-px bg-gray-800"></div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-mono text-gray-400 uppercase">{translations[lang].server}: US-EAST-1</span>
        </div>
      </div>
    </div>
  </footer>
);

// --- Terminal Overlay Component ---
const TerminalOverlay = ({ onComplete, lang }: { onComplete: () => void, lang: Language }) => {
  const [lines, setLines] = useState<string[]>([]);

  const sequences = {
    en: [
      { text: '> INITIALIZING_KERNEL...', delay: 100 },
      { text: '> LOADING_MODULES [REACT, TS, VITE]...', delay: 600 },
      { text: '> ESTABLISHING_SECURE_UPLINK...', delay: 1200 },
      { text: '> COMPILING_DIGITAL_ARTIFACTS...', delay: 1800 },
      { text: '> ACCESS_GRANTED.', delay: 2400 }
    ],
    tr: [
      { text: '> CEKIRDEK_BASLATILIYOR...', delay: 100 },
      { text: '> MODULLER_YUKLENIYOR [REACT, TS, VITE]...', delay: 600 },
      { text: '> GUVENLI_BAGLANTI_KURULUYOR...', delay: 1200 },
      { text: '> DIJITAL_ESERLER_DERLENIYOR...', delay: 1800 },
      { text: '> ERISIM_IZNI_VERILDI.', delay: 2400 }
    ]
  };

  useEffect(() => {
    // Reset lines when language or init restarts (though component unmounts usually)
    setLines([]);

    const sequence = sequences[lang];
    let timeouts: NodeJS.Timeout[] = [];

    sequence.forEach(({ text, delay }) => {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, text]);
      }, delay);
      timeouts.push(timeout);
    });

    const finishTimeout = setTimeout(onComplete, 2800);
    timeouts.push(finishTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete, lang]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0c] text-primary font-mono text-sm p-4 md:p-10 flex flex-col justify-end pb-20">
      {lines.map((line, i) => (
        <p key={i} className="mb-2 last:animate-pulse">{line}</p>
      ))}
      <div className="animate-pulse mt-4">_</div>
    </div>
  );
};

// --- Main Application ---

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [isInit, setIsInit] = useState(false);

  const handleInit = () => {
    setIsInit(true);
  };

  const onOverlayComplete = () => {
    setIsInit(false);
    document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <Header lang={lang} setLang={setLang} />

      <main className="flex-grow flex flex-col w-full">
        {isInit && <TerminalOverlay onComplete={onOverlayComplete} lang={lang} />}
        <Hero lang={lang} onInit={handleInit} />
        <Marquee lang={lang} />

        <div className="flex flex-col md:flex-row max-w-[1440px] mx-auto w-full border-x border-border-dark flex-grow">
          <Sidebar lang={lang} />

          <div className="flex-1 bg-background-dark border-t md:border-t-0">
            {/* Projects Header */}
            <div id="projects-section" className="border-b border-border-dark px-6 py-8 md:px-12 flex justify-between items-end">
              <div>
                <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tight mb-2 uppercase">{translations[lang].indexOf}</h2>
                <p className="text-gray-500 font-mono text-sm">
                  {translations[lang].listing(mockProjects[lang].length)}
                </p>
              </div>
              <div className="hidden md:block">
                <span className="material-symbols-outlined text-gray-600 text-4xl">
                  folder_open
                </span>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 min-h-[320px]">
              {mockProjects[lang].map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            <Readme lang={lang} />

            <ActivityLogList logs={mockLogs[lang]} lang={lang} />
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
};

export default App;

