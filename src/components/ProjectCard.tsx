import React from 'react';
import { Language, Project } from '../types';
import { translations } from '../constants/translations';
import { languageColor, timeAgo } from '../lib/format';
import { siteConfig } from '../config/site';

interface ProjectCardProps {
    project: Project;
    lang: Language;
    index: number;
    featured?: boolean;
}

const turkishDescriptions = new Map(
    Object.entries(siteConfig.descriptionsTr).map(([name, text]) => [name.toLowerCase(), text]),
);

/** GitHub descriptions are written in English; the TR page swaps in a hand-written translation when one exists. */
const projectDescription = (project: Project, lang: Language): string =>
    (lang === 'tr' && turkishDescriptions.get(project.name.toLowerCase())) || project.description;

/** One project rendered as an `ls -la` entry that expands into a card on hover/focus. */
const ProjectCard: React.FC<ProjectCardProps> = ({ project, lang, index, featured = false }) => {
    const t = translations[lang];
    const tags = project.topics.slice(0, 4);
    const description = projectDescription(project, lang);
    const accent = project.language ? languageColor(project.language) : 'var(--color-primary)';

    return (
        <li
            className={`group relative border-b border-border-dark transition-colors hover:bg-white/[0.035] focus-within:bg-white/[0.035] ${featured ? 'bg-primary/[0.06]' : ''}`}
            style={{ '--lang': accent } as React.CSSProperties}
        >
            <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-0.5 bg-[var(--lang)] opacity-50 transition-[opacity,width] duration-300 group-hover:w-1 group-hover:opacity-100 group-focus-within:w-1 group-focus-within:opacity-100"
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
                style={{ backgroundImage: 'linear-gradient(90deg, color-mix(in oklab, var(--lang) 9%, transparent), transparent 45%)' }}
            />
            <div className="relative grid gap-x-6 gap-y-3 px-6 py-6 md:grid-cols-[3.5rem_minmax(0,1fr)_auto] md:px-10">
                <div className="hidden pt-1 font-mono text-xs text-gray-600 transition-colors group-hover:text-[var(--lang)] md:block">
                    {String(index + 1).padStart(2, '0')}
                </div>

                <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className={`font-semibold tracking-tight text-white ${featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="outline-none after:absolute after:inset-0 group-hover:text-primary">
                                {project.name}
                            </a>
                        </h3>
                        {featured && (
                            <span className="border border-primary/50 bg-primary/10 px-1.5 font-mono text-[10px] uppercase tracking-wider text-primary">{t.featured}</span>
                        )}
                        {project.archived && (
                            <span className="border border-yellow-700/50 px-1.5 font-mono text-[10px] uppercase text-yellow-600">{t.archived}</span>
                        )}
                        {project.fork && <span className="font-mono text-[10px] uppercase text-gray-600">fork</span>}
                    </div>
                    <p className={`mt-2 max-w-3xl text-[15px] leading-relaxed ${description ? 'text-gray-400' : 'italic text-gray-600'}`}>
                        {description || t.noDescription}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-gray-500">
                        {project.language && (
                            <span className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
                                {project.language}
                            </span>
                        )}
                        {project.license && <span>{project.license}</span>}
                        <span>{t.updated} {timeAgo(project.pushedAt, lang)}</span>
                        {tags.map(tag => (
                            <span key={tag} className="text-gray-600">#{tag}</span>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 flex items-start gap-4 font-mono text-xs md:flex-col md:items-end md:gap-2">
                    {project.forks > 0 && <span className="text-gray-600" title="Forks">⑂ {project.forks}</span>}
                    {project.homepage && (
                        <a
                            href={project.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-border-dark px-2 py-0.5 text-gray-400 transition-colors hover:border-primary hover:text-white"
                        >
                            {t.demo} ↗
                        </a>
                    )}
                </div>
            </div>
        </li>
    );
};

export default ProjectCard;
