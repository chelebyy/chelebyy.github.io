import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ControlPanel from './ControlPanel';
import { translations } from '../constants/translations';

describe('ControlPanel Component', () => {
    const mockOnClose = vi.fn();
    const mockUser = {
        login: 'testuser',
        avatar_url: 'http://example.com/avatar.jpg',
        bio: 'Test Bio',
        public_repos: 10,
        followers: 5,
        html_url: 'https://github.com/test'
    };

    it('renders when open', () => {
        render(
            <ControlPanel
                isOpen={true}
                onClose={mockOnClose}
                lang="en"
                user={mockUser}
            />
        );
        expect(screen.getByText(translations.en.cpTitle)).toBeInTheDocument();
        expect(screen.getByText('@testuser')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(
            <ControlPanel
                isOpen={false}
                onClose={mockOnClose}
                lang="en"
                user={mockUser}
            />
        );
        expect(screen.queryByText(translations.en.cpTitle)).not.toBeInTheDocument();
    });

    it('calls onClose when close button clicked', () => {
        render(
            <ControlPanel
                isOpen={true}
                onClose={mockOnClose}
                lang="en"
                user={mockUser}
            />
        );

        // There might be multiple close buttons (modal x and maybe overlay click)
        // Let's specifically target the button inside
        const closeButton = screen.getByRole('button'); // First button is usually close in this layout
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes when Escape is pressed', () => {
        const onClose = vi.fn();
        render(
            <ControlPanel
                isOpen={true}
                onClose={onClose}
                lang="en"
                user={mockUser}
            />
        );
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('leaves Escape to an overlay opened on top of it', () => {
        const onClose = vi.fn();
        render(
            <ControlPanel
                isOpen={true}
                onClose={onClose}
                lang="en"
                user={mockUser}
                escapeEnabled={false}
            />
        );
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onClose).not.toHaveBeenCalled();
    });
});
