import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CommandPalette from './CommandPalette';

// Mock dependencies
const mockSetMatrixEnabled = vi.fn();
const mockOnClose = vi.fn();

describe('CommandPalette Component', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        // Mock scrollIntoView as it's not implemented in jsdom
        Element.prototype.scrollIntoView = vi.fn();
    });

    it('does not render when closed', () => {
        render(
            <CommandPalette
                isOpen={false}
                onClose={mockOnClose}
                lang="en"
                matrixEnabled={false}
                setMatrixEnabled={mockSetMatrixEnabled}
            />
        );
        expect(screen.queryByText('➜')).not.toBeInTheDocument();
    });

    it('renders and focuses input when open', async () => {
        vi.useFakeTimers();
        render(
            <CommandPalette
                isOpen={true}
                onClose={mockOnClose}
                lang="en"
                matrixEnabled={false}
                setMatrixEnabled={mockSetMatrixEnabled}
            />
        );

        expect(screen.getByText('➜')).toBeInTheDocument();

        act(() => {
            vi.runAllTimers();
        });

        const input = screen.getByRole('textbox');
        expect(input).toHaveFocus();
        vi.useRealTimers();
    });

    it('shows help command output', () => {
        render(
            <CommandPalette
                isOpen={true}
                onClose={mockOnClose}
                lang="en"
                matrixEnabled={false}
                setMatrixEnabled={mockSetMatrixEnabled}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'help' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(screen.getByText('theme [color]')).toBeInTheDocument();
        expect(screen.getByText('sudo [cmd]')).toBeInTheDocument();
    });

    it('toggles matrix mode', () => {
        render(
            <CommandPalette
                isOpen={true}
                onClose={mockOnClose}
                lang="en"
                matrixEnabled={false}
                setMatrixEnabled={mockSetMatrixEnabled}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'matrix' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(mockSetMatrixEnabled).toHaveBeenCalledWith(true);
    });

    it('closes on exit command', () => {
        render(
            <CommandPalette
                isOpen={true}
                onClose={mockOnClose}
                lang="en"
                matrixEnabled={false}
                setMatrixEnabled={mockSetMatrixEnabled}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'exit' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles sudo command (denied)', () => {
        render(
            <CommandPalette
                isOpen={true}
                onClose={mockOnClose}
                lang="en"
                matrixEnabled={false}
                setMatrixEnabled={mockSetMatrixEnabled}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'sudo rm -rf /' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        // Check for denied message (partial match as text might be split)
        // Using a regex or a flexible matcher is safer
        const deniedMessage = screen.getByText(/PERMISSION DENIED/i);
        expect(deniedMessage).toBeInTheDocument();
    });
});
