import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../constants/translations';

interface HeaderProps {
    lang: Language;
    setLang: (l: Language) => void;
    onOpenControlPanel: () => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, onOpenControlPanel }) => {
    const [displayText, setDisplayText] = useState('');

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

export default Header;
