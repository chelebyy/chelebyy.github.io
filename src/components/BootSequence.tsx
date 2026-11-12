import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BOOT_DONE_AT, BOOT_FADE_AT, BOOT_LINE_DELAYS, BOOT_POWER_ON } from '../constants/boot';
import { GitHubDataStatus } from '../hooks/useGitHubData';

interface BootSequenceProps {
    onComplete: () => void;
    /** Loading state and number of visible repositories. */
    repos: { status: GitHubDataStatus; count: number };
}

const SKIP_MS = 200;

/**
 * Short, automatic intro shown on an old CRT monitor: the screen warms up,
 * a few shell lines type out, then the screen switches off and the site appears.
 * Runs without a click and can be skipped with any key, click or touch.
 */
const BootSequence: React.FC<BootSequenceProps> = ({ onComplete, repos }) => {
    const [visible, setVisible] = useState(0);
    const [offMs, setOffMs] = useState<number | null>(null);
    const finished = useRef(false);

    const finish = useCallback((duration: number) => {
        if (finished.current) return;
        finished.current = true;
        // Screen-off and backdrop fade both end exactly at `duration`, so nothing is cut off.
        setOffMs(duration);
        window.setTimeout(onComplete, duration);
    }, [onComplete]);

    useEffect(() => {
        const timers = BOOT_LINE_DELAYS.map((delay, index) =>
            window.setTimeout(() => setVisible(index + 1), delay));
        timers.push(window.setTimeout(() => finish(BOOT_DONE_AT - BOOT_FADE_AT), BOOT_FADE_AT));
        return () => timers.forEach(window.clearTimeout);
    }, [finish]);

    useEffect(() => {
        const skip = () => finish(SKIP_MS);
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
        {
            text: repos.status === 'ready'
                ? `${repos.count} repositories found`
                : repos.status === 'error' ? 'github.com did not answer' : 'fetching repositories…',
        },
        { text: 'open ./open-source', command: true },
    ];

    const off = offMs !== null;
    // The backdrop starts fading once the screen has mostly collapsed.
    const fadeDelay = off ? Math.round(offMs * 0.4) : 0;
    const fadeDuration = off ? offMs - fadeDelay : 0;

    return (
        <div
            data-testid="boot-sequence"
            aria-hidden="true"
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background-dark px-4 transition-opacity ease-out ${off ? 'opacity-0' : 'opacity-100'}`}
            style={{ transitionDuration: `${fadeDuration / 1000}s`, transitionDelay: `${fadeDelay / 1000}s` }}
        >
            {/* Monitor */}
            <div className="crt-monitor w-[min(92vw,600px)] rounded-[26px] p-4 sm:p-6">
                <div className="crt-glass relative aspect-[4/3] overflow-hidden rounded-[20px/16px] bg-[#05060a]">
                    <div
                        className={`crt-screen absolute inset-0 px-6 py-7 font-mono text-[13px] leading-7 sm:px-9 sm:py-9 sm:text-[15px] ${off ? 'crt-screen--off' : 'crt-screen--on'}`}
                        style={off ? { animationDuration: `${offMs}ms` } : { animationDuration: `${BOOT_POWER_ON}ms` }}
                    >
                        {lines.slice(0, visible).map((line, index) => (
                            <p key={index} className={`${line.command ? 'text-[#dfe6ff]' : 'text-[#7f93d9]'} ${index === visible - 1 ? 'caret' : ''}`}>
                                {line.command && <span className="mr-2 text-primary">$</span>}
                                {line.text}
                            </p>
                        ))}
                    </div>
                    <div className="crt-scanlines pointer-events-none absolute inset-0" />
                    <div className="crt-vignette pointer-events-none absolute inset-0" />
                </div>
                <div className="mt-3 flex items-center justify-between px-1 sm:mt-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-gray-500">cheleby-80</span>
                    <span className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full bg-[#1b1d23] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
                        <span className="h-3 w-3 rounded-full bg-[#1b1d23] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
                        <span className={`h-1.5 w-1.5 rounded-full ${off ? 'bg-[#28c840]/30' : 'crt-led bg-[#28c840]'}`} />
                    </span>
                </div>
            </div>
            {/* Stand */}
            <div className="h-6 w-24 bg-gradient-to-b from-[#1d1f25] to-[#121318] [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)]" />
            <div className="h-2.5 w-52 rounded-full bg-gradient-to-b from-[#202228] to-[#111216] shadow-[0_10px_30px_rgba(0,0,0,0.6)]" />

            <p className="absolute bottom-8 font-mono text-[11px] text-gray-700">press any key to skip</p>
        </div>
    );
};

export default BootSequence;
