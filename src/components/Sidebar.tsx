import React from 'react';
import { Language } from '../types';
import { translations } from '../constants/translations';
import { languageColor } from '../lib/format';

interface SidebarProps {
    lang: Language;
    languages: Array<{ language: string; count: number }>;
    total: number;
    selectedLanguage: string | null;
    onSelectLanguage: (language: string | null) => void;
    activityCount: number;
    secretUnlocked: boolean;
}

const scrollTo = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Branch: React.FC<{ last?: boolean; children: React.ReactNode }> = ({ last, children }) => (
    <li className="relative pl-5">
        <span aria-hidden="true" className={`absolute left-0 top-0 w-px bg-gray-800 ${last ? 'h-3.5' : 'h-full'}`} />
        <span aria-hidden="true" className="absolute left-0 top-3.5 h-px w-3.5 bg-gray-800" />
        {children}
    </li>
);

const Sidebar: React.FC<SidebarProps> = ({ lang, languages, total, selectedLanguage, onSelectLanguage, activityCount, secretUnlocked }) => {
    const t = translations[lang];
    const item = (active: boolean) =>
        `flex w-full items-center justify-between gap-2 px-2 py-0.5 text-left transition-colors ${active ? 'bg-primary/15 text-white' : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'}`;

    return (
        <aside className="hidden w-64 shrink-0 border-r border-border-dark bg-linear-to-b from-surface-dark via-background-dark to-background-dark md:block">
            <div className="sticky top-12 max-h-[calc(100vh-3rem)] overflow-y-auto p-6 font-mono text-[13px] leading-7">
                <p className="mb-4 border-l border-primary/60 pl-2 text-[10px] uppercase tracking-[0.2em] text-gray-600">
                    {t.directory} ~/
                </p>
                <ul>
                    <Branch>
                        <a href="#projects-section" onClick={scrollTo('projects-section')} className="text-gray-200 hover:text-primary">
                            {t.projectsDir}/
                        </a>
                        {/* Until GitHub answers there are no languages yet; hold room for "all" plus
                            four languages (measured 128px) so the entries below do not jump. */}
                        <ul aria-label={t.languageFilter} className={languages.length === 0 ? 'min-h-32' : undefined}>
                            <Branch last={languages.length === 0}>
                                <button type="button" aria-pressed={selectedLanguage === null} onClick={() => onSelectLanguage(null)} className={item(selectedLanguage === null)}>
                                    <span>{t.allLanguages}</span>
                                    <span className="text-[11px] text-gray-600">{total}</span>
                                </button>
                            </Branch>
                            {languages.map((entry, index) => (
                                <Branch key={entry.language} last={index === languages.length - 1}>
                                    <button
                                        type="button"
                                        aria-pressed={selectedLanguage === entry.language}
                                        onClick={() => onSelectLanguage(entry.language)}
                                        className={item(selectedLanguage === entry.language)}
                                    >
                                        <span className="flex min-w-0 items-center gap-2">
                                            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: languageColor(entry.language) }} />
                                            <span className="truncate lowercase">{entry.language}</span>
                                        </span>
                                        <span className="text-[11px] text-gray-600">{entry.count}</span>
                                    </button>
                                </Branch>
                            ))}
                        </ul>
                    </Branch>
                    <Branch>
                        <a href="#activity-section" onClick={scrollTo('activity-section')} className="flex justify-between text-gray-200 hover:text-primary">
                            <span>{t.activityDir}.log</span>
                            <span className="text-[11px] text-gray-600">{activityCount}</span>
                        </a>
                    </Branch>
                    <Branch last>
                        <a href="#secret-section" onClick={scrollTo('secret-section')} className={secretUnlocked ? 'gs-secret' : 'text-gray-600 hover:text-gray-400'}>
                            {t.secretName}
                        </a>
                    </Branch>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
