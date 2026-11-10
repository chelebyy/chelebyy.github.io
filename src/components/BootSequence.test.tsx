import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BootSequence from './BootSequence';
import { BOOT_DONE_AT, BOOT_LINE_DELAYS } from '../constants/boot';

describe('BootSequence Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('starts on its own, without a button to click', () => {
        render(<BootSequence onComplete={vi.fn()} repoCount={7} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.getByText('ssh guest@cheleby.me')).toBeInTheDocument();
    });

    it('types its lines and hands over to the site within two seconds', () => {
        const onComplete = vi.fn();
        render(<BootSequence onComplete={onComplete} repoCount={7} />);

        act(() => {
            vi.advanceTimersByTime(BOOT_LINE_DELAYS[BOOT_LINE_DELAYS.length - 1]);
        });
        expect(screen.getByText('7 repositories found')).toBeInTheDocument();
        expect(screen.getByText('open ./open-source')).toBeInTheDocument();
        expect(onComplete).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(BOOT_DONE_AT);
        });
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(BOOT_DONE_AT).toBeLessThanOrEqual(2000);
    });

    it('says it is still fetching while the repository count is unknown', () => {
        render(<BootSequence onComplete={vi.fn()} repoCount={null} />);
        act(() => {
            vi.advanceTimersByTime(BOOT_LINE_DELAYS[3]);
        });
        expect(screen.getByText('fetching repositories…')).toBeInTheDocument();
    });

    it('can be skipped with a key press and completes only once', () => {
        const onComplete = vi.fn();
        render(<BootSequence onComplete={onComplete} repoCount={7} />);

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
});
