import React, { useEffect } from 'react';
import { Language, GitHubUser } from '../types';
import { translations } from '../constants/translations';

interface ControlPanelProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Language;
    user: GitHubUser | null;
    /** False while another overlay (the terminal) sits on top and owns the Escape key. */
    escapeEnabled?: boolean;
}

const ControlPanel = ({
    isOpen,
    onClose,
    lang,
    user,
    escapeEnabled = true
}: ControlPanelProps) => {
    const t = translations[lang];

    useEffect(() => {
        if (!isOpen || !escapeEnabled) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose, escapeEnabled]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="w-full max-w-md bg-surface-dark border border-border-dark box-shadow-primary p-6 rounded-sm relative overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Decorative Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                {/* Header */}
                <div className="flex justify-between items-center mb-8 relative z-10 border-b border-white/5 pb-4">
                    <h2 className="text-white font-bold font-mono tracking-widest uppercase flex items-center gap-2">
                        <span aria-hidden="true" className="text-primary">&gt;_</span>
                        {t.cpTitle}
                    </h2>
                    <button type="button" onClick={onClose} aria-label="Close" className="font-mono text-xs text-gray-500 hover:text-white transition-colors">
                        [esc]
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
                                <span>
                                    <span className="text-primary">{t.nfRepos}</span> {user?.public_repos || '0'}
                                </span>
                                <span>
                                    <span className="text-primary">{t.cpFollowers}</span> {user?.followers || '0'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
};

export default ControlPanel;
