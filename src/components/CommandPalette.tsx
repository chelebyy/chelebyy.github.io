import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { translations } from '../constants/translations';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Language;
    matrixEnabled: boolean;
    setMatrixEnabled: (enabled: boolean) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, lang, matrixEnabled, setMatrixEnabled }) => {
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

    // Neofetch ASCII Art
    const getNeofetch = () => (
        <div className="text-xs font-mono text-primary leading-tight my-2">
            <pre>{`
         /\\        OS: Digital Artifacts OS v1.0
        /  \\       Host: VITE-REACT-TS-CORE
       / /\\ \\      Kernel: 5.15.0-generic
      / /__\\ \\     Uptime: 420 days, 6 hours
     / /______\\ \\    Packages: 1337 (npm)
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
                    <div ref={el => { el?.scrollIntoView({ behavior: "smooth" }); }} />
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

export default CommandPalette;
