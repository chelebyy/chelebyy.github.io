import React from 'react';
import { Language } from '../types';
import { translations } from '../constants/translations';
import { siteConfig } from '../config/site';
import GitHubMark from './GitHubMark';

interface HeaderProps {
    lang: Language;
    setLang: (l: Language) => void;
    onOpenControlPanel: () => void;
    onOpenTerminal: () => void;
}


const Header: React.FC<HeaderProps> = ({ lang, setLang, onOpenControlPanel, onOpenTerminal }) => {
    const t = translations[lang];

    return (
        <header className="sticky top-0 z-50 border-b border-border-dark bg-background-dark/85 backdrop-blur-md">
            <div className="mx-auto flex h-12 max-w-[1440px] items-center gap-4 px-4 font-mono text-xs md:px-6">
                <button
                    type="button"
                    onClick={onOpenControlPanel}
                    title="System control"
                    className="group flex min-w-0 items-center gap-3 text-left"
                >
                    <span aria-hidden="true" className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80 transition-colors group-hover:bg-[#ff5f57]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80 transition-colors group-hover:bg-[#febc2e]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80 transition-colors group-hover:bg-[#28c840]" />
                    </span>
                    <span className="truncate text-gray-300">
                        <span className="text-primary">{t.terminal}</span>
                        <span className="text-gray-600">:</span>
                        <span className="text-gray-400">{t.path}</span>
                        <span className="text-gray-600">$</span>
                    </span>
                </button>

                <nav className="ml-auto flex items-center gap-2 md:gap-3">
                    <div className="flex items-center border border-border-dark" role="group" aria-label="Language">
                        {(['en', 'tr'] as const).map(code => (
                            <button
                                key={code}
                                type="button"
                                onClick={() => setLang(code)}
                                aria-pressed={lang === code}
                                className={`px-2.5 py-1 uppercase transition-colors ${lang === code ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                {code}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={onOpenTerminal}
                        className="hidden items-center gap-2 border border-border-dark px-2.5 py-1 text-gray-300 transition-colors hover:border-primary hover:text-white sm:flex"
                    >
                        <span>&gt;_ {t.openTerminal}</span>
                        <kbd className="text-[10px] text-gray-600">Ctrl K</kbd>
                    </button>
                    <a
                        href={`https://github.com/${siteConfig.githubUser}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="flex h-7 w-7 items-center justify-center border border-border-dark text-gray-400 transition-colors hover:border-primary hover:text-white"
                    >
                        <GitHubMark />
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
