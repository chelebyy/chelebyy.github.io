import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BOOT_DONE_AT, BOOT_FADE_AT, BOOT_LINE_DELAYS } from '../constants/boot';

interface BootSequenceProps {
    onComplete: () => void;
    /** Number of visible repositories, or null while they are still loading. */
    repoCount: number | null;
}

const SKIP_FADE_MS = 200;

/**
 * Short, automatic intro: a few real-looking shell lines, then the site.
 * Runs without a click, can be skipped with any key, click or touch.
 */
const BootSequence: React.FC<BootSequenceProps> = ({ onComplete, repoCount }) => {
    const [visible, setVisible] = useState(1);
    const [fading, setFading] = useState(false);
    const finished = useRef(false);

    const finish = useCallback((delay: number) => {
        if (finished.current) return;
        finished.current = true;
        setFading(true);
        window.setTimeout(onComplete, delay);
    }, [onComplete]);

    useEffect(() => {
        const timers = BOOT_LINE_DELAYS.slice(1).map((delay, index) =>
            window.setTimeout(() => setVisible(index + 2), delay));
        timers.push(window.setTimeout(() => finish(BOOT_DONE_AT - BOOT_FADE_AT), BOOT_FADE_AT));
        return () => timers.forEach(window.clearTimeout);
    }, [finish]);

    useEffect(() => {
        const skip = () => finish(SKIP_FADE_MS);
        window.addEventListener('keydown', skip);
        window.addEventListener('pointerdown', skip);
        return () => {
            window.removeEventListener('keydown', skip);
            window.removeEventListener('pointerdown', skip);
        };
    }, [finish]);

    const lines: Array<{ text: string; command?: boolean }> = [
        { text: 'ssh guest@cheleby.me', command: true },
        { text: 'connected.' },
        { text: 'gh repo list chelebyy --public', command: true },
        { text: repoCount === null ? 'fetching repositories…' : `${repoCount} repositories found` },
        { text: 'open ./open-source', command: true },
    ];

    return (
        <div
            data-testid="boot-sequence"
            aria-hidden="true"
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background-dark font-mono transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="w-full max-w-xl space-y-1.5 px-6 text-sm md:text-base">
                {lines.slice(0, visible).map((line, index) => (
                    <p key={index} className={`${line.command ? 'text-gray-200' : 'text-gray-500'} ${index === visible - 1 ? 'caret' : ''}`}>
                        {line.command && <span className="mr-2 text-primary">$</span>}
                        {line.text}
                    </p>
                ))}
            </div>
            <p className="absolute bottom-8 font-mono text-[11px] text-gray-700">press any key to skip</p>
        </div>
    );
};

export default BootSequence;
