import React from 'react';
import { Language } from '../types';
import { translations } from '../constants/translations';

const Marquee = ({ lang }: { lang: Language }) => (
    <div className="bg-primary text-white py-3 overflow-hidden whitespace-nowrap border-b border-border-dark">
        <div className="animate-marquee inline-block font-mono text-sm font-bold tracking-widest uppercase">
            {translations[lang].marquee}{translations[lang].marquee}
        </div>
    </div>
);

export default Marquee;
