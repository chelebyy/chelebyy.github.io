import React, { useState, useEffect, useRef } from 'react';
import { GitHubUser, Language, Project } from '../types';
import { translations } from '../constants/translations';
import { languageBreakdown } from '../lib/github';
import { siteConfig } from '../config/site';
import { THEME_COLORS } from '../constants/theme';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Language;
    matrixEnabled: boolean;
    setMatrixEnabled: (enabled: boolean) => void;
    projects: Project[];
    user: GitHubUser | null;
}

const openExternal = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, lang, matrixEnabled, setMatrixEnabled, projects, user }) => {
    const t = translations[lang];
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<React.ReactNode[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line
            setHistory([<div key="init1" className="text-gray-500">&gt; {t.cmdReady}</div>, <div key="init2" className="text-gray-500">&gt; {t.cmdHelp}</div>]);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, lang, t.cmdReady, t.cmdHelp]);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    const getNeofetch = () => {
        const langs = languageBreakdown(projects).map(entry => entry.language).join(', ') || '—';
        const stars = projects.reduce((sum, project) => sum + project.stars, 0);
        return (
            <div className="text-xs font-mono text-primary leading-tight my-2">
                <pre>{`
         /\\        user: ${user?.login ?? siteConfig.githubUser}@github
        /  \\       repos: ${projects.length}
       / /\\ \\      stars: ${stars}
      / /__\\ \\     languages: ${langs}
     / /______\\ \\   host: GitHub Pages
    / /______\\ \\   stack: React, Vite, Tailwind
   /_/________\\_\\  license: open source
        `}</pre>
            </div>
        );
    };

    const commands: Array<[string, string]> = [
        ['ls', t.helpDescLs],
        ['open [name]', t.helpDescOpen],
        ['theme [color]', t.helpDescTheme],
        ['matrix', t.helpDescMatrix],
        ['neofetch', t.helpDescNeofetch],
        ['whoami', t.helpDescWhoami],
        ['contact', t.helpDescContact],
        ['sudo [cmd]', t.helpDescSudo],
        ['reboot', t.helpDescReboot],
        ['clear', t.helpDescClear],
        ['exit', t.helpDescExit],
    ];

    const handleCommand = (e: React.KeyboardEvent) => {
        if (e.key !== 'Enter') return;
        const raw = input.trim();
        const cmd = raw.toLowerCase();
        const [name, ...args] = cmd.split(/\s+/);
        const newHistory = [...history, <div key={Date.now() + 'cmd'} className="text-white">{siteConfig.githubUser}:~$ {input}</div>];

        let response: React.ReactNode;

        if (cmd === 'help') {
            response = (
                <div className="text-gray-400">
                    <div>&gt; {t.cmdAvailable}</div>
                    {commands.map(([command, desc]) => (
                        <div key={command} className="pl-4 text-primary">{command} <span className="text-gray-600">{desc}</span></div>
                    ))}
                </div>
            );
        } else if (cmd === 'clear') {
            setHistory([]);
            setInput('');
            return;
        } else if (name === 'ls') {
            response = (
                <div className="text-gray-400">
                    {projects.map(project => (
                        <div key={project.id}>
                            <span className="text-gray-600">drwxr-xr-x  ★{String(project.stars).padEnd(4)}</span> <span className="text-primary">{project.name}/</span>
                        </div>
                    ))}
                </div>
            );
        } else if (name === 'open' || name === 'cd') {
            const target = args.join(' ').replace(/\/$/, '');
            const project = projects.find(p => p.name.toLowerCase() === target);
            if (project) {
                openExternal(project.url);
                response = <div className="text-primary">&gt; {t.cmdOpening} {project.name}</div>;
            } else {
                response = <div className="text-red-400">&gt; {t.cmdNoSuchProject} {target || '?'}</div>;
            }
        } else if (cmd === 'matrix') {
            if (matrixEnabled) {
                setMatrixEnabled(false);
                response = <div className="text-gray-500">{t.cmdMatrixMsgOff}</div>;
            } else {
                setMatrixEnabled(true);
                response = <div className="text-green-500 font-bold">{t.cmdMatrixMsgOn}</div>;
            }
        } else if (cmd === 'neofetch' || cmd === 'sys') {
            response = getNeofetch();
        } else if (cmd === 'whoami') {
            response = <div className="text-blue-400">{t.cmdWhoami}</div>;
        } else if (name === 'sudo') {
            if (cmd.includes('please') || cmd.includes('lütfen') || cmd.includes('lutfen')) {
                response = <div className="text-yellow-400">{t.cmdSudoGranted}</div>;
            } else {
                response = <div className="text-red-500 font-bold">{t.cmdSudoDenied}</div>;
            }
        } else if (name === 'theme' || THEME_COLORS[cmd]) {
            const color = name === 'theme' ? args[0] ?? '' : cmd;
            if (THEME_COLORS[color]) {
                document.documentElement.style.setProperty('--accent', THEME_COLORS[color]);
                response = <div className="text-primary">&gt; {t.cmdThemeSet} {color.toUpperCase()}</div>;
            } else {
                response = <div className="text-red-400">&gt; {t.cmdInvalidColor}</div>;
            }
        } else if (cmd === 'contact') {
            openExternal(`https://github.com/${siteConfig.githubUser}`);
            response = <div className="text-yellow-400">&gt; {t.cmdOpenMail}</div>;
        } else if (cmd === 'reboot' || cmd === 'restart') {
            sessionStorage.removeItem('hasBooted');
            window.location.reload();
            return;
        } else if (cmd === 'exit') {
            onClose();
            return;
        } else if (cmd === '') {
            response = '';
        } else {
            response = <div className="text-red-400">&gt; {t.cmdNotFound} {raw}</div>;
        }

        if (response) newHistory.push(<div key={Date.now() + 'resp'}>{response}</div>);
        setHistory(newHistory);
        setInput('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Terminal"
                className="w-full max-w-2xl bg-[#0c0c0e] border border-primary/60 shadow-[0_0_60px_-20px_var(--color-primary)] rounded-sm relative"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-border-dark px-4 py-2 font-mono text-[11px] text-gray-500">
                    <span>{siteConfig.githubUser}@cheleby.me: ~</span>
                    <button type="button" onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-white">[esc]</button>
                </div>
                <div className="h-72 overflow-y-auto p-4 font-mono text-sm space-y-1" onClick={() => inputRef.current?.focus()}>
                    {history.map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                    <div ref={el => { el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }} />
                </div>
                <div className="flex items-center gap-2 border-t border-border-dark px-4 py-3">
                    <span className="text-primary font-bold font-mono">➜</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleCommand}
                        aria-label={t.cmdPlaceholder}
                        className="bg-transparent border-none outline-none text-white font-mono w-full focus:ring-0"
                        placeholder={t.cmdPlaceholder}
                        spellCheck={false}
                        autoComplete="off"
                        autoFocus
                    />
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
