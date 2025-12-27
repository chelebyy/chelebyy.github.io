import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ControlPanel from './ControlPanel';
import { translations } from '../constants/translations';

describe('ControlPanel Component', () => {
    const mockOnClose = vi.fn();
    const mockSetCrtEnabled = vi.fn();
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
                crtEnabled={false}
                setCrtEnabled={mockSetCrtEnabled}
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
                crtEnabled={false}
                setCrtEnabled={mockSetCrtEnabled}
                user={mockUser}
            />
        );
        expect(screen.queryByText(translations.en.cpTitle)).not.toBeInTheDocument();
    });

    it('toggles CRT effect', () => {
        render(
            <ControlPanel
                isOpen={true}
                onClose={mockOnClose}
                lang="en"
                crtEnabled={false}
                setCrtEnabled={mockSetCrtEnabled}
                user={mockUser}
            />
        );

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mockSetCrtEnabled).toHaveBeenCalledWith(true);
    });

    it('calls onClose when close button clicked', () => {
        render(
            <ControlPanel
                isOpen={true}
                onClose={mockOnClose}
                lang="en"
                crtEnabled={false}
                setCrtEnabled={mockSetCrtEnabled}
                user={mockUser}
            />
        );

        // There might be multiple close buttons (modal x and maybe overlay click)
        // Let's specifically target the button inside
        const closeButton = screen.getByRole('button'); // First button is usually close in this layout
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalled();
    });
});
