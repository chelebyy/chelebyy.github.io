import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BootSequence from './BootSequence';
import { BOOT_DONE_AT, BOOT_EXIT_MS, BOOT_FADE_AT, BOOT_LINE_DELAYS } from '../constants/boot';

describe('BootSequence Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('starts on its own, without a button to click', () => {
        render(<BootSequence onComplete={vi.fn()} repos={{ status: 'ready', count: 7 }} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        // The first line appears once the CRT screen has warmed up, with no user input.
        act(() => {
            vi.advanceTimersByTime(BOOT_LINE_DELAYS[0]);
        });
        expect(screen.getByText('ssh guest@cheleby.me')).toBeInTheDocument();
    });

    it('types its lines and hands over to the site in about five and a half seconds', () => {
        const onComplete = vi.fn();
        render(<BootSequence onComplete={onComplete} repos={{ status: 'ready', count: 7 }} />);

        act(() => {
            vi.advanceTimersByTime(BOOT_LINE_DELAYS[BOOT_LINE_DELAYS.length - 1]);
        });
        expect(screen.getByText('7 repositories found')).toBeInTheDocument();
        expect(screen.getByText('open ./open-source')).toBeInTheDocument();
        expect(onComplete).not.toHaveBeenCalled();

        // The exit transition starts on its own...
        act(() => {
            vi.advanceTimersByTime(BOOT_FADE_AT - BOOT_LINE_DELAYS[BOOT_LINE_DELAYS.length - 1]);
        });
        expect(screen.getByTestId('boot-sequence')).toHaveAttribute('data-exit', 'zoom');
        expect(onComplete).not.toHaveBeenCalled();

        // ...and hands over exactly once when it has finished.
        act(() => {
            vi.advanceTimersByTime(BOOT_EXIT_MS - 1);
        });
        expect(onComplete).not.toHaveBeenCalled();
        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(BOOT_DONE_AT).toBeLessThanOrEqual(6000);
    });

    it('says it is still fetching while the repository count is unknown', () => {
        render(<BootSequence onComplete={vi.fn()} repos={{ status: 'loading', count: 0 }} />);
        act(() => {
            vi.advanceTimersByTime(BOOT_LINE_DELAYS[3]);
        });
        expect(screen.getByText('fetching repositories…')).toBeInTheDocument();
    });

    it('can be skipped with a key press and completes only once', () => {
        const onComplete = vi.fn();
        render(<BootSequence onComplete={onComplete} repos={{ status: 'ready', count: 7 }} />);

        fireEvent.keyDown(window, { key: 'Enter' });
        act(() => {
            vi.advanceTimersByTime(300);
        });
        expect(onComplete).toHaveBeenCalledTimes(1);

        act(() => {
            vi.advanceTimersByTime(BOOT_DONE_AT);
        });
        expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('does not claim zero repositories when GitHub fails', () => {
        render(<BootSequence onComplete={vi.fn()} repos={{ status: 'error', count: 0 }} />);
        act(() => {
            vi.advanceTimersByTime(BOOT_LINE_DELAYS[3]);
        });
        expect(screen.queryByText(/0 repositories found/)).not.toBeInTheDocument();
        expect(screen.getByText('github.com did not answer')).toBeInTheDocument();
    });

    it('finishes its fade before handing over when skipped', () => {
        const onComplete = vi.fn();
        render(<BootSequence onComplete={onComplete} repos={{ status: 'ready', count: 7 }} />);
        fireEvent.keyDown(window, { key: 'Enter' });
        // The backdrop fade may start after a delay; hand-over must wait for delay + duration.
        const style = getComputedStyle(screen.getByTestId('boot-sequence'));
        const fadeMs = Math.round((parseFloat(style.transitionDelay || '0') + parseFloat(style.transitionDuration)) * 1000);
        expect(fadeMs).toBeGreaterThan(0);
        act(() => {
            vi.advanceTimersByTime(fadeMs - 1);
        });
        expect(onComplete).not.toHaveBeenCalled();
        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('can still be skipped quickly while the exit transition is playing', () => {
        const onComplete = vi.fn();
        render(<BootSequence onComplete={onComplete} repos={{ status: 'ready', count: 7 }} />);
        act(() => {
            vi.advanceTimersByTime(BOOT_FADE_AT + 100);
        });
        expect(screen.getByTestId('boot-sequence')).toHaveAttribute('data-exit', 'zoom');

        fireEvent.keyDown(window, { key: 'Enter' });
        act(() => {
            vi.advanceTimersByTime(250);
        });
        expect(onComplete).toHaveBeenCalledTimes(1);

        act(() => {
            vi.advanceTimersByTime(BOOT_DONE_AT);
        });
        expect(onComplete).toHaveBeenCalledTimes(1);
    });
});
