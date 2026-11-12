import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BOOT_EXIT_MS, BOOT_FADE_AT, BOOT_LINE_DELAYS, BOOT_POWER_ON } from '../constants/boot';
import { GitHubDataStatus } from '../hooks/useGitHubData';

interface BootSequenceProps {
    onComplete: () => void;
    /** Loading state and number of visible repositories. */
    repos: { status: GitHubDataStatus; count: number };
}

const SKIP_MS = 200;

type Phase = 'run' | 'exit' | 'skip';

/**
 * Short, automatic intro on a vintage computer: the screen warms up, a few shell
 * lines type out, then the picture breaks up into TV static and the site cuts in.
 * Runs without a click and can be skipped with any key, click or touch.
 */
const BootSequence: React.FC<BootSequenceProps> = ({ onComplete, repos }) => {
    const [visible, setVisible] = useState(0);
    const [phase, setPhase] = useState<Phase>('run');
    const phaseRef = useRef<Phase>('run');

    // run → exit, run → skip, and exit → skip (a key press still shortens a playing exit).
    const finish = useCallback((next: Exclude<Phase, 'run'>) => {
        const current = phaseRef.current;
        if (current === 'skip' || current === next) return;
        phaseRef.current = next;
        setPhase(next);
    }, []);

    // The hand-over timer starts after React has committed the new phase, so the
    // animation it waits for is already on screen; a later skip replaces it.
    useEffect(() => {
        if (phase === 'run') return;
        const timer = window.setTimeout(onComplete, phase === 'skip' ? SKIP_MS : BOOT_EXIT_MS);
        return () => window.clearTimeout(timer);
    }, [phase, onComplete]);

    useEffect(() => {
        const timers = BOOT_LINE_DELAYS.map((delay, index) =>
            window.setTimeout(() => setVisible(index + 1), delay));
        timers.push(window.setTimeout(() => finish('exit'), BOOT_FADE_AT));
        return () => timers.forEach(window.clearTimeout);
    }, [finish]);

    useEffect(() => {
        const skip = () => finish('skip');
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

    const exiting = phase === 'exit';
    const rootExit = phase === 'skip' ? 'opacity-0' : exiting ? 'intro-exit intro-exit--static' : '';

    return (
        <div
            data-testid="boot-sequence"
            data-exit={exiting ? 'static' : undefined}
            aria-hidden="true"
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-background-dark px-4 transition-opacity ease-out ${rootExit}`}
            style={phase === 'skip'
                ? { transitionDuration: `${SKIP_MS / 1000}s` }
                : { animationDuration: `${BOOT_EXIT_MS}ms` }}
        >
            {/* Vintage computer photo (Pixabay Content License); the text sits on its glass screen. */}
            <div
                className={`intro-computer relative aspect-[2/3] h-[min(86vh,138vw,960px)] ${exiting ? 'intro-computer--static' : ''}`}
                style={{ animationDuration: `${BOOT_EXIT_MS}ms` }}
            >
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
                        className="crt-screen crt-screen--on absolute inset-0 whitespace-nowrap px-[7cqi] py-[7cqi] font-mono text-[clamp(6px,4cqi,15px)] leading-[1.8]"
                        style={{ animationDuration: `${BOOT_POWER_ON}ms` }}
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

            {/* TV static over everything during the exit. */}
            {exiting && <div className="intro-static pointer-events-none absolute inset-0" style={{ animationDuration: `${BOOT_EXIT_MS}ms` }} />}

            <p className="absolute bottom-6 font-mono text-[11px] text-gray-600">press any key to skip</p>
        </div>
    );
};

export default BootSequence;
