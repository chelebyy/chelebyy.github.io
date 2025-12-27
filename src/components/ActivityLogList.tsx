import React from 'react';
import { Language, ActivityLog } from '../types';
import { translations } from '../constants/translations';

interface ActivityLogListProps {
    logs: ActivityLog[];
    lang: Language;
}

const ActivityLogList: React.FC<ActivityLogListProps> = ({ logs, lang }) => (
    <div id="activity-section" className="p-8 md:p-12">
        <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">history</span>
            {translations[lang].recentActivity}
        </h2>
        <ul className="space-y-0">
            {logs.map((log, idx) => (
                <li key={idx} className="block group">
                    <a href={log.url} target="_blank" rel="noopener noreferrer" className={`flex flex-col md:flex-row md:items-center gap-4 py-4 border-b border-dashed border-gray-800 text-sm hover:bg-white/5 px-2 -mx-2 transition-colors rounded-sm ${log.url ? 'cursor-pointer' : ''}`}>
                        <span className="font-mono text-gray-500 text-xs min-w-[120px]">{log.timestamp}</span>
                        {log.hash && (
                            <span className="font-bold text-white text-primary group-hover:text-primary whitespace-nowrap">
                                {log.type} {log.hash}
                            </span>
                        )}
                        {!log.hash && (
                            <span className="font-bold text-white text-primary group-hover:text-primary whitespace-nowrap uppercase">
                                {log.type}
                            </span>
                        )}
                        <span className="text-gray-400 truncate">{log.message}</span>
                        {log.url && <span className="hidden group-hover:inline-block material-symbols-outlined text-xs text-gray-600 ml-auto">open_in_new</span>}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

export default ActivityLogList;
