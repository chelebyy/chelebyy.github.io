import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import LogTerminal, { STATIC_LINES, TICK_MS } from './LogTerminal';
import { SEED_LINES, SECRET_PASSCODE } from '../constants/systemLogs';

const renderTerminal = (props: { isOpen?: boolean; lang?: 'en' | 'tr'; escapeEnabled?: boolean } = {}) => {
    const onClose = vi.fn();
    const utils = render(<LogTerminal isOpen={true} onClose={onClose} lang="en" projects={[]} activity={[]} {...props} />);
    return { ...utils, onClose };
};

const logLines = () => within(screen.getByRole('region', { name: 'System log output' })).queryAllByRole('listitem');

const mockReducedMotion = (matches: boolean) => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)' ? matches : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    }));
};

describe('LogTerminal', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        // jsdom has no matchMedia; remove the mock again
        delete (window as { matchMedia?: unknown }).matchMedia;
    });

    it('closes on Escape, as its footer promises', () => {
        const { onClose } = renderTerminal();
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('leaves Escape to an overlay opened on top of it', () => {
        const { onClose } = renderTerminal({ escapeEnabled: false });
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onClose).not.toHaveBeenCalled();
    });

    it('ignores Escape while closed', () => {
        const { onClose } = renderTerminal({ isOpen: false });
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onClose).not.toHaveBeenCalled();
    });

    // jsdom does not implement inert, so only the attribute is checked here;
    // e2e/system-log.spec.ts proves the real tab order in a browser.
    it('is an inert dialog while closed', () => {
        renderTerminal({ isOpen: false });
        expect(document.querySelector('[role="dialog"]')).toHaveAttribute('inert');
    });

    it('opens as a labelled dialog with focus on the close button', () => {
        renderTerminal();
        const dialog = screen.getByRole('dialog', { name: 'tail -f /var/log/sys.log' });
        expect(dialog).not.toHaveAttribute('inert');
        expect(screen.getByRole('button', { name: 'Close system log' })).toHaveFocus();
    });

    it('gives focus back to the opener on close', () => {
        const opener = document.createElement('button');
        document.body.appendChild(opener);
        opener.focus();
        const { rerender, onClose } = renderTerminal();
        rerender(<LogTerminal isOpen={false} onClose={onClose} lang="en" projects={[]} activity={[]} />);
        expect(opener).toHaveFocus();
        opener.remove();
    });

    it('starts with a full screen of lines that leaks the passcode', () => {
        renderTerminal();
        expect(logLines()).toHaveLength(SEED_LINES);
        const secret = screen.getAllByText(SECRET_PASSCODE)[0];
        expect(secret).toHaveClass('gs-secret');
    });

    it('streams a new line every tick and stops while paused', () => {
        renderTerminal();
        act(() => { vi.advanceTimersByTime(TICK_MS * 3); });
        expect(logLines()).toHaveLength(SEED_LINES + 3);

        fireEvent.click(screen.getByRole('button', { name: '[pause]' }));
        act(() => { vi.advanceTimersByTime(TICK_MS * 5); });
        expect(logLines()).toHaveLength(SEED_LINES + 3);

        fireEvent.click(screen.getByRole('button', { name: '[follow]' }));
        act(() => { vi.advanceTimersByTime(TICK_MS); });
        expect(logLines()).toHaveLength(SEED_LINES + 4);
    });

    it('starts a fresh stream on every open', () => {
        const { rerender, onClose } = renderTerminal();
        act(() => { vi.advanceTimersByTime(TICK_MS * 4); });
        fireEvent.click(screen.getByRole('button', { name: '[pause]' }));
        rerender(<LogTerminal isOpen={false} onClose={onClose} lang="en" projects={[]} activity={[]} />);
        rerender(<LogTerminal isOpen={true} onClose={onClose} lang="en" projects={[]} activity={[]} />);
        expect(logLines()).toHaveLength(SEED_LINES);
        expect(screen.getByRole('button', { name: '[pause]' })).toBeInTheDocument();
    });

    it('stops streaming when closed', () => {
        const { rerender, onClose } = renderTerminal();
        rerender(<LogTerminal isOpen={false} onClose={onClose} lang="en" projects={[]} activity={[]} />);
        const before = document.querySelectorAll('li').length;
        act(() => { vi.advanceTimersByTime(TICK_MS * 5); });
        expect(document.querySelectorAll('li')).toHaveLength(before);
    });

    it('shows a static snapshot, still with the passcode, under reduced motion', () => {
        mockReducedMotion(true);
        renderTerminal();
        expect(logLines()).toHaveLength(STATIC_LINES);
        expect(screen.getAllByText(SECRET_PASSCODE).length).toBeGreaterThan(0);
        expect(screen.queryByRole('button', { name: '[pause]' })).not.toBeInTheDocument();
        act(() => { vi.advanceTimersByTime(TICK_MS * 5); });
        expect(logLines()).toHaveLength(STATIC_LINES);
    });

    it('keeps Tab inside the dialog', () => {
        renderTerminal();
        const close = screen.getByRole('button', { name: 'Close system log' });
        const pause = screen.getByRole('button', { name: '[pause]' });
        const region = screen.getByRole('region', { name: 'System log output' });
        region.focus();
        fireEvent.keyDown(region, { key: 'Tab' });
        expect(pause).toHaveFocus();
        fireEvent.keyDown(pause, { key: 'Tab', shiftKey: true });
        expect(region).toHaveFocus();
        expect(close).not.toHaveFocus();
    });

    it('takes focus back when an overlay on top of it closes', () => {
        const { rerender, onClose } = renderTerminal({ escapeEnabled: false });
        // The command palette opened on top and took focus; when it unmounts, focus falls to body.
        (document.activeElement as HTMLElement).blur();
        expect(document.body).toHaveFocus();
        rerender(<LogTerminal isOpen={true} onClose={onClose} lang="en" projects={[]} activity={[]} escapeEnabled={true} />);
        expect(screen.getByRole('button', { name: 'Close system log' })).toHaveFocus();
    });

    it('pulls a Tab from outside back into the dialog', () => {
        const outside = document.createElement('button');
        document.body.appendChild(outside);
        renderTerminal();
        outside.focus();
        fireEvent.keyDown(outside, { key: 'Tab' });
        expect(screen.getByRole('button', { name: '[pause]' })).toHaveFocus();
        outside.focus();
        fireEvent.keyDown(outside, { key: 'Tab', shiftKey: true });
        expect(screen.getByRole('region', { name: 'System log output' })).toHaveFocus();
        outside.remove();
    });

    it('speaks Turkish', () => {
        renderTerminal({ lang: 'tr' });
        expect(screen.getByRole('button', { name: 'Sistem günlüğünü kapat' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '[duraklat]' })).toBeInTheDocument();
        expect(screen.getByText('kapatmak için esc · satırlar kurgudur, çoğunlukla')).toBeInTheDocument();
    });
});
