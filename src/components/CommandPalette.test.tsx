import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CommandPalette from './CommandPalette';
import { reposToProjects } from '../lib/github';

const projects = reposToProjects([
    { id: 1, name: 'ai-office', description: '', language: 'TypeScript', stargazers_count: 2, forks_count: 0, html_url: 'https://github.com/chelebyy/ai-office', homepage: null, pushed_at: '2026-11-01T00:00:00Z', archived: false, fork: false, license: null },
]);

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
                projects={projects}
                user={null}
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
                projects={projects}
                user={null}
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
                projects={projects}
                user={null}
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
                projects={projects}
                user={null}
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
                projects={projects}
                user={null}
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
                projects={projects}
                user={null}
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

    it('lists projects and opens one on GitHub', () => {
        const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
        render(
            <CommandPalette
                isOpen={true}
                onClose={mockOnClose}
                lang="en"
                matrixEnabled={false}
                setMatrixEnabled={mockSetMatrixEnabled}
                projects={projects}
                user={null}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'ls' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        expect(screen.getByText('ai-office/')).toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'open AI-Office' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        expect(openSpy).toHaveBeenCalledWith('https://github.com/chelebyy/ai-office', '_blank', 'noopener,noreferrer');

        fireEvent.change(input, { target: { value: 'open nope' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        expect(screen.getByText(/No such project/)).toBeInTheDocument();
        openSpy.mockRestore();
    });
});
