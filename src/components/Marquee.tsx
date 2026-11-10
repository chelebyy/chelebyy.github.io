import React from 'react';
import { Language } from '../types';
import { translations } from '../constants/translations';

const Marquee: React.FC<{ lang: Language; names: string[] }> = ({ lang, names }) => {
    const text = translations[lang].marquee(names.slice(0, 12));

    return (
        <div aria-hidden="true" lang="en" className="overflow-hidden whitespace-nowrap border-b border-border-dark bg-primary py-2 text-white">
            <div className="inline-block animate-marquee font-mono text-xs font-bold uppercase tracking-[0.2em]">
                {text.repeat(4)}
            </div>
        </div>
    );
};

export default Marquee;
