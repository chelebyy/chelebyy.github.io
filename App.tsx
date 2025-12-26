
import React, { useState, useEffect, useRef } from 'react';
import { Project, ActivityLog, Language } from './types';
import { mockProjects, mockLogs } from './services/geminiService';

// --- Translations ---

const translations = {
  en: {
    terminal: 'chelebyy@root:~',
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
    indexOf: 'DIZIN /PROJELER',
    compiling: 'Compiling artifacts...',
    listing: (count: number) => `${count} dizin, 0 dosya listeleniyor.`,
    recentActivity: 'RECENT_ACTIVITY',
    availableForHire: 'AVAILABLE_FOR_HIRE',
    readmeIntro: 'The web has become too heavy.',
    readmeBody1: 'We are building tools that are lightweight, honest, and raw.',
    readmeBody2: 'Function over form. Transparency over polish.',
    server: 'Server',
    marquee: '/// BUILDING_THE_FUTURE /// ENGINEERED_FOR_PERFORMANCE /// DIGITAL_CRAFTSMANSHIP /// DEPLOYING_IDEAS_TO_REALITY /// ',
    // Secure Sector Translations
    loadMore: '[ LOAD_MORE_ARTIFACTS ]',
    unlockHint: 'Unlock secure sector...',
    lockedTitle: 'SECURE_SECTOR_LOCKED',
    lockedDesc: 'Additional project data is encrypted. Initialize decryption sequence via the left panel control.',
    sectorUnlocked: 'Sector_Unlocked',
    items: 'Items',
    endOfData: '--- End of Sector Data ---',
    // Manifesto Translations
    manifestoTitle: 'SYSTEM_PROTOCOL_V1',
    manifestoClass: 'DigitalArtisan',
    manifestoImplements: 'Creator',
    manifestoPhilosophy: '// Core Philosophy: Simplicity is usage.',
    manifestoMethod: 'manifesto',
    manifestoPrinciples: [
      "'Minimalism over Decoration'",
      "'Function over Form'",
      "'Speed over Features'"
    ],
    manifestoStatus: 'Ready_to_Deploy',
    // Command Palette Translations
    cmdReady: 'SYSTEM_READY',
    cmdHelp: 'Type "help" for available commands.',
    cmdAvailable: 'Available commands: help, clear, theme [blue|red|green|purple], contact, exit',
    cmdThemeSet: 'Theme set to',
    cmdInvalidColor: 'Invalid color. Try: blue, red, green, purple',
    cmdOpenMail: 'Opening mail client...',
    cmdMatrixMsgOn: 'Wake up, Neo...',
    cmdMatrixMsgOff: 'The Matrix has been disabled. Welcome back to reality.',
    cmdWhoami: 'root (admin)',
    cmdSudoDenied: 'PERMISSION DENIED: You didn\'t say the magic word.',
    cmdSudoGranted: 'Make me a sandwich? Okay. 🥪 (Just kidding, root access granted).',
    cmdNotFound: 'Command not found:',
    cmdPlaceholder: 'Enter command...',
    // Help Descriptions
    helpDescTheme: '- Change system theme',
    helpDescMatrix: '- Toggle The Matrix',
    helpDescNeofetch: '- Display system info',
    helpDescClear: '- Clear terminal',
    helpDescContact: '- Send signal',
    helpDescWhoami: '- User identity',
    helpDescSudo: '- Execute as root',
    helpDescExit: '- Close terminal',
    // Control Panel Translations
    cpTitle: 'SYSTEM_CONTROL_CENTER',
    cpIdentity: 'IDENTITY_MODULE',
    cpSettings: 'SYSTEM_SETTINGS',
    cpCrtEffect: 'CRT_SCANLINE_EFFECT',
    cpAnimSpeed: 'ANIMATION_SPEED',
    // System Monitor Translations
    sysMonitorTitle: 'SYSTEM_MODULES',
    sysPid: 'PID',
    sysModuleName: 'MODULE_NAME',
    sysUsage: 'USAGE',
    sysStatus: 'STATUS',
    sysCpuLoad: 'CPU_LOAD: AVERAGE',
    // Module Statuses
    statusRunning: 'RUNNING',
    statusOptimized: 'OPTIMIZED',
    statusFiltering: 'FILTERING',
    statusContainerized: 'CONTAINERIZED',
    statusBlocking: 'BLOCKING',
    statusLearning: 'LEARNING',
    statusVirtualized: 'VIRTUALIZED'
  },
  tr: {
    terminal: 'chelebyy@root:~',
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
    indexOf: 'DIZIN /PROJELER',
    compiling: 'Eserler derleniyor...',
    listing: (count: number) => `${count} dizin, 0 dosya listeleniyor.`,
    recentActivity: 'SON_AKTIVITELER',
    availableForHire: 'ISE_ALIMA_ACIK',
    readmeIntro: 'Web cok agirlasti.',
    readmeBody1: 'Hafif, durust ve saf araclar insa ediyoruz.',
    readmeBody2: 'Form yerine islev. Cilalamak yerine seffaflik.',
    server: 'Sunucu',
    marquee: '/// GELECEGI_INSA_EDIYORUZ /// PERFORMANS_MUHENDISLIGI /// DIJITAL_ZANAATKARLIK /// FIKIRLERI_GERCEGE_DONUSTURUYORUZ /// ',
    // Secure Sector Translations
    loadMore: '[ ARTEFAKTLARI_YUKLE ]',
    unlockHint: 'Güvenli sektörü aç...',
    lockedTitle: 'GUVENLI_BOLGE_KILITLI',
    lockedDesc: 'Ek proje verileri şifrelendi. Sol panelden şifre çözmeyi başlatın.',
    sectorUnlocked: 'Bolge_Acildi',
    items: 'Oge',
    endOfData: '--- Sektor Verisi Sonu ---',
    // Manifesto Translations
    manifestoTitle: 'SISTEM_PROTOKOLU_V1',
    manifestoClass: 'DijitalZanaatkar',
    manifestoImplements: 'Gelistirici',
    manifestoPhilosophy: '// Temel Felsefe: Sadelik kullanimdir.',
    manifestoMethod: 'manifesto',
    manifestoPrinciples: [
      "'Susleme yerine Minimalizm'",
      "'Form yerine Islev'",
      "'Ozellik yerine Hiz'"
    ],
    manifestoStatus: 'Yayina_Hazir',
    // Command Palette Translations
    cmdReady: 'SISTEM_HAZIR',
    cmdHelp: 'Komutlar icin "help" yazin.',
    cmdAvailable: 'Kullanilabilir komutlar: help, clear, theme [blue|red|green|purple], contact, exit',
    cmdThemeSet: 'Tema degistirildi:',
    cmdInvalidColor: 'Gecersiz renk. Deneyin: blue, red, green, purple',
    cmdOpenMail: 'Mail istemcisi aciliyor...',
    cmdMatrixMsgOn: 'Uyan, Neo...',
    cmdMatrixMsgOff: 'Matrix devre disi birakildi. Gerceklige hos geldin.',
    cmdWhoami: 'root (yonetici)',
    cmdSudoDenied: 'ERISIM REDDEDILDI: Sihirli kelimeyi soylemedin.',
    cmdSudoGranted: 'Bana sandviç hazirla? Tamam. 🥪 (Saka yapiyorum, root erisimi verildi).',
    cmdNotFound: 'Komut bulunamadi:',
    cmdPlaceholder: 'Komut girin...',
    // Help Descriptions
    helpDescTheme: '- Sistem temasini degistir',
    helpDescMatrix: '- Matrix modunu ac/kapat',
    helpDescNeofetch: '- Sistem bilgisini goster',
    helpDescClear: '- Terminali temizle',
    helpDescContact: '- Sinyal gonder',
    helpDescWhoami: '- Kullanici kimligi',
    helpDescSudo: '- Root olarak calistir',
    helpDescExit: '- Terminali kapat',
    // Control Panel Translations
    cpTitle: 'SISTEM_KONTROL_MERKEZI',
    cpIdentity: 'KIMLIK_MODULU',
    cpSettings: 'SISTEM_AYARLARI',
    cpCrtEffect: 'CRT_TARAMA_EFEKTI',
    cpAnimSpeed: 'ANIMASYON_HIZI',
    // System Monitor Translations
    sysMonitorTitle: 'SISTEM_MODULLERI',
    sysPid: 'PID',
    sysModuleName: 'MODUL_ADI',
    sysUsage: 'KULLANIM',
    sysStatus: 'DURUM',
    sysCpuLoad: 'ISLEMCI_YUKU: DENGELI',
    // Module Statuses
    statusRunning: 'CALISIYOR',
    statusOptimized: 'OPTIMIZE',
    statusFiltering: 'FILTRELENIYOR',
    statusContainerized: 'KONTEYNER',
    statusBlocking: 'ENGELLENIYOR',
    statusLearning: 'OGRENIYOR',
    statusVirtualized: 'SANALLASTIRILDI',


  }
};

// --- Helper Components ---

const Header = ({ lang, setLang, onOpenControlPanel }: { lang: Language, setLang: (l: Language) => void, onOpenControlPanel: () => void }) => {
  const [displayText, setDisplayText] = useState('');
  const fullText = translations[lang].terminal;

  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
  const [memState, setMemState] = useState(64);
  const [cpuState, setCpuState] = useState(12);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    let index = 0;
    setDisplayText('');
    const fullText = translations[lang].terminal;

    const typeInterval = setInterval(() => {
      setDisplayText(fullText.substring(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(typeInterval);
    }, 100);

    // Live Clock & Stats Updater
    const statsInterval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
      // Simulate fluctuation
      setMemState(prev => Math.min(99, Math.max(10, prev + (Math.random() > 0.5 ? 2 : -2))));
      setCpuState(prev => Math.min(100, Math.max(2, prev + (Math.random() > 0.5 ? 5 : -3))));
    }, 1000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(typeInterval);
      clearInterval(statsInterval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [lang]);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark bg-[#111218]/90 backdrop-blur-sm px-4 py-3 md:px-10">
      <div
        onClick={onOpenControlPanel}
        className="flex items-center gap-4 text-white cursor-pointer group select-none"
        title="Open System Control"
      >
        <div className="size-5 text-primary group-hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[20px] leading-none">terminal</span>
        </div>
        <h2 className="text-white text-base md:text-lg font-bold leading-tight tracking-[-0.015em] font-mono group-hover:text-primary transition-colors">
          {displayText}
          <span className="animate-pulse">_</span>
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
          <span>{time}</span>
          <span>MEM: {memState}%</span>
          <span>CPU: {cpuState}%</span>
          <span className={isOnline ? "text-green-500" : "text-red-500"}>NET: {isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
        <button onClick={() => window.dispatchEvent(new CustomEvent('open-cmd'))} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-sm h-8 px-4 bg-primary hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors duration-100">
          <span className="truncate">{translations[lang].connect}</span>
        </button>
      </div>
      <div className="md:hidden flex items-center gap-4 text-white">
        <button onClick={() => setLang(lang === 'en' ? 'tr' : 'en')} className="font-mono text-xs border border-border-dark px-2 py-1">
          {lang.toUpperCase()}
        </button>
        <span className="material-symbols-outlined">menu</span>
      </div>
    </header>
  );
};

const Hero = ({ lang, onInit, onOpenLogs }: { lang: Language, onInit: () => void, onOpenLogs: () => void }) => (
  <section className="border-b border-border-dark bg-surface-dark relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    <div className="px-4 md:px-12 py-20 md:py-24 flex flex-col md:flex-row max-w-[1440px] mx-auto relative z-10 gap-12 items-center">
      <div className="flex flex-col gap-6 flex-1">
        <div className="inline-flex items-center gap-2 text-primary font-mono text-sm mb-4">
          <span className="animate-pulse">_</span> {translations[lang].systemReady}
        </div>
        <h1 className="text-white text-5xl md:text-7xl font-black leading-[0.9] tracking-[-0.04em] uppercase">
          <span className="block hover-shake inline-block cursor-none">{translations[lang].heroLine1}</span><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 hover:text-primary transition-colors duration-100 cursor-none hover-shake inline-block">{translations[lang].heroLine2}</span><br />
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
          <button
            onClick={onOpenLogs}
            className="flex items-center justify-center h-12 px-6 bg-transparent text-white hover:text-primary text-sm font-bold uppercase tracking-widest border border-border-dark hover:border-primary transition-all duration-100 rounded-sm cursor-none"
          >
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

const Sidebar = ({ lang }: { lang: Language }) => {
  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border-dark bg-[#0c0c0e] sticky top-[65px] h-[calc(100vh-65px)] font-mono text-sm leading-6 select-none overflow-y-auto custom-scrollbar">
      <div className="p-6">
        <h3 className="text-gray-500 text-[10px] mb-4 uppercase tracking-widest pl-2 border-l border-primary/50">{translations[lang].directory} ~/root</h3>

        {/* Tree Structure */}
        <div className="flex flex-col text-gray-400">

          {/* Projects Directory */}
          <div className="relative pl-4">
            {/* Branch line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-800"></div>

            <div className="relative group">
              <div className="absolute left-[-16px] top-3 w-4 h-px bg-gray-800"></div>
              <a
                href="#projects-section"
                onClick={(e) => scrollToSection('projects-section', e)}
                className="flex items-center gap-2 hover:text-white hover:bg-white/5 py-1 px-2 rounded-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-blue-400 group-hover:text-blue-300">folder</span>
                <span className="group-hover:translate-x-1 transition-transform">{translations[lang].projectsLink.replace('./', '')}</span>
              </a>
            </div>
          </div>

          {/* System Directory */}
          <div className="relative pl-4 pt-1">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-800"></div>

            <div className="relative group">
              <div className="absolute left-[-16px] top-3 w-4 h-px bg-gray-800"></div>
              <div className="flex items-center gap-2 py-1 px-2 text-gray-500">
                <span className="material-symbols-outlined text-[16px]">folder_open</span>
                <span>system</span>
              </div>
            </div>

            {/* Sub-item: Manifesto */}
            <div className="relative pl-6 group">
              <div className="absolute left-[-8px] top-0 bottom-1/2 w-px bg-gray-800"></div>
              <div className="absolute left-[-8px] top-3 w-4 h-px bg-gray-800"></div>

              <a
                href="#manifesto-section"
                onClick={(e) => scrollToSection('manifesto-section', e)}
                className="flex items-center gap-2 hover:text-white hover:bg-white/5 py-1 px-2 rounded-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-purple-400 group-hover:text-purple-300">settings_heart</span>
                <span className="group-hover:translate-x-1 transition-transform text-xs">
                  {lang === 'en' ? 'modules.sys' : 'moduller.sys'}
                </span>
              </a>
            </div>
          </div>

          {/* Logs Directory */}
          <div className="relative pl-4 pt-1">
            <div className="absolute left-0 top-0 bottom-1/2 w-px bg-gray-800"></div>

            <div className="relative group">
              <div className="absolute left-[-16px] top-3 w-4 h-px bg-gray-800"></div>
              <div className="flex items-center gap-2 py-1 px-2 text-gray-500">
                <span className="material-symbols-outlined text-[16px]">folder_open</span>
                <span>var/log</span>
              </div>
            </div>

            {/* Sub-item: Changelog */}
            <div className="relative pl-6 group">
              <div className="absolute left-[-8px] top-0 bottom-1/2 w-px bg-gray-800"></div>
              <div className="absolute left-[-8px] top-3 w-4 h-px bg-gray-800"></div>

              <a
                href="#activity-section"
                onClick={(e) => scrollToSection('activity-section', e)}
                className="flex items-center gap-2 hover:text-white hover:bg-white/5 py-1 px-2 rounded-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-gray-500 group-hover:text-gray-300">terminal</span>
                <span className="group-hover:translate-x-1 transition-transform">sys.log</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Footer System Stats */}
      <div className="mt-auto p-6 border-t border-border-dark bg-[#0a0a0c]">
        <div className="flex flex-col gap-2 font-mono text-[10px] text-gray-600">
          <div className="flex justify-between">
            <span>/dev/disk1</span>
            <span className="text-green-500">MOUNTED</span>
          </div>
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="w-[45%] h-full bg-primary/50"></div>
          </div>
          <div className="flex justify-between mt-1">
            <span>UPTIME</span>
            <span>04:20:01</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <a className="group border-b border-r border-border-dark bg-surface-dark p-8 flex flex-col justify-between h-[320px] border-glitch relative overflow-hidden flex-shrink-0" href={project.url || '#'}>
    {/* Target Lock Corners */}
    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:top-2 group-hover:left-2"></div>
    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:top-2 group-hover:right-2"></div>
    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bottom-2 group-hover:left-2"></div>
    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bottom-2 group-hover:right-2"></div>

    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
      <span className="material-symbols-outlined text-primary">arrow_outward</span>
    </div>
    <div>
      <div className="font-mono text-xs text-primary mb-3 flex items-center gap-2 uppercase">
        <span className="w-2 h-2 bg-primary block"></span> {project.order}_Project
      </div>
      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
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

const SystemMonitor = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  // Initial state for modules with "random" usage
  const [modules, setModules] = useState([
    { id: 1024, name: 'REACT_CORE_V19.dll', usage: 98, status: 'RUNNING', color: 'text-blue-400' },
    { id: 2048, name: 'TYPESCRIPT_COMPILER.exe', usage: 90, status: 'OPTIMIZED', color: 'text-blue-500' },
    { id: 3301, name: 'OPNSENSE_FIREWALL.sys', usage: 85, status: 'FILTERING', color: 'text-orange-400' },
    { id: 4100, name: 'DOCKER_ENGINE.svc', usage: 92, status: 'CONTAINERIZED', color: 'text-blue-300' },
    { id: 5021, name: 'ADGUARD_DNS_SINK.net', usage: 88, status: 'BLOCKING', color: 'text-green-400' },
    { id: 6606, name: 'AI_NEURAL_NET.model', usage: 99, status: 'LEARNING', color: 'text-purple-400' },
    { id: 7001, name: 'PROXMOX_VE_HOST.iso', usage: 95, status: 'VIRTUALIZED', color: 'text-orange-500' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setModules(prev => prev.map(m => ({
        ...m,
        usage: Math.min(100, Math.max(20, m.usage + (Math.random() * 6 - 3))) // Fluctuate +/- 3%
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="manifesto-section" className="border-b border-border-dark p-8 md:p-12 w-full bg-[#050505] relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      <h2 className="text-white text-xl font-bold mb-8 flex items-center gap-3 relative z-10">
        <span className="material-symbols-outlined text-primary animate-spin-slow">settings_heart</span>
        {lang === 'en' ? 'SYSTEM_MODULES' : 'SISTEM_MODULLERI'}
        <span className="text-xs font-mono text-gray-500 ml-auto hidden md:block">CPU_LOAD: AVERAGE</span>
      </h2>

      <div className="w-full overflow-x-auto relative z-10">
        <table className="w-full font-mono text-xs md:text-sm text-left border-collapse">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800">
              <th className="py-2 px-4 uppercase tracking-wider">PID</th>
              <th className="py-2 px-4 uppercase tracking-wider">Module_Name</th>
              <th className="py-2 px-4 uppercase tracking-wider w-1/3">Usage</th>
              <th className="py-2 px-4 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => (
              <tr key={m.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors group">
                <td className="py-3 px-4 text-gray-600">{m.id}</td>
                <td className={`py-3 px-4 ${m.color} font-bold group-hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-shadow`}>{m.name}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-full h-2 bg-gray-800 rounded-sm overflow-hidden">
                      <div
                        className={`h-full ${m.id === 6606 ? 'bg-purple-500' : 'bg-primary'} transition-all duration-700 ease-out`}
                        style={{ width: `${m.usage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-400 w-8 text-right">{Math.round(m.usage)}%</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] bg-white/5 border border-white/10 ${m.status === 'RUNNING' ? 'text-green-400' : m.status === 'LEARNING' ? 'text-purple-400 animate-pulse' : 'text-primary'}`}>
                    [{m.status}]
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ActivityLogList = ({ logs, lang }: { logs: ActivityLog[], lang: Language }) => (
  <div id="activity-section" className="p-8 md:p-12">
    <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-3">
      <span className="material-symbols-outlined text-primary">history</span>
      {translations[lang].recentActivity}
    </h2>
    <ul className="space-y-0">
      {logs.map((log, idx) => (
        <li key={idx} className="block group">
          <a href={log.url} target="_blank" rel="noopener noreferrer" className={`flex flex-col md:flex-row md:items-center gap-4 py-4 border-b border-dashed border-gray-800 text-sm hover:bg-white/5 px-2 -mx-2 transition-colors rounded-sm ${log.url ? 'cursor-pointer' : ''}`}>
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
            <span className="text-gray-400 truncate">{log.message}</span>
            {log.url && <span className="hidden group-hover:inline-block material-symbols-outlined text-xs text-gray-600 ml-auto">open_in_new</span>}
          </a>
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



// --- Custom Cursor Component ---
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, input, [role="button"]');
      setIsHovering(!!clickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousemove', updateHoverState);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousemove', updateHoverState);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-[9999] mix-blend-difference"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className={`relative transition-all duration-150 ease-out ${isClicking ? 'scale-75' : 'scale-100'}`}>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] bg-white transition-all duration-300 ${isHovering ? 'w-8' : 'w-4'}`}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] bg-white transition-all duration-300 ${isHovering ? 'h-8' : 'h-4'}`}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}></div>

        {/* Corner Brackets */}
        <div className={`absolute -top-4 -left-4 w-2 h-2 border-t border-l border-white/50 transition-all duration-300 ${isHovering ? 'opacity-100 rotate-0' : 'opacity-0 rotate-45 scale-50'}`}></div>
        <div className={`absolute -bottom-4 -right-4 w-2 h-2 border-b border-r border-white/50 transition-all duration-300 ${isHovering ? 'opacity-100 rotate-0' : 'opacity-0 rotate-45 scale-50'}`}></div>
      </div>
    </div>
  );
};

// --- Log Terminal Sidebar ---
const LogTerminal = ({ isOpen, onClose, lang }: { isOpen: boolean, onClose: () => void, lang: Language }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setLogs([]);
      return;
    }

    const possibleLogs = {
      en: [
        "> SYSTEM_CHECK_INTEGRITY... OK",
        "> CONNECTING_TO_SATELLITE_UPLINK... SUCCESS",
        "> DECRYPTING_USER_DATA... [###########] 100%",
        "> WARNING: HIGH_MEMORY_USAGE_DETECTED",
        "> OPTIMIZING_RENDER_CYCLE... DONE",
        "> FETCHING_LATEST_ARTIFACTS... [CACHED]",
        "> USER_ID: VERIFIED // ACCESS_LEVEL: ARCHITECT",
        "> QUANTUM_TUNNELING_ESTABLISHED",
        "> MONITORING_NETWORK_TRAFFIC... STABLE",
        "> ANALYZING_USER_BEHAVIOR... [PRIVACY_MODE]",
        "> DEPLOYING_NANOBOTS_TO_DOM...",
        "> 0 Errors, 0 Warnings found.",
        "> EXECUTING_ORDER_66... [SKIPPING]",
        "> SEARCHING_FOR_MEANING_OF_LIFE... 42",
        "> UPLOADING_CONSCIOUSNESS... [|||.......] 23%",
        "> ERROR: COFFEE_LEVEL_CRITICAL",
        "> BYPASSING_FIREWALL... ACCESS_GRANTED",
        "> INITIATING_HYPER_DRIVE...",
        "> DETECTED_ANOMALY_IN_SECTOR_7G",
        "> RECALIBRATING_FLUX_CAPACITOR...",
        "> DOWNLOADING_INTERNET... PLEASE_WAIT",
        "> SYSTEM_UPDATE_REQUIRED [IGNORE]",
        "> ENCRYPTING_COMMUNICATION_CHANNEL...",
        "> SCANNING_FOR_VULNERABILITIES... NONE",
        "> REROUTING_POWER_TO_SHIELDS...",
        "> LOADING_TEXTURES... [HIGH_RES]",
        "> PING_REMOTE_SERVER: 2ms",
        "> ALLOCATING_VIRTUAL_MEMORY...",
        "> GARBAGE_COLLECTION_STARTED...",
        "> SYNCHRONIZING_CLOCKS... [NTP]",
        "> CHECKING_DISK_SPACE... 99TB FREE",
        "> MOUNTING_EXTERNAL_DRIVE: /DEV/SDA1",
        "> KERNEL_PANIC_PREVENTED",
        "> AI_CORE_ONLINE",
        "> ESTABLISHING_NEURAL_LINK...",
        "> COMPILING_SOURCE_CODE...",
        "> PACKET_LOSS_DETECTED: 0.0001%",
        "> TRACING_RAY_PATHS...",
        "> GENERATING_PROCEDURAL_TERRAIN...",
        "> LOADING_DAEMON_PROCESSES...",
        "> VERIFYING_CHECKSUMS... MATCH",
        "> PROTOCOL_OMEGA_ACTIVATED"
      ],
      tr: [
        "> SISTEM_BUTUNLUK_KONTROLU... TAMAM",
        "> UYDU_BAGLANTISI_KURULUYOR... BASARILI",
        "> KULLANICI_VERISI_COZULUYOR... [###########] 100%",
        "> UYARI: YUKSEK_BELLEK_KULLANIMI_TESPIT_EDILDI",
        "> RENDER_DONGUSU_OPTIMIZE_EDILIYOR... TAMAMLANDI",
        "> SON_ESERLER_GETIRILIYOR... [ONBELLEK]",
        "> KULLANICI_KIMLIGI: DOGRULANDI // SEVIYE: MIMAR",
        "> KUANTUM_TUNELLEME_KURULUYOR...",
        "> AG_TRAFIGI_IZLENIYOR... STABIL",
        "> KULLANICI_DAVRANISI_ANALIZ_EDILIYOR... [GIZLI_MOD]",
        "> DOM_NANOBOTLARI_DAGITILIYOR...",
        "> 0 Hata, 0 Uyari bulundu.",
        "> EMIR_66_UYGULANIYOR... [ATLANIYOR]",
        "> HAYATIN_ANLAMI_ARANIYOR... 42",
        "> BILINC_YUKLENIYOR... [|||.......] %23",
        "> HATA: KAHVE_SEVIYESI_KRITIK",
        "> GUVENLIK_DUVARI_ASILIYOR... ERISIM_VERILDI",
        "> HIPER_SURUCU_BASLATILIYOR...",
        "> SECTOR_7G_BOLGESINDE_ANOMALI_TESPIT_EDILDI",
        "> AKIS_KAPASITORU_KALIBRE_EDILIYOR...",
        "> INTERNET_INDIRILIYOR... LUTFEN_BEKLEYIN",
        "> SISTEM_GUNCELLEMESI_GEREKLI [GORMEZDEN_GEL]",
        "> ILETISIM_KANALI_SIFRELENIYOR...",
        "> ZAFIYET_TARAMASI... TEMIZ",
        "> KALKANLARA_GUC_AKTARILIYOR...",
        "> DOKULAR_YUKLENIYOR... [YUKSEK_COZ]",
        "> SUNUCU_PING: 2ms",
        "> SANAL_BELLEK_AYRILIYOR...",
        "> COP_TOPLAYICI_BASLATILDI...",
        "> SAATLER_ESITLENIYOR... [NTP]",
        "> DISK_ALANI_KONTROLU... 99TB BOS",
        "> HARICI_SURUCU_BAGLANDI: /DEV/SDA1",
        "> CEKIRDEK_PANIGI_ONLENDI",
        "> YAPAY_ZEKA_CEKIRDEGI_CEVRIMICI",
        "> NORAL_BAGLANTI_KURULUYOR...",
        "> KAYNAK_KOD_DERLENIYOR...",
        "> PAKET_KAYBI_TESPIT_EDILDI: %0.0001",
        "> ISIN_IZLEME_YOLLARI_HESAPLANIYOR...",
        "> YORDAMSAL_ARAZI_OLUSTURULUYOR...",
        "> IBLIS_SURECLERI_YUKLENIYOR...",
        "> DOGRULAMA_TOPLAMLARI... ESLESTI",
        "> PROTOKOL_OMEGA_AKTIF"
      ]
    };

    const interval = setInterval(() => {
      const randomLog = possibleLogs[lang][Math.floor(Math.random() * possibleLogs[lang].length)];
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      setLogs(prev => [...prev.slice(-100), `[${timestamp}] ${randomLog}`]);
    }, 800);

    return () => clearInterval(interval);
  }, [isOpen, lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[40] backdrop-blur-sm" onClick={onClose}></div>
      )}

      {/* Sidebar Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-[#0c0c0e] border-l border-primary/30 z-[50] transform transition-transform duration-300 ease-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full font-mono text-xs">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-border-dark bg-black/40">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-white font-bold">SYSTEM_LOGS</span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors cursor-none">
              [X]
            </button>
          </div>

          {/* Logs Output */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 text-green-500/80 font-mono">
            {logs.map((log, i) => (
              <div key={i} className="border-l-2 border-green-900/30 pl-2 hover:border-green-500 transition-colors">
                {log}
              </div>
            ))}
            <div className="animate-pulse">_</div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border-dark text-gray-600 text-[10px] uppercase">
            Use 'ESC' to close terminal uplink
          </div>
        </div>
      </div>
    </>
  );
};

// --- Command Palette Component ---
// --- Control Panel Component ---
const ControlPanel = ({
  isOpen,
  onClose,
  lang,
  crtEnabled,
  setCrtEnabled,
  user
}: {
  isOpen: boolean,
  onClose: () => void,
  lang: Language,
  crtEnabled: boolean,
  setCrtEnabled: (enabled: boolean) => void,
  user: any
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="w-full max-w-md bg-[#0c0c0e] border border-border-dark box-shadow-primary p-6 rounded-sm relative overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative z-10 border-b border-white/5 pb-4">
          <h2 className="text-white font-bold font-mono tracking-widest uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
            {t.cpTitle}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Identity Module */}
        <div className="mb-8 relative z-10">
          <h3 className="text-xs text-gray-500 font-mono uppercase mb-4 pl-2 border-l-2 border-primary">{t.cpIdentity}</h3>

          <div className="flex items-center gap-6 bg-white/5 p-4 rounded-sm border border-white/5 hover:border-primary/30 transition-colors">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700">
                <img
                  src={user?.avatar_url || 'https://github.com/chelebyy.png'}
                  alt="Avatar"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-black"></div>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg leading-none mb-1">@{user?.login || 'chelebyy'}</h4>
              <p className="text-gray-400 text-xs font-mono mb-2">{user?.bio || 'Full Stack Developer'}</p>

              <div className="flex gap-4 text-xs font-mono text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">folder</span>
                  {user?.public_repos || '0'}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">group</span>
                  {user?.followers || '0'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="relative z-10">
          <h3 className="text-xs text-gray-500 font-mono uppercase mb-4 pl-2 border-l-2 border-primary">{t.cpSettings}</h3>

          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between p-3 bg-white/5 rounded-sm hover:bg-white/10 cursor-pointer transition-colors group">
              <span className="text-gray-300 font-mono text-sm group-hover:text-white">{t.cpCrtEffect}</span>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={crtEnabled}
                  onChange={(e) => setCrtEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-600 font-mono uppercase">System Integrity: 100% // Secure Connection</p>
        </div>
      </div>
    </div>

  );
};

// --- Matrix Rain Effect ---
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const rainDrops: number[] = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const interval = setInterval(draw, 30);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[10] pointer-events-none opacity-50 mix-blend-screen" />;
};

const CommandPalette = ({ isOpen, onClose, lang, matrixEnabled, setMatrixEnabled }: { isOpen: boolean, onClose: () => void, lang: Language, matrixEnabled: boolean, setMatrixEnabled: (enabled: boolean) => void }) => {
  const t = translations[lang];
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<React.ReactNode[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHistory([<div key="init1" className="text-gray-500">&gt; {t.cmdReady}</div>, <div key="init2" className="text-gray-500">&gt; {t.cmdHelp}</div>]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, lang, t.cmdReady, t.cmdHelp]);

  // Neofetch ASCII Art
  const getNeofetch = () => (
    <div className="text-xs font-mono text-primary leading-tight my-2">
      <pre>{`
       /\\        OS: Digital Artifacts OS v1.0
      /  \\       Host: VITE-REACT-TS-CORE
     / /\\ \\      Kernel: 5.15.0-generic
    / /__\\ \\     Uptime: 420 days, 6 hours
   / /____\\ \\    Packages: 1337 (npm)
  / /______\\ \\   Shell: zsh 5.8
 /_/________\\_\\  Resolution: 1920x1080
                 DE: Cyberpunk
                 WM: Tiling
                 Theme: Dark [GTK2/3]
                 Icons: Material Symbols
                 Terminal: WebTerm
                 CPU: Neural Engine X1
                 GPU: Rendering Unit 04
      `}</pre>
    </div>
  );

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      const newHistory = [...history, <div key={Date.now() + 'cmd'} className="text-white">{translations['en'].terminal.split(':')[0]}:~$ {input}</div>];

      let response: React.ReactNode = '';

      if (cmd === 'help') {
        response = (
          <div className="text-gray-400">
            <div>&gt; {t.cmdAvailable}</div>
            <div className="pl-4 text-primary">theme [color] <span className="text-gray-600">{t.helpDescTheme}</span></div>
            <div className="pl-4 text-primary">matrix <span className="text-gray-600">{t.helpDescMatrix}</span></div>
            <div className="pl-4 text-primary">neofetch <span className="text-gray-600">{t.helpDescNeofetch}</span></div>
            <div className="pl-4 text-primary">clear <span className="text-gray-600">{t.helpDescClear}</span></div>
            <div className="pl-4 text-primary">contact <span className="text-gray-600">{t.helpDescContact}</span></div>
            <div className="pl-4 text-primary">whoami <span className="text-gray-600">{t.helpDescWhoami}</span></div>
            <div className="pl-4 text-primary">sudo [cmd] <span className="text-gray-600">{t.helpDescSudo}</span></div>
            <div className="pl-4 text-primary">exit <span className="text-gray-600">{t.helpDescExit}</span></div>
          </div>
        );
      } else if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (cmd === 'matrix') {
        if (matrixEnabled) {
          setMatrixEnabled(false);
          response = <div className="text-gray-500">{t.cmdMatrixMsgOff}</div>;
        } else {
          setMatrixEnabled(true);
          response = <div className="text-green-500 font-bold glow">{t.cmdMatrixMsgOn}</div>;
        }
      } else if (cmd === 'neofetch' || cmd === 'sys') {
        response = getNeofetch();
      } else if (cmd === 'whoami') {
        response = <div className="text-blue-400">{t.cmdWhoami}</div>;
      } else if (cmd.startsWith('sudo')) {
        if (cmd.includes('please') || cmd.includes('lütfen') || cmd.includes('lutfen')) {
          response = <div className="text-yellow-400">{t.cmdSudoGranted}</div>;
        } else {
          response = <div className="text-red-500 font-bold blink">{t.cmdSudoDenied}</div>;
        }
      } else if (cmd.startsWith('theme') || ['blue', 'red', 'green', 'purple'].includes(cmd)) {
        const color = cmd.startsWith('theme') ? cmd.split(' ')[1] : cmd;
        const colors: Record<string, string> = {
          blue: '#1337ec',
          red: '#ff0055',
          green: '#00ff41',
          purple: '#9d00ff'
        };
        if (colors[color]) {
          document.documentElement.style.setProperty('--color-primary', colors[color]);
          response = <div className="text-primary">&gt; {t.cmdThemeSet} {color.toUpperCase()}</div>;
        } else {
          response = <div className="text-red-400">&gt; {t.cmdInvalidColor}</div>;
        }
      } else if (cmd === 'contact') {
        window.location.href = 'mailto:contact@cheleby.dev';
        response = <div className="text-yellow-400">&gt; {t.cmdOpenMail}</div>;
      } else if (cmd === 'exit') {
        onClose();
        return;
      } else if (cmd === '') {
        response = '';
      } else {
        response = <div className="text-red-400">&gt; {t.cmdNotFound} {cmd}</div>;
      }

      if (response) newHistory.push(<div key={Date.now() + 'resp'}>{response}</div>);
      setHistory(newHistory);
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0c0c0e] border border-primary box-shadow-primary p-6 rounded-sm relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="h-64 overflow-y-auto mb-4 font-mono text-sm space-y-1 custom-scrollbar" onClick={() => inputRef.current?.focus()}>
          {history.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          <div ref={el => el?.scrollIntoView({ behavior: "smooth" })} />
        </div>
        <div className="flex items-center gap-2 border-t border-border-dark pt-4">
          <span className="text-primary font-bold font-mono">➜</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="bg-transparent border-none outline-none text-white font-mono w-full focus:ring-0"
            placeholder={t.cmdPlaceholder}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [isInit, setIsInit] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [matrixEnabled, setMatrixEnabled] = useState(false); // Matrix State
  const [projects, setProjects] = useState<Project[]>(mockProjects['en']);
  const [userData, setUserData] = useState<any>(null);  // Store fetched user data
  // Initial state is "Scanning..." to indicate live data fetching
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { timestamp: '---', type: 'system', hash: '...', message: 'Scanning deep space frequencies...', url: '' }
  ]);

  // Secure Sector States
  const [isSectorUnlocked, setIsSectorUnlocked] = useState(false);
  const [showUnlockInput, setShowUnlockInput] = useState(false);
  const [unlockInput, setUnlockInput] = useState('');
  const [unlockError, setUnlockError] = useState(false);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // THE ANSWER TO LIFE, THE UNIVERSE, AND EVERYTHING
    if (unlockInput.trim() === '42') {
      setIsSectorUnlocked(true);
      setShowUnlockInput(false);
    } else {
      setUnlockError(true);
      setUnlockInput('');
      setTimeout(() => setUnlockError(false), 800);
    }
  };

  useEffect(() => {
    const fetchGitHubProjects = async () => {
      try {
        // Fetch user data
        const userRes = await fetch('https://api.github.com/users/chelebyy');
        if (userRes.ok) {
          const user = await userRes.json();
          setUserData(user);
        }

        // Fetch Repos
        const response = await fetch('https://api.github.com/users/chelebyy/repos?sort=pushed&per_page=100');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const mappedProjects = data
              .filter((repo: any) => !repo.fork)
              .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
              .slice(0, 50)
              .map((repo: any, index: number) => ({
                id: repo.id.toString(),
                name: repo.name,
                description: repo.description || 'No description provided.',
                tags: [repo.language, 'GitHub'].filter(Boolean).slice(0, 3),
                stars: repo.stargazers_count >= 1000 ? (repo.stargazers_count / 1000).toFixed(1) + 'k' : repo.stargazers_count.toString(),
                order: (index + 1).toString().padStart(2, '0'),
                url: repo.html_url
              }));
            if (mappedProjects.length > 0) setProjects(mappedProjects);
          }
        }

        // Fetch Events (Activity Log)
        try {
          const eventsRes = await fetch('https://api.github.com/users/chelebyy/events');

          if (eventsRes.ok) {
            const events = await eventsRes.json();

            // Filter for Releases and Tag Creations
            const releaseEvents = events.filter((event: any) =>
              event.type === 'ReleaseEvent' ||
              (event.type === 'CreateEvent' && event.payload.ref_type === 'tag')
            );

            if (releaseEvents.length > 0) {
              const mappedLogs: ActivityLog[] = releaseEvents.slice(0, 10).map((event: any) => {
                let message = '';
                let type: any = 'release';
                let hash = '';
                let url = '';

                if (event.type === 'ReleaseEvent') {
                  hash = event.payload.release.tag_name;
                  message = `[${event.repo.name}] ${event.payload.release.name || 'New Release'}`;
                  url = event.payload.release.html_url;
                } else {
                  hash = event.payload.ref;
                  message = `[${event.repo.name}] Tag created`;
                  url = `https://github.com/${event.repo.name}/releases/tag/${event.payload.ref}`;
                }

                return {
                  timestamp: new Date(event.created_at).toISOString().replace('T', ' ').substring(0, 16),
                  type,
                  hash,
                  message,
                  url
                };
              });
              setActivityLogs(mappedLogs);
            } else {
              // No recent releases found in API, fallback to manual v1.0.0 entry
              throw new Error("No releases found");
            }
          } else {
            throw new Error("API Error");
          }
        } catch (error) {
          // Fallback for Rate Limit or Empty Data
          setActivityLogs([
            {
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              type: 'release',
              hash: 'v1.0.0',
              message: '[chelebyy.github.io] Official Launch - Matrix Mode & Secure Sector',
              url: 'https://github.com/chelebyy/chelebyy.github.io/releases/tag/v1.0.0'
            }
          ]);
        }

      } catch (error) {
        console.error('Failed to fetch GitHub data.', error);
      }
    };

    fetchGitHubProjects();
  }, []);

  const handleInit = () => {
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
      <CustomCursor />

      {/* Matrix Rain Effect */}
      {matrixEnabled && <MatrixRain />}

      {/* CRT Effect Overlay */}
      {crtEnabled && (
        <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,3px_100%] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,0.4)_100%)]"></div>
        </div>
      )}

      <ControlPanel
        isOpen={isControlPanelOpen}
        onClose={() => setIsControlPanelOpen(false)}
        lang={lang}
        crtEnabled={crtEnabled}
        setCrtEnabled={setCrtEnabled}
        user={userData}
      />

      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} lang={lang} matrixEnabled={matrixEnabled} setMatrixEnabled={setMatrixEnabled} />
      <Header lang={lang} setLang={setLang} onOpenControlPanel={() => setIsControlPanelOpen(true)} />

      <main className="flex-grow flex flex-col w-full">
        <LogTerminal isOpen={isLogsOpen} onClose={() => setIsLogsOpen(false)} lang={lang} />
        {isInit && <TerminalOverlay onComplete={onOverlayComplete} lang={lang} />}
        <Hero lang={lang} onInit={handleInit} onOpenLogs={() => setIsLogsOpen(true)} />
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
