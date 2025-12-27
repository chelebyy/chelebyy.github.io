import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

describe('Sidebar Component', () => {
    it('renders correctly', () => {
        render(<Sidebar lang="en" />);

        expect(screen.getByText(/directory/i)).toBeInTheDocument();
        expect(screen.getByText(/projects/i)).toBeInTheDocument();
        expect(screen.getByText(/modules.sys/i)).toBeInTheDocument();
    });

    it('translates correctly', () => {
        render(<Sidebar lang="tr" />);

        expect(screen.getByText(/moduller.sys/i)).toBeInTheDocument();
    });

    it('scrolls to section on click', () => {
        render(<Sidebar lang="en" />);

        // Mock getElementById and scrollIntoView
        const mockScrollIntoView = vi.fn();
        const mockElement = { scrollIntoView: mockScrollIntoView };
        vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as unknown as HTMLElement);

        const projectLink = screen.getAllByRole('link')[0]; // First link is projects
        fireEvent.click(projectLink);

        expect(document.getElementById).toHaveBeenCalledWith('projects-section');
        expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
});
