import React from 'react';
import { ActivityLog, Language } from '../types';
import { translations } from '../constants/translations';
import { shortDate } from '../lib/format';

interface ActivityLogListProps {
    logs: ActivityLog[];
    /** Uncollapsed events for the type breakdown; defaults to `logs`. */
    history?: ActivityLog[];
    lang: Language;
}

/** One colour per event type: the badge, the ref and the hover tint all read from it. */
const typeColor: Record<ActivityLog['type'], string> = {
    release: '#28c840',
    tag: '#febc2e',
    push: 'var(--color-primary-text)',
    create: '#22d3ee',
    merge: '#a97bff',
};

const typeOrder: ActivityLog['type'][] = ['push', 'merge', 'release', 'tag', 'create'];

const tint = (percent: number) => `color-mix(in oklab, var(--c) ${percent}%, transparent)`;

/** A fixed colour per repository, so lines from the same project share an accent. */
const REPO_COLORS = ['#f472b6', '#38bdf8', '#facc15', '#4ade80', '#fb923c', '#c084fc', '#2dd4bf'];

const repoColor = (repo: string): string => {
    let hash = 0;
    for (let i = 0; i < repo.length; i++) hash = (hash * 31 + repo.charCodeAt(i)) >>> 0;
    return REPO_COLORS[hash % REPO_COLORS.length];
};

/** One thin stacked bar of event types, with counts underneath; replaces a plain legend. */
const TypeBar: React.FC<{ logs: ActivityLog[]; lang: Language }> = ({ logs, lang }) => {
    const t = translations[lang];
    const counts = typeOrder
        .map(type => ({ type, count: logs.filter(log => log.type === type).length }))
        .filter(entry => entry.count > 0);

    return (
        <div className="mb-6">
            <div aria-hidden="true" className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
                {counts.map(({ type, count }) => (
                    <span key={type} style={{ flexGrow: count, backgroundColor: typeColor[type] }} />
                ))}
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-gray-500">
                {counts.map(({ type, count }) => (
                    <li key={type} className="flex items-center gap-1.5">
                        <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: typeColor[type] }} />
                        {t.activityType[type]}
                        <span className="text-gray-400">{count}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Detail: React.FC<{ log: ActivityLog }> = ({ log }) => {
    if (log.type === 'push') {
        return log.ref ? (
            <span className="truncate border border-gray-800 bg-white/[0.03] px-1.5 text-[11px] text-gray-400">
                <span aria-hidden="true" className="text-gray-600">⎇ </span>
                {log.ref}
            </span>
        ) : null;
    }
    if (log.type === 'create') return null;

    const message = log.type === 'release' && log.message !== log.ref ? log.message : '';
    if (!log.ref && !message) return null;
    return (
        <span className="min-w-0 truncate text-gray-500">
            {log.ref ? <span className="text-[var(--c)]">{log.ref}</span> : null}
            {message ? <span> {message}</span> : null}
        </span>
    );
};

const ActivityLogList: React.FC<ActivityLogListProps> = ({ logs, history = logs, lang }) => {
    const t = translations[lang];

    return (
        <section id="activity-section" aria-labelledby="activity-title" className="scroll-mt-12 px-6 py-12 md:px-10">
            <p className="mb-2 font-mono text-xs text-gray-600">
                <span className="text-primary-text">$</span> {t.recentActivity}
            </p>
            <h2 id="activity-title" className="mb-6 text-2xl font-bold tracking-tight text-white">{t.activityDir}.log</h2>

            {logs.length === 0 ? (
                <p className="font-mono text-xs text-gray-600">{t.noActivity}</p>
            ) : (
                <>
                    <TypeBar logs={history} lang={lang} />
                    <ol className="font-mono text-[13px]">
                        {logs.map(log => (
                            <li
                                key={log.id}
                                className="relative"
                                style={{ '--c': typeColor[log.type], '--r': repoColor(log.repo) } as React.CSSProperties}
                            >
                                <a
                                    href={log.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5 border-b border-dashed border-gray-800/80 py-2.5 pl-4 pr-2 md:grid-cols-[7rem_5rem_minmax(0,16rem)_minmax(0,1fr)] md:gap-y-0"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-y-1.5 left-0 w-0.5 bg-[var(--r)] opacity-60 transition-[opacity,width] duration-200 group-hover:w-1 group-hover:opacity-100 group-focus-visible:w-1 group-focus-visible:opacity-100"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                                        style={{ backgroundImage: `linear-gradient(90deg, ${tint(12)}, transparent 55%)` }}
                                    />
                                    <time dateTime={log.timestamp} className="relative text-gray-600 group-hover:text-gray-400">
                                        {shortDate(log.timestamp)}
                                    </time>
                                    <span className="relative">
                                        <span
                                            className="inline-block w-16 border px-1 py-px text-center text-[10px] uppercase tracking-wider text-[var(--c)]"
                                            style={{ borderColor: tint(40), backgroundColor: tint(10) }}
                                        >
                                            {t.activityType[log.type]}
                                        </span>
                                    </span>
                                    <span className="relative col-span-2 flex min-w-0 items-center gap-2 font-medium text-gray-100 group-hover:text-white md:col-span-1">
                                        <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-[2px] bg-[var(--r)]" />
                                        <span className="truncate">{log.repo.split('/')[1] ?? log.repo}</span>
                                    </span>
                                    <span className="relative col-span-2 flex min-w-0 items-center empty:hidden md:col-span-1 md:empty:flex">
                                        <Detail log={log} />
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ol>
                </>
            )}
        </section>
    );
};

export default ActivityLogList;
