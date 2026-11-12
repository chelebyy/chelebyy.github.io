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
            {/* Vintage computer photo (Pixabay Content License); the text sits on its glass screen. */}
            <div className="relative aspect-[2/3] h-[min(86vh,138vw,960px)]">
                <img
                    src="/intro/retro-computer.webp"
                    alt=""
                    width={720}
                    height={1080}
                    decoding="async"
                    fetchPriority="high"
                    className="crt-photo absolute inset-0 h-full w-full select-none object-cover"
                    draggable={false}
                />
                {/* Blend the photo's wall and desk into the page background. */}
                <div className="crt-photo-fade pointer-events-none absolute inset-0" />

                {/* The glass screen of the photographed monitor. */}
                <div className="crt-glass absolute left-[19.4%] top-[16.7%] h-[29.2%] w-[61.1%] overflow-hidden rounded-[9%/13%] bg-[#030805] [container-type:inline-size]">
                    {/* Text scales with the screen width (cqi), so the longest command always fits on one line. */}
                    <div
                        className={`crt-screen absolute inset-0 whitespace-nowrap px-[7cqi] py-[7cqi] font-mono text-[clamp(6px,4cqi,15px)] leading-[1.8] ${off ? 'crt-screen--off' : 'crt-screen--on'}`}
                        style={off ? { animationDuration: `${offMs}ms` } : { animationDuration: `${BOOT_POWER_ON}ms` }}
                    >
                        {lines.slice(0, visible).map((line, index) => (
                            <p key={index} className={`${line.command ? 'text-[#a8ffb8]' : 'text-[#4fd16d]'} ${index === visible - 1 ? 'caret' : ''}`}>
                                {line.command && <span className="mr-[0.6em] text-[#6dff8c]">$</span>}
                                {line.text}
                            </p>
                        ))}
                    </div>
                    <div className="crt-scanlines pointer-events-none absolute inset-0" />
                    <div className="crt-vignette pointer-events-none absolute inset-0" />
                </div>
            </div>

            <p className="absolute bottom-6 font-mono text-[11px] text-gray-600">press any key to skip</p>
        </div>
    );
};

export default BootSequence;
