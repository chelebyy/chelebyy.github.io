import React from 'react';
import { Language } from '../types';
import { translations } from '../constants/translations';
import { siteConfig } from '../config/site';
import GitHubMark from './GitHubMark';

const Footer: React.FC<{ lang: Language }> = ({ lang }) => {
    const t = translations[lang];
    const profile = `https://github.com/${siteConfig.githubUser}`;

    return (
        <footer className="border-t border-border-dark bg-background-dark">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-5 font-mono text-[11px] text-gray-600 md:flex-row md:items-center md:justify-between">
                <p>
                    © {new Date().getFullYear()} {siteConfig.githubUser} <span className="text-gray-800">·</span> {t.footerBuilt}
                </p>
                <div className="flex items-center gap-4">
                    <a href={`${profile}/chelebyy.github.io`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                        {t.footerSource} ↗
                    </a>
                    <a href={profile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                        <GitHubMark className="h-3.5 w-3.5" /> @{siteConfig.githubUser}
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
