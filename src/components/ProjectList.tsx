import React from 'react';
import { Language, Project } from '../types';
import { translations } from '../constants/translations';
import { GitHubDataStatus } from '../hooks/useGitHubData';
import ProjectCard from './ProjectCard';

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

const Notice: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 border-b border-border-dark px-6 py-16 text-center font-mono text-sm text-gray-500">
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
                        <span className="text-primary">$</span> {t.indexOf}
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
                        className="w-full bg-transparent text-white outline-none placeholder:text-gray-700"
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
                <Notice>
                    <span className="caret">{t.loading}</span>
                </Notice>
            )}

            {status === 'error' && (
                <Notice>
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

            {status === 'ready' && total === 0 && <Notice>{t.emptyList}</Notice>}
            {status === 'ready' && total > 0 && projects.length === 0 && <Notice>{t.noMatches}</Notice>}

            {status === 'ready' && projects.length > 0 && (
                <ul>
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} lang={lang} index={index} />
                    ))}
                </ul>
            )}
        </section>
    );
};

export default ProjectList;
