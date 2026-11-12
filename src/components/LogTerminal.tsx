import React, { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Language, Project } from '../types';
import { translations } from '../constants/translations';
import { LogLevel, LogLine, SEED_LINES, formatLogTime, nextLogLine, seedLogLines } from '../constants/systemLogs';

/** Milliseconds between new lines while the stream follows. */
export const TICK_MS = 800;
/** Lines kept in the panel; older ones scroll away. */
export const MAX_LINES = 120;
/** Lines shown, without streaming, to visitors who prefer reduced motion. */
export const STATIC_LINES = 16;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

const subscribeReducedMotion = (onChange: () => void) => {
    if (typeof window.matchMedia !== 'function') return () => {};
    const query = window.matchMedia(REDUCED_MOTION);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
};
const readReducedMotion = () => typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION).matches;

const LEVEL_LABEL: Record<LogLevel, string> = { info: 'INFO', ok: 'OK', warn: 'WARN', err: 'ERR', alert: 'ALRT' };
const LEVEL_CLASS: Record<LogLevel, string> = {
    info: 'text-gray-500',
    ok: 'text-green-400',
    warn: 'text-amber-300',
    err: 'text-red-400',
    alert: 'text-red-400 font-bold',
};

const LogRow: React.FC<{ line: LogLine }> = ({ line }) => {
    const alert = line.level === 'alert';
    return (
        <li
            className={`grid grid-cols-[auto_4ch_1fr] gap-x-3 border-l-2 py-0.5 pl-3 pr-4 leading-relaxed ${
                alert
                    ? 'border-red-500 bg-red-500/10 shadow-[inset_0_0_24px_-12px_rgba(239,68,68,0.8)]'
                    : 'border-transparent hover:border-primary/60 hover:bg-white/[0.02]'
            }`}
        >
            <time dateTime={new Date(line.time).toISOString()} className="text-gray-600 tabular-nums">{formatLogTime(line.time)}</time>
            <span className={LEVEL_CLASS[line.level]}>{LEVEL_LABEL[line.level]}</span>
            <span className="min-w-0 break-words">
                <span className="text-primary-text">{line.unit}:</span>{' '}
                <span className={alert ? 'font-bold text-red-400' : 'text-gray-300'}>{line.text}</span>
                {line.code && <> <span className="gs-secret">{line.code}</span></>}
            </span>
        </li>
    );
};

interface LogStreamProps {
    lang: Language;
    projects: Project[];
    live: boolean;
    reducedMotion: boolean;
}

/** The scrolling output. Remounted (via `key`) on every open, so each view starts fresh. */
const LogStream: React.FC<LogStreamProps> = ({ lang, projects, live, reducedMotion }) => {
    const t = translations[lang];
    const [stream, setStream] = useState(() =>
        seedLogLines(reducedMotion ? STATIC_LINES : SEED_LINES, { lang, projects, spacingMs: TICK_MS }));
    const scrollRef = useRef<HTMLDivElement>(null);
    const stickToBottom = useRef(true);

    useEffect(() => {
        if (!live) return;
        const id = window.setInterval(() => {
            setStream(prev => {
                const [line, state] = nextLogLine(prev.state, { lang, projects });
                return { lines: [...prev.lines.slice(-(MAX_LINES - 1)), line], state };
            });
        }, TICK_MS);
        return () => window.clearInterval(id);
    }, [live, lang, projects]);

    // Follow the newest line unless the visitor scrolled up to read.
    useLayoutEffect(() => {
        const element = scrollRef.current;
        if (element && stickToBottom.current) element.scrollTop = element.scrollHeight;
    }, [stream.lines]);

    const onScroll = () => {
        const element = scrollRef.current;
        if (!element) return;
        stickToBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 24;
    };

    return (
        // No aria-live: a line every 800 ms would drown a screen reader. The region is
        // focusable so keyboard users can scroll it and read the lines (the hint lives here).
        <div
            ref={scrollRef}
            onScroll={onScroll}
            role="region"
            aria-label={t.logsRegion}
            tabIndex={0}
            className="scanlines min-h-0 flex-1 overflow-y-auto py-3 focus-visible:outline-offset-[-2px]"
        >
            <ol className="space-y-px">
                {stream.lines.map(line => <LogRow key={line.id} line={line} />)}
            </ol>
            {live && <div aria-hidden="true" className="mt-1 pl-[calc(0.75rem+2px)] text-primary-text animate-pulse">▋</div>}
        </div>
    );
};

interface LogTerminalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Language;
    projects: Project[];
    /** False while another overlay sits on top and owns the Escape key. */
    escapeEnabled?: boolean;
}

const LogTerminal: React.FC<LogTerminalProps> = ({ isOpen, onClose, lang, projects, escapeEnabled = true }) => {
    const t = translations[lang];
    const reducedMotion = useSyncExternalStore(subscribeReducedMotion, readReducedMotion, () => false);
    const [paused, setPaused] = useState(false);
    const [session, setSession] = useState(0);
    const [wasOpen, setWasOpen] = useState(isOpen);
    const panelRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const openerRef = useRef<HTMLElement | null>(null);

    // Every open starts a new stream that follows from the start.
    if (isOpen !== wasOpen) {
        setWasOpen(isOpen);
        if (isOpen) {
            setSession(value => value + 1);
            setPaused(false);
        }
    }

    // Move focus into the panel on open; give it back to whatever opened it on close.
    useEffect(() => {
        if (!isOpen) return;
        const panel = panelRef.current;
        openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        closeRef.current?.focus();
        return () => {
            const opener = openerRef.current;
            const focusInside = panel?.contains(document.activeElement);
            if (opener?.isConnected && (focusInside || document.activeElement === document.body)) opener.focus();
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !escapeEnabled) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, escapeEnabled, onClose]);

    // Keep Tab inside the dialog while it is open.
    const trapTab = (event: React.KeyboardEvent) => {
        if (event.key !== 'Tab' || !panelRef.current) return;
        const focusable: HTMLElement[] = Array.from((panelRef.current as HTMLElement).querySelectorAll<HTMLElement>('button, [tabindex="0"]'));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    const live = isOpen && !paused && !reducedMotion;
    const status = reducedMotion ? t.logsStatic : paused ? t.logsPaused : t.logsLive;
    const dotClass = reducedMotion ? 'bg-gray-600' : paused ? 'bg-amber-300' : 'bg-green-400 animate-pulse';

    return (
        <>
            {isOpen && <div aria-hidden="true" className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" onClick={onClose} />}

            {/* Stays mounted while closed so it can slide out. `inert` and `invisible` (on close it waits for the
                slide to end, since visibility transitions discretely; on open it applies at once so focus can land) keep it out of the tab order and the accessibility tree. */}
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="sys-log-title"
                inert={!isOpen}
                onKeyDown={trapTab}
                className={`fixed inset-y-0 right-0 z-[100] flex w-full flex-col border-l border-primary/40 bg-surface-dark font-mono text-[11px] shadow-[-30px_0_80px_-30px_color-mix(in_oklab,var(--color-primary)_55%,transparent)] duration-300 ease-out motion-reduce:transition-none md:w-[520px] md:text-xs ${
                    isOpen
                        ? 'visible translate-x-0 transition-transform'
                        : 'invisible pointer-events-none translate-x-full transition-[transform,visibility]'
                }`}
            >
                <div className="flex items-center justify-between gap-3 border-b border-border-dark bg-black/30 px-4 py-2.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
                        <h2 id="sys-log-title" className="truncate text-white">{t.logsTitle}</h2>
                        <span className="shrink-0 text-gray-600">[{status}]</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                        {!reducedMotion && (
                            <button
                                type="button"
                                onClick={() => setPaused(value => !value)}
                                aria-pressed={paused}
                                className="text-gray-500 transition-colors hover:text-white"
                            >
                                [{paused ? t.logsResume : t.logsPause}]
                            </button>
                        )}
                        <button
                            ref={closeRef}
                            type="button"
                            onClick={onClose}
                            aria-label={t.logsClose}
                            className="text-gray-500 transition-colors hover:text-white"
                        >
                            [esc]
                        </button>
                    </div>
                </div>

                <LogStream key={`${session}-${lang}`} lang={lang} projects={projects} live={live} reducedMotion={reducedMotion} />

                <div className="border-t border-border-dark px-4 py-2.5 text-[10px] text-gray-600">{t.logsFooter}</div>
            </div>
        </>
    );
};

export default LogTerminal;
