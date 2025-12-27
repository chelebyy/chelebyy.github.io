import React from 'react';
import { Language } from '../types';
import { translations } from '../constants/translations';

interface SidebarProps {
    lang: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ lang }) => {
    const scrollToSection = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <aside className="hidden md:flex flex-col w-64 border-r border-border-dark bg-[#0c0c0e] sticky top-[65px] h-[calc(100vh-65px)] font-mono text-sm leading-6 select-none overflow-y-auto custom-scrollbar">
            <div className="p-6">
                <h3 className="text-gray-500 text-[10px] mb-4 uppercase tracking-widest pl-2 border-l border-primary/50">{translations[lang].directory} ~/root</h3>

                {/* Tree Structure */}
                <div className="flex flex-col text-gray-400">

                    {/* Projects Directory */}
                    <div className="relative pl-4">
                        {/* Branch line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-800"></div>

                        <div className="relative group">
                            <div className="absolute left-[-16px] top-3 w-4 h-px bg-gray-800"></div>
                            <a
                                href="#projects-section"
                                onClick={(e) => scrollToSection('projects-section', e)}
                                className="flex items-center gap-2 hover:text-white hover:bg-white/5 py-1 px-2 rounded-sm transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px] text-blue-400 group-hover:text-blue-300">folder</span>
                                <span className="group-hover:translate-x-1 transition-transform">{translations[lang].projectsLink.replace('./', '')}</span>
                            </a>
                        </div>
                    </div>

                    {/* System Directory */}
                    <div className="relative pl-4 pt-1">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-800"></div>

                        <div className="relative group">
                            <div className="absolute left-[-16px] top-3 w-4 h-px bg-gray-800"></div>
                            <div className="flex items-center gap-2 py-1 px-2 text-gray-500">
                                <span className="material-symbols-outlined text-[16px]">folder_open</span>
                                <span>system</span>
                            </div>
                        </div>

                        {/* Sub-item: Manifesto */}
                        <div className="relative pl-6 group">
                            <div className="absolute left-[-8px] top-0 bottom-1/2 w-px bg-gray-800"></div>
                            <div className="absolute left-[-8px] top-3 w-4 h-px bg-gray-800"></div>

                            <a
                                href="#manifesto-section"
                                onClick={(e) => scrollToSection('manifesto-section', e)}
                                className="flex items-center gap-2 hover:text-white hover:bg-white/5 py-1 px-2 rounded-sm transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px] text-purple-400 group-hover:text-purple-300">settings_heart</span>
                                <span className="group-hover:translate-x-1 transition-transform text-xs">
                                    {lang === 'en' ? 'modules.sys' : 'moduller.sys'}
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Logs Directory */}
                    <div className="relative pl-4 pt-1">
                        <div className="absolute left-0 top-0 bottom-1/2 w-px bg-gray-800"></div>

                        <div className="relative group">
                            <div className="absolute left-[-16px] top-3 w-4 h-px bg-gray-800"></div>
                            <div className="flex items-center gap-2 py-1 px-2 text-gray-500">
                                <span className="material-symbols-outlined text-[16px]">folder_open</span>
                                <span>var/log</span>
                            </div>
                        </div>

                        {/* Sub-item: Changelog */}
                        <div className="relative pl-6 group">
                            <div className="absolute left-[-8px] top-0 bottom-1/2 w-px bg-gray-800"></div>
                            <div className="absolute left-[-8px] top-3 w-4 h-px bg-gray-800"></div>

                            <a
                                href="#activity-section"
                                onClick={(e) => scrollToSection('activity-section', e)}
                                className="flex items-center gap-2 hover:text-white hover:bg-white/5 py-1 px-2 rounded-sm transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px] text-gray-500 group-hover:text-gray-300">terminal</span>
                                <span className="group-hover:translate-x-1 transition-transform">sys.log</span>
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer System Stats */}
            <div className="mt-auto p-6 border-t border-border-dark bg-[#0a0a0c]">
                <div className="flex flex-col gap-2 font-mono text-[10px] text-gray-600">
                    <div className="flex justify-between">
                        <span>/dev/disk1</span>
                        <span className="text-green-500">MOUNTED</span>
                    </div>
                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="w-[45%] h-full bg-primary/50"></div>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span>UPTIME</span>
                        <span>04:20:01</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
