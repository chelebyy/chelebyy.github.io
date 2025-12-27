import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../constants/translations';

const SystemMonitor = ({ lang }: { lang: Language }) => {
    const t = translations[lang];
    // Initial state for modules with "random" usage
    const [modules, setModules] = useState([
        { id: 1024, name: 'REACT_CORE_V19.dll', usage: 98, statusKey: 'statusRunning', color: 'text-blue-400' },
        { id: 2048, name: 'TYPESCRIPT_COMPILER.exe', usage: 90, statusKey: 'statusOptimized', color: 'text-blue-500' },
        { id: 3301, name: 'OPNSENSE_FIREWALL.sys', usage: 85, statusKey: 'statusFiltering', color: 'text-orange-400' },
        { id: 4100, name: 'DOCKER_ENGINE.svc', usage: 92, statusKey: 'statusContainerized', color: 'text-blue-300' },
        { id: 5021, name: 'ADGUARD_DNS_SINK.net', usage: 88, statusKey: 'statusBlocking', color: 'text-green-400' },
        { id: 6606, name: 'AI_NEURAL_NET.model', usage: 99, statusKey: 'statusLearning', color: 'text-purple-400' },
        { id: 7001, name: 'PROXMOX_VE_HOST.iso', usage: 95, statusKey: 'statusVirtualized', color: 'text-orange-500' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setModules(prev => prev.map(m => ({
                ...m,
                usage: Math.min(100, Math.max(20, m.usage + (Math.random() * 6 - 3))) // Fluctuate +/- 3%
            })));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div id="manifesto-section" className="border-b border-border-dark p-6 md:p-12 w-full bg-[#050505] relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <h2 className="text-white text-xl font-bold mb-8 flex items-center gap-3 relative z-10">
                <span className="material-symbols-outlined text-primary animate-spin-slow">settings_heart</span>
                {t.sysMonitorTitle}
                <span className="text-xs font-mono text-gray-500 ml-auto hidden md:block">{t.sysCpuLoad}</span>
            </h2>

            <div className="w-full overflow-x-auto relative z-10 custom-scrollbar pb-2">
                <table className="w-full min-w-[600px] md:min-w-0 font-mono text-xs md:text-sm text-left border-collapse">
                    <thead>
                        <tr className="text-gray-500 border-b border-gray-800">
                            <th className="py-2 px-4 uppercase tracking-wider hidden md:table-cell">{t.sysPid}</th>
                            <th className="py-2 px-4 uppercase tracking-wider whitespace-nowrap">{t.sysModuleName}</th>
                            <th className="py-2 px-4 uppercase tracking-wider w-1/3 whitespace-nowrap">{t.sysUsage}</th>
                            <th className="py-2 px-4 uppercase tracking-wider text-right whitespace-nowrap">{t.sysStatus}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modules.map((m) => (
                            <tr key={m.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors group">
                                <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{m.id}</td>
                                <td className={`py-3 px-4 ${m.color} font-bold group-hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-shadow whitespace-nowrap`}>{m.name}</td>
                                <td className="py-3 px-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-full h-2 bg-gray-800 rounded-sm overflow-hidden min-w-[60px]">
                                            <div
                                                className={`h-full ${m.id === 6606 ? 'bg-purple-500' : 'bg-primary'} transition-all duration-700 ease-out`}
                                                style={{ width: `${m.usage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-gray-400 w-8 text-right">{Math.round(m.usage)}%</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                    <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] bg-white/5 border border-white/10 ${m.statusKey === 'statusRunning' ? 'text-green-400' : m.statusKey === 'statusLearning' ? 'text-purple-400 animate-pulse' : 'text-primary'}`}>
                                        [{t[m.statusKey as keyof typeof t]}]
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SystemMonitor;
