import React from 'react';
import { ActivityLog, Language } from '../types';
import { translations } from '../constants/translations';
import { shortDate } from '../lib/format';

interface ActivityLogListProps {
    logs: ActivityLog[];
    /** Uncollapsed events for the heatmap and type bar; defaults to `logs`. */
    history?: ActivityLog[];
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

/** A fixed colour per repository, so events from the same project share a rail colour. */
const REPO_COLORS = ['#f472b6', '#38bdf8', '#facc15', '#4ade80', '#fb923c', '#c084fc', '#2dd4bf'];

const repoColor = (repo: string): string => {
    let hash = 0;
    for (let i = 0; i < repo.length; i++) hash = (hash * 31 + repo.charCodeAt(i)) >>> 0;
    return REPO_COLORS[hash % REPO_COLORS.length];
};

const DAY_MS = 86_400_000;
const HEATMAP_DAYS = 90;

/** GitHub-style grid of the last 90 days: each cell takes the colour of that day's most frequent event type. */
const Heatmap: React.FC<{ logs: ActivityLog[]; lang: Language }> = ({ logs, lang }) => {
    const byDay = new Map<string, Partial<Record<ActivityLog['type'], number>>>();
    for (const log of logs) {
        const day = shortDate(log.timestamp);
        const counts = byDay.get(day) ?? {};
        counts[log.type] = (counts[log.type] ?? 0) + 1;
        byDay.set(day, counts);
    }

    const now = new Date();
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const first = today - (HEATMAP_DAYS - 1) * DAY_MS;
    // Start the grid on the Monday on or before the first day so every column is one week.
    const start = first - ((new Date(first).getUTCDay() + 6) % 7) * DAY_MS;
    const cells: { day: string; color?: string; total: number; inRange: boolean }[] = [];
    for (let time = start; time <= today; time += DAY_MS) {
        const day = new Date(time).toISOString().slice(0, 10);
        const counts = byDay.get(day) ?? {};
        const entries = Object.entries(counts) as [ActivityLog['type'], number][];
        const total = entries.reduce((sum, [, n]) => sum + n, 0);
        const top = entries.sort((a, b) => b[1] - a[1])[0]?.[0];
        cells.push({ day, total, color: top ? typeColor[top] : undefined, inRange: time >= first });
    }
    const shown = cells.filter(cell => cell.inRange && cell.total > 0);
    const label = translations[lang].activitySummary(shown.reduce((sum, cell) => sum + cell.total, 0), shown.length);

    return (
        <div role="img" aria-label={label} className="mb-6 overflow-x-auto">
            <div aria-hidden="true" className="grid w-max grid-flow-col grid-rows-7 gap-[3px]">
                {cells.map(cell => (
                    <span
                        key={cell.day}
                        title={cell.inRange ? `${cell.day} · ${cell.total}` : undefined}
                        className={`h-2.5 w-2.5 rounded-[2px] ${cell.inRange ? 'bg-white/[0.05]' : 'invisible'}`}
                        style={
                            cell.color
                                ? { backgroundColor: `color-mix(in oklab, ${cell.color} ${Math.min(40 + cell.total * 15, 100)}%, transparent)` }
                                : undefined
                        }
                    />
                ))}
            </div>
        </div>
    );
};

/** One thin stacked bar of event types, with counts underneath; replaces a plain legend. */
const TypeBar: React.FC<{ logs: ActivityLog[]; lang: Language }> = ({ logs, lang }) => {
    const t = translations[lang];
    const counts = typeOrder
        .map(type => ({ type, count: logs.filter(log => log.type === type).length }))
        .filter(entry => entry.count > 0);

    return (
        <div className="mb-8">
            <div aria-hidden="true" className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
                {counts.map(({ type, count }) => (
                    <span key={type} style={{ flexGrow: count, backgroundColor: typeColor[type] }} />
                ))}
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-gray-500">
                {counts.map(({ type, count }) => (
                    <li key={type} className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: typeColor[type] }} />
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
    const groups = groupByDay(logs);

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
                <Heatmap logs={history} lang={lang} />
                <TypeBar logs={history} lang={lang} />
                <ol className="space-y-6 font-mono text-[13px]">
                    {groups.map((group, groupIndex) => (
                        <li key={`${group.day}-${groupIndex}`}>
                            <div className="mb-2 flex items-center gap-3 text-xs">
                                <span aria-hidden="true" className="h-3.5 w-3.5 shrink-0 rotate-45 border border-gray-700 bg-surface-dark" />
                                <time dateTime={group.day} className="font-semibold text-gray-400">{group.day}</time>
                                <span aria-hidden="true" className="h-px flex-1 bg-linear-to-r from-gray-800 to-transparent" />
                                <span className="text-gray-600">{group.items.length}×</span>
                            </div>

                            <ol className="relative ml-[7px]">
                                {group.items.map(log => (
                                    <li key={log.id} className="relative border-l-2" style={{ '--c': typeColor[log.type], '--r': repoColor(log.repo), borderColor: `color-mix(in oklab, ${repoColor(log.repo)} 75%, transparent)` } as React.CSSProperties}>
                                        <span
                                            aria-hidden="true"
                                            className={`absolute left-[-5.5px] top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full ring-4 ring-background-dark ${
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
                                                <span className="flex min-w-0 items-center gap-2 font-medium text-gray-100 group-hover:text-white">
                                                    <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-[2px] bg-[var(--r)]" />
                                                    <span className="truncate">{log.repo.split('/')[1] ?? log.repo}</span>
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
                </>
            )}
        </section>
    );
};

export default ActivityLogList;
