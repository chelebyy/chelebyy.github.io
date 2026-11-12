import React from 'react';
import { Language, Project } from '../types';
import { translations } from '../constants/translations';
import { GitHubDataStatus } from '../hooks/useGitHubData';
import ProjectCard from './ProjectCard';
import { isFeatured } from '../config/site';

interface ProjectListProps {
    lang: Language;
    status: GitHubDataStatus;
    projects: Project[];
    total: number;
    query: string;
    onQueryChange: (query: string) => void;
    languages: Array<{ language: string; count: number }>;
    selectedLanguage: string | null;
    onSelectLanguage: (language: string | null) => void;
    onRetry: () => void;
}

/** `tall` keeps the loading state, and the error or empty state that may replace it, at least a
 *  screen high, so the sections below stay off-screen and nothing visible moves (layout shift). */
const Notice: React.FC<{ children: React.ReactNode; tall?: boolean }> = ({ children, tall = false }) => (
    <div className={`flex flex-col items-center gap-4 border-b border-border-dark px-6 py-16 text-center font-mono text-sm text-gray-500 ${tall ? 'min-h-svh justify-start pt-24' : 'min-h-[240px] justify-center'}`}>
        {children}
    </div>
);

const ProjectList: React.FC<ProjectListProps> = ({
    lang, status, projects, total, query, onQueryChange, languages, selectedLanguage, onSelectLanguage, onRetry,
}) => {
    const t = translations[lang];

    return (
        <section id="projects-section" aria-labelledby="projects-title" className="scroll-mt-12">
            <div className="flex flex-col gap-5 border-b border-border-dark px-6 py-8 md:flex-row md:items-end md:justify-between md:px-10">
                <div>
                    <p className="mb-2 font-mono text-xs text-gray-600">
                        <span className="text-primary-text">$</span> {t.indexOf}
                    </p>
                    <h2 id="projects-title" className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                        {t.projectsDir}
                        <span className="ml-3 align-middle font-mono text-sm font-normal text-gray-600">{t.listing(projects.length, total)}</span>
                    </h2>
                </div>
                <label className="flex w-full items-center gap-1 border-b border-border-dark pb-1 font-mono text-sm focus-within:border-primary md:w-72">
                    <span className="sr-only">{t.searchLabel}</span>
                    <span aria-hidden="true" className="whitespace-pre text-gray-600">{t.grepPlaceholder}</span>
                    <input
                        type="search"
                        value={query}
                        onChange={event => onQueryChange(event.target.value)}
                        spellCheck={false}
                        autoComplete="off"
                        className="w-full bg-transparent text-white outline-none placeholder:text-gray-600"
                        placeholder="…"
                    />
                </label>
            </div>

            {languages.length > 0 && (
                <div className="overflow-x-auto border-b border-border-dark px-6 py-3 [scrollbar-width:none] md:hidden">
                    <div className="flex min-w-max gap-1 font-mono text-[11px]" role="group" aria-label={t.languageFilter}>
                        {[null, ...languages.map(entry => entry.language)].map(language => (
                            <button
                                key={language ?? 'all'}
                                type="button"
                                aria-pressed={selectedLanguage === language}
                                onClick={() => onSelectLanguage(language)}
                                className={`border px-2.5 py-1 lowercase ${selectedLanguage === language ? 'border-primary/60 bg-primary/10 text-white' : 'border-border-dark text-gray-500'}`}
                            >
                                {language ?? t.allLanguages}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {status === 'loading' && (
                <Notice tall>
                    <span className="caret">{t.loading}</span>
                </Notice>
            )}

            {status === 'error' && (
                <Notice tall>
                    <p className="max-w-md text-gray-400">{t.loadError}</p>
                    <div className="flex gap-3">
                        <button type="button" onClick={onRetry} className="border border-border-dark px-3 py-1 text-gray-300 hover:border-primary hover:text-white">
                            {t.retry}
                        </button>
                        <a href="https://github.com/chelebyy?tab=repositories" target="_blank" rel="noopener noreferrer" className="border border-border-dark px-3 py-1 text-gray-300 hover:border-primary hover:text-white">
                            {t.openOnGitHub} ↗
                        </a>
                    </div>
                </Notice>
            )}

            {status === 'ready' && total === 0 && <Notice tall>{t.emptyList}</Notice>}
            {status === 'ready' && total > 0 && projects.length === 0 && <Notice>{t.noMatches}</Notice>}

            {status === 'ready' && projects.length > 0 && (
                // The unfiltered list keeps the loading state's height, so a short list does not
                // pull the sections below up into view when it replaces the loading notice.
                <ul className={!query && selectedLanguage === null ? 'min-h-svh' : undefined}>
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} lang={lang} index={index} featured={isFeatured(project.name)} />
                    ))}
                </ul>
            )}
        </section>
    );
};

export default ProjectList;
