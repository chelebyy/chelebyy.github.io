import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { useSoundEffects } from '../hooks/useSoundEffects';

const sequences = {
    en: [
        { text: '> INITIALIZING_KERNEL...', delay: 100 },
        { text: '> LOADING_MODULES [REACT, TS, VITE,C#,JS,HTML,CSS]...', delay: 600 },
        { text: '> ESTABLISHING_SECURE_UPLINK...', delay: 1200 },
        { text: '> COMPILING_DIGITAL_ARTIFACTS...', delay: 1800 },
        { text: '> ACCESS_GRANTED.', delay: 2400 }
    ],
    tr: [
        { text: '> CEKIRDEK_BASLATILIYOR...', delay: 100 },
        { text: '> MODULLER_YUKLENIYOR [REACT, TS, VITE,C#,JS,HTML,CSS]...', delay: 600 },
        { text: '> GUVENLI_BAGLANTI_KURULUYOR...', delay: 1200 },
        { text: '> DIJITAL_ESERLER_DERLENIYOR...', delay: 1800 },
        { text: '> ERISIM_IZNI_VERILDI.', delay: 2400 }
    ]
};

const TerminalOverlay = ({ onComplete, lang, initAudio }: { onComplete: () => void, lang: Language, initAudio: () => void }) => {
    const [lines, setLines] = useState<string[]>([]);
    const { playLogWriteSound, playCompletionSound } = useSoundEffects();

    useEffect(() => {
        // Reset lines when language or init restarts (though component unmounts usually)
        // eslint-disable-next-line
        setLines([]);
        initAudio(); // Ensure AudioContext is awake

        const sequence = sequences[lang];
        const timeouts: NodeJS.Timeout[] = [];
        const lastIndex = sequence.length - 1;

        sequence.forEach(({ text, delay }, index) => {
            const timeout = setTimeout(() => {
                // Play sound for each line
                if (index === lastIndex) {
                    // Last line (ACCESS_GRANTED) - play completion sound
                    playCompletionSound();
                } else {
                    // Regular lines - play typing sound
                    playLogWriteSound();
                }
                setLines(prev => [...prev, text]);
            }, delay);
            timeouts.push(timeout);
        });

        const finishTimeout = setTimeout(onComplete, 2800);
        timeouts.push(finishTimeout);

        return () => timeouts.forEach(clearTimeout);
    }, [onComplete, lang, playLogWriteSound, playCompletionSound, initAudio]);

    return (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0c] text-primary font-mono text-sm p-4 md:p-10 flex flex-col justify-end pb-20">
            {lines.map((line, i) => (
                <p key={i} className="mb-2 last:animate-pulse">{line}</p>
            ))}
            <div className="animate-pulse mt-4">_</div>
        </div>
    );
};

export default TerminalOverlay;
