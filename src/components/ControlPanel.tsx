import React from 'react';
import { Language, GitHubUser } from '../types';
import { translations } from '../constants/translations';

interface ControlPanelProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Language;
    crtEnabled: boolean;
    setCrtEnabled: (enabled: boolean) => void;
    user: GitHubUser;
}

const ControlPanel = ({
    isOpen,
    onClose,
    lang,
    crtEnabled,
    setCrtEnabled,
    user
}: ControlPanelProps) => {
    const t = translations[lang];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="w-full max-w-md bg-[#0c0c0e] border border-border-dark box-shadow-primary p-6 rounded-sm relative overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Decorative Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                {/* Header */}
                <div className="flex justify-between items-center mb-8 relative z-10 border-b border-white/5 pb-4">
                    <h2 className="text-white font-bold font-mono tracking-widest uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                        {t.cpTitle}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Identity Module */}
                <div className="mb-8 relative z-10">
                    <h3 className="text-xs text-gray-500 font-mono uppercase mb-4 pl-2 border-l-2 border-primary">{t.cpIdentity}</h3>

                    <div className="flex items-center gap-6 bg-white/5 p-4 rounded-sm border border-white/5 hover:border-primary/30 transition-colors">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700">
                                <img
                                    src={user?.avatar_url || 'https://github.com/chelebyy.png'}
                                    alt="Avatar"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-black"></div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold text-lg leading-none mb-1">@{user?.login || 'chelebyy'}</h4>
                            <p className="text-gray-400 text-xs font-mono mb-2">{user?.bio || 'Full Stack Developer'}</p>

                            <div className="flex gap-4 text-xs font-mono text-gray-500">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">folder</span>
                                    {user?.public_repos || '0'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">group</span>
                                    {user?.followers || '0'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Settings */}
                <div className="relative z-10">
                    <h3 className="text-xs text-gray-500 font-mono uppercase mb-4 pl-2 border-l-2 border-primary">{t.cpSettings}</h3>

                    <div className="flex flex-col gap-3">
                        <label className="flex items-center justify-between p-3 bg-white/5 rounded-sm hover:bg-white/10 cursor-pointer transition-colors group">
                            <span className="text-gray-300 font-mono text-sm group-hover:text-white">{t.cpCrtEffect}</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={crtEnabled}
                                    onChange={(e) => setCrtEnabled(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Footer info */}
                <div className="mt-8 text-center">
                    <p className="text-[10px] text-gray-600 font-mono uppercase">System Integrity: 100% // Secure Connection</p>
                </div>
            </div>
        </div>

    );
};

export default ControlPanel;
