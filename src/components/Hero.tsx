import React from 'react';
import CyberTerminal from './CyberTerminal';
import CyberMap from './CyberMap';
import { Language } from '../types';
import { translations } from '../constants/translations';

interface HeroProps {
    lang: Language;
    onInit: () => void;
    onOpenLogs: () => void;
}

const Hero: React.FC<HeroProps> = ({ lang, onInit, onOpenLogs }) => (
    <section className="border-b border-border-dark bg-surface-dark relative overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center">
        <CyberTerminal />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="px-6 md:px-12 py-12 md:py-24 flex flex-col md:flex-row max-w-[1440px] mx-auto relative z-10 gap-12 items-center w-full">
            <div className="flex flex-col gap-6 flex-1 w-full">
                <div className="inline-flex items-center gap-2 text-primary font-mono text-sm mb-2 md:mb-4">
                    <span className="animate-pulse">_</span> {translations[lang].systemReady}
                </div>
                <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-black leading-[0.95] md:leading-[0.9] tracking-[-0.04em] uppercase">
                    <span className="block hover-shake inline-block cursor-none">{translations[lang].heroLine1}</span><br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 hover:text-primary transition-colors duration-100 cursor-none hover-shake inline-block">{translations[lang].heroLine2}</span><br />
                    <span className="pl-4 md:pl-46 block text-primary">{translations[lang].heroLine3}</span>
                </h1>
                <div className="mt-4 md:mt-8 max-w-2xl border-l-2 border-primary pl-4 md:pl-6 py-2">
                    <p className="text-gray-300 text-base md:text-xl font-normal leading-relaxed font-mono whitespace-pre-line">
                        {translations[lang].heroSub}
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-8 w-full md:w-auto">
                    <button
                        onClick={onInit}
                        className="flex items-center justify-center h-12 px-6 bg-white text-black hover:bg-primary hover:text-white text-sm font-bold uppercase tracking-widest border border-white hover:border-primary transition-all duration-100 rounded-sm w-full md:w-auto"
                    >
                        {translations[lang].initBtn}
                    </button>
                    <button
                        onClick={onOpenLogs}
                        className="flex items-center justify-center h-12 px-6 bg-transparent text-white hover:text-primary text-sm font-bold uppercase tracking-widest border border-border-dark hover:border-primary transition-all duration-100 rounded-sm cursor-none w-full md:w-auto"
                    >
                        {translations[lang].readLogsBtn}
                    </button>
                </div>
            </div>

            {/* Right Side Visual - Cyber Map */}
            <div className="hidden md:flex flex-1 justify-end items-center md:translate-x-[400px] perspective-1000">
                <CyberMap />
            </div>
        </div>
    </section>
);

export default Hero;
