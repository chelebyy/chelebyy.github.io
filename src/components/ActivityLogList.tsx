import React from 'react';
import { ActivityLog, Language } from '../types';
import { translations } from '../constants/translations';
import { shortDate } from '../lib/format';

interface ActivityLogListProps {
    logs: ActivityLog[];
    lang: Language;
}

/** One colour per event type: the graph dot, the badge and the hover tint all read from it. */
const typeColor: Record<ActivityLog['type'], string> = {
    release: '#28c840',
    tag: '#febc2e',
    push: 'var(--color-primary-text)',
    create: '#22d3ee',
    merge: '#a97bff',
};

const typeOrder: ActivityLog['type'][] = ['push', 'merge', 'release', 'tag', 'create'];

const tint = (percent: number) => `color-mix(in oklab, var(--c) ${percent}%, transparent)`;

/** Consecutive entries that share a calendar day, in the order the feed delivered them. */
const groupByDay = (logs: ActivityLog[]): { day: string; items: ActivityLog[] }[] => {
    const groups: { day: string; items: ActivityLog[] }[] = [];
    for (const log of logs) {
        const day = shortDate(log.timestamp);
        const last = groups[groups.length - 1];
        if (last && last.day === day) last.items.push(log);
        else groups.push({ day, items: [log] });
    }
    return groups;
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

const ActivityLogList: React.FC<ActivityLogListProps> = ({ logs, lang }) => {
    const t = translations[lang];
    const groups = groupByDay(logs);
    const present = typeOrder.filter(type => logs.some(log => log.type === type));

    return (
        <section id="activity-section" aria-labelledby="activity-title" className="scroll-mt-12 px-6 py-12 md:px-10">
            <p className="mb-2 font-mono text-xs text-gray-600">
                <span className="text-primary-text">$</span> {t.recentActivity}
            </p>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                <h2 id="activity-title" className="text-2xl font-bold tracking-tight text-white">{t.activityDir}.log</h2>
                {present.length > 1 && (
                    <ul aria-hidden="true" className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-gray-500">
                        {present.map(type => (
                            <li key={type} className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: typeColor[type] }} />
                                {t.activityType[type]}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {logs.length === 0 ? (
                <p className="font-mono text-xs text-gray-600">{t.noActivity}</p>
            ) : (
                <ol className="space-y-6 font-mono text-[13px]">
                    {groups.map((group, groupIndex) => (
                        <li key={`${group.day}-${groupIndex}`}>
                            <div className="mb-2 flex items-center gap-3 text-xs">
                                <span aria-hidden="true" className="h-3.5 w-3.5 shrink-0 rotate-45 border border-gray-700 bg-surface-dark" />
                                <time dateTime={group.day} className="font-semibold text-gray-400">{group.day}</time>
                                <span aria-hidden="true" className="h-px flex-1 bg-linear-to-r from-gray-800 to-transparent" />
                                <span className="text-gray-600">{group.items.length}×</span>
                            </div>

                            <ol className="relative ml-[7px] border-l border-gray-800">
                                {group.items.map(log => (
                                    <li key={log.id} className="relative" style={{ '--c': typeColor[log.type] } as React.CSSProperties}>
                                        <span
                                            aria-hidden="true"
                                            className={`absolute left-[-5px] top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full ring-4 ring-background-dark ${
                                                log.type === 'merge' ? 'border-2 border-[var(--c)] bg-background-dark' : 'bg-[var(--c)]'
                                            }`}
                                        />
                                        <a
                                            href={log.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative ml-4 flex min-w-0 items-center gap-3 overflow-hidden px-3 py-2.5 transition-colors hover:bg-white/[0.02] focus-visible:bg-white/[0.02]"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                                                style={{ backgroundImage: `linear-gradient(90deg, ${tint(12)}, transparent 55%)` }}
                                            />
                                            <span
                                                className="relative w-16 shrink-0 border px-1 py-px text-center text-[10px] uppercase tracking-wider text-[var(--c)]"
                                                style={{ borderColor: tint(40), backgroundColor: tint(10) }}
                                            >
                                                {t.activityType[log.type]}
                                            </span>
                                            <span className="relative flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                                                <span className="truncate font-medium text-gray-100 group-hover:text-white">
                                                    {log.repo.split('/')[1] ?? log.repo}
                                                </span>
                                                <Detail log={log} />
                                            </span>
                                            <span
                                                aria-hidden="true"
                                                className="relative shrink-0 text-gray-700 transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--c)]"
                                            >
                                                ↗
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
};

export default ActivityLogList;
