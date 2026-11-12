import React from 'react';
import { ActivityLog, Language } from '../types';
import { translations } from '../constants/translations';
import { shortDate } from '../lib/format';

interface ActivityLogListProps {
    logs: ActivityLog[];
    lang: Language;
}

const typeColor: Record<ActivityLog['type'], string> = {
    release: 'text-[#28c840]',
    tag: 'text-[#febc2e]',
    push: 'text-primary-text',
    create: 'text-[#a97bff]',
    merge: 'text-[#a97bff]',
};

const ActivityLogList: React.FC<ActivityLogListProps> = ({ logs, lang }) => {
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
                <ol className="font-mono text-[13px]">
                    {logs.map(log => (
                        <li key={log.id}>
                            <a
                                href={log.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 border-b border-dashed border-gray-800/80 py-2.5 transition-colors hover:bg-white/[0.03] md:grid-cols-[7rem_5rem_minmax(0,16rem)_minmax(0,1fr)] md:gap-y-0"
                            >
                                <time dateTime={log.timestamp} className="text-gray-600">{shortDate(log.timestamp)}</time>
                                <span className={typeColor[log.type]}>{t.activityType[log.type]}</span>
                                <span className="col-span-2 truncate text-gray-200 group-hover:text-white md:col-span-1">{log.repo.split('/')[1] ?? log.repo}</span>
                                <span className="col-span-2 truncate text-gray-500 empty:hidden md:col-span-1 md:empty:block">
                                    {log.ref && log.type !== 'push' && log.type !== 'create' ? <span className="text-gray-400">{log.ref} </span> : null}
                                    {log.type === 'release' && log.message !== log.ref ? log.message : log.type === 'push' && log.ref ? `→ ${log.ref}` : ''}
                                </span>
                            </a>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
};

export default ActivityLogList;
