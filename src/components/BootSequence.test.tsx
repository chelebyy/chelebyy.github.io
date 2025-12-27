import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BootSequence from './BootSequence';

describe('BootSequence Component', () => {
    const mockOnComplete = vi.fn();
    const mockPlayPhaseSound = vi.fn();
    const mockInitAudio = vi.fn();

    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders start screen initially', () => {
        render(
            <BootSequence
                onComplete={mockOnComplete}
                playPhaseSound={mockPlayPhaseSound}
                initAudio={mockInitAudio}
            />
        );
        expect(screen.getByText('[ INITIALIZE SYSTEM ]')).toBeInTheDocument();
    });

    it('starts boot sequence on click', () => {
        render(
            <BootSequence
                onComplete={mockOnComplete}
                playPhaseSound={mockPlayPhaseSound}
                initAudio={mockInitAudio}
            />
        );

        const startButton = screen.getByText('[ INITIALIZE SYSTEM ]');
        fireEvent.click(startButton);

        // Should call initAudio
        expect(mockInitAudio).toHaveBeenCalled();

        // Should enter BIOS phase
        // Initial playPhaseSound for bios
        expect(mockPlayPhaseSound).toHaveBeenCalledWith('bios');
    });

    it('transitions through phases and completes', () => {
        render(
            <BootSequence
                onComplete={mockOnComplete}
                playPhaseSound={mockPlayPhaseSound}
                initAudio={mockInitAudio}
            />
        );

        // Start
        fireEvent.click(screen.getByText('[ INITIALIZE SYSTEM ]'));

        // Fast forward through BIOS (lines printing)
        // 5 lines * 400ms = 2000ms + buffer
        act(() => {
            vi.advanceTimersByTime(3000);
        });

        // Should be in auth phase
        // Bios finishes, waits 600ms, sets phase to auth
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.getByText('AUTHENTICATING_USER...')).toBeInTheDocument();
        expect(mockPlayPhaseSound).toHaveBeenCalledWith('auth');

        // Fast forward auth phase (2500ms)
        act(() => {
            vi.advanceTimersByTime(3000);
        });

        // Should be in access phase
        expect(screen.getByText('ACCESS GRANTED')).toBeInTheDocument();
        expect(mockPlayPhaseSound).toHaveBeenCalledWith('access');

        // Fast forward access phase (1000ms wait -> drop phase -> 300ms wait -> onComplete)
        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(mockOnComplete).toHaveBeenCalled();
    });
});
