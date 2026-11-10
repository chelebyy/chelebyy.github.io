import React from 'react';
import { GitHubUser, Language, Project } from '../types';
import { translations } from '../constants/translations';
import { languageBreakdown } from '../lib/github';
import { languageColor, timeAgo } from '../lib/format';
import { siteConfig } from '../config/site';

interface HeroProps {
    lang: Language;
    user: GitHubUser | null;
    projects: Project[];
    syncedAt: number | null;
    loading: boolean;
    onInit: () => void;
    onOpenLogs: () => void;
}

const LOGO = [
    '   ▄▄▄▄▄▄▄   ',
    ' ▄█▀     ▀█▄ ',
    ' █   ▄▄▄   █ ',
    ' █  █   ▀▀ █ ',
    ' █   ▀▀▀   █ ',
    ' ▀█▄     ▄█▀ ',
    '   ▀▀▀▀▀▀▀   ',
];

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex gap-3">
        <dt className="w-24 shrink-0 text-primary">{label}</dt>
        <dd className="min-w-0 truncate text-gray-300">{children}</dd>
    </div>
);

const NeofetchPanel: React.FC<Omit<HeroProps, 'onInit' | 'onOpenLogs'>> = ({ lang, user, projects, syncedAt, loading }) => {
    const t = translations[lang];
    const login = user?.login ?? siteConfig.githubUser;
    const languages = languageBreakdown(projects);
    const lastPush = projects[0]?.pushedAt;
    const placeholder = loading ? '…' : '—';

    return (
        <div className="relative border border-border-dark bg-[#0c0d12] font-mono text-xs shadow-[0_0_0_1px_rgba(0,0,0,0.6),0_30px_80px_-30px_rgba(79,107,255,0.35)]">
            <div className="flex items-center justify-between border-b border-border-dark px-4 py-2 text-[11px] text-gray-500">
                <span>neofetch</span>
                <span>{syncedAt ? `${t.nfSynced} ${timeAgo(syncedAt, lang)}` : placeholder}</span>
            </div>
            <div className="scanlines grid gap-6 p-5 sm:grid-cols-[auto_1fr]">
                <pre aria-hidden="true" className="hidden select-none leading-[1.15] text-primary sm:block">{LOGO.join('\n')}</pre>
                <div className="min-w-0">
                    <p className="text-sm text-primary">{login}</p>
                    <p className="mb-3 text-gray-700">{'-'.repeat(login.length)}</p>
                    <dl className="space-y-1">
                        <Row label={t.nfRepos}>{projects.length || placeholder}</Row>
                        <Row label={t.nfLastPush}>{lastPush ? timeAgo(lastPush, lang) : placeholder}</Row>
                        <Row label={t.nfLocation}>{t.nfLocationValue}</Row>
                        <Row label={t.nfLicense}>{t.nfLicenseValue}</Row>
                    </dl>
                    {languages.length > 0 && (
                        <div className="mt-4">
                            <p className="mb-2 text-primary">{t.nfLanguages}</p>
                            <div className="flex h-1.5 w-full overflow-hidden bg-white/5" aria-hidden="true">
                                {languages.map(entry => (
                                    <span key={entry.language} style={{ width: `${entry.share * 100}%`, backgroundColor: languageColor(entry.language) }} />
                                ))}
                            </div>
                            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-gray-400">
                                {languages.map(entry => (
                                    <li key={entry.language} className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: languageColor(entry.language) }} />
                                        {entry.language} <span className="text-gray-600">{Math.round(entry.share * 100)}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="mt-4 flex gap-1" aria-hidden="true">
                        {['#4f6bff', '#ff5f57', '#febc2e', '#28c840', '#a97bff', '#89e051', '#e5e7eb', '#374151'].map(color => (
                            <span key={color} className="h-3 w-5" style={{ backgroundColor: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Hero: React.FC<HeroProps> = (props) => {
    const { lang, onInit, onOpenLogs } = props;
    const t = translations[lang];

    return (
        <section className="relative overflow-hidden border-b border-border-dark">
            <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                    maskImage: 'radial-gradient(ellipse at 30% 40%, black 30%, transparent 75%)',
                }}
            />
            <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-6 py-16 md:px-12 md:py-24 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-16">
                <div className="flex flex-col gap-7">
                    <p className="font-mono text-sm text-gray-500">
                        <span className="text-primary">$</span> {t.systemReady}
                    </p>

                    <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl xl:text-[84px]">
                        <span className="hover-shake block w-fit">{t.heroLine1}</span>
                        <span className="hover-shake block w-fit text-gray-500">{t.heroLine2}</span>
                        <span className="caret block w-fit text-primary">
                            <span className="mr-3 font-mono text-[0.6em] align-middle text-gray-600">&gt;</span>
                            {t.heroLine3}
                        </span>
                    </h1>

                    <p className="max-w-xl whitespace-pre-line border-l border-primary/60 pl-5 font-mono text-sm leading-7 text-gray-400 md:text-[15px]">
                        {t.heroSub}
                    </p>

                    <div className="flex flex-col gap-3 font-mono text-sm sm:flex-row">
                        <button
                            type="button"
                            onClick={onInit}
                            className="group flex h-11 items-center justify-center gap-3 bg-white px-5 text-black transition-colors hover:bg-primary hover:text-white"
                        >
                            {t.initBtn}
                            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                        </button>
                        <button
                            type="button"
                            onClick={onOpenLogs}
                            className="flex h-11 items-center justify-center border border-border-dark px-5 text-gray-300 transition-colors hover:border-primary hover:text-white"
                        >
                            {t.readLogsBtn}
                        </button>
                    </div>
                </div>

                <NeofetchPanel {...props} />
            </div>
        </section>
    );
};

export default Hero;
