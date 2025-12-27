import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Header from './Header';
import { translations } from '../constants/translations';

describe('Header Component', () => {
    const mockSetLang = vi.fn();
    const mockOnOpenControlPanel = vi.fn();

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders correctly with English translations', () => {
        render(<Header lang="en" setLang={mockSetLang} onOpenControlPanel={mockOnOpenControlPanel} />);

        // Advance time to allow typing effect to complete
        act(() => {
            vi.advanceTimersByTime(3000);
        });

        // Check for terminal user text (typed out)
        expect(screen.getByText(translations.en.terminal)).toBeInTheDocument();

        // Check for connect button text
        expect(screen.getByText(translations.en.connect)).toBeInTheDocument();
    });

    it('renders correctly with Turkish translations', () => {
        render(<Header lang="tr" setLang={mockSetLang} onOpenControlPanel={mockOnOpenControlPanel} />);

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        // Check for terminal user text
        expect(screen.getByText(translations.tr.terminal)).toBeInTheDocument();

        // Check for connect button text
        expect(screen.getByText(translations.tr.connect)).toBeInTheDocument();
    });

    it('calls setLang when language buttons are clicked', () => {
        render(<Header lang="en" setLang={mockSetLang} onOpenControlPanel={mockOnOpenControlPanel} />);

        // Find buttons by text 'TR'
        // Since there are mobile and desktop versions, we might find multiple.
        // Use getAllByText and pick the visible one or just interact with the first one.
        const trButtons = screen.getAllByText('TR');
        fireEvent.click(trButtons[0]);

        expect(mockSetLang).toHaveBeenCalledWith('tr');
    });

    it('calls onOpenControlPanel when control panel is clicked', () => {
        render(<Header lang="en" setLang={mockSetLang} onOpenControlPanel={mockOnOpenControlPanel} />);

        // The button has a material symbol 'terminal' and title 'Open System Control'
        const controlPanelTrigger = screen.getByTitle('Open System Control');

        fireEvent.click(controlPanelTrigger);

        expect(mockOnOpenControlPanel).toHaveBeenCalled();
    });
});
