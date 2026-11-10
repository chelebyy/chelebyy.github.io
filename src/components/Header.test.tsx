import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { translations } from '../constants/translations';

const setup = (lang: 'en' | 'tr' = 'en') => {
    const props = {
        setLang: vi.fn(),
        onOpenControlPanel: vi.fn(),
        onOpenTerminal: vi.fn(),
    };
    render(<Header lang={lang} {...props} />);
    return props;
};

describe('Header Component', () => {
    it('shows the prompt in the selected language', () => {
        setup('tr');
        expect(screen.getByText(translations.tr.terminal)).toBeInTheDocument();
        expect(screen.getByText(translations.tr.path)).toBeInTheDocument();
    });

    it('marks the active language and switches language on click', () => {
        const { setLang } = setup('en');
        expect(screen.getByRole('button', { name: 'en' })).toHaveAttribute('aria-pressed', 'true');
        fireEvent.click(screen.getByRole('button', { name: 'tr' }));
        expect(setLang).toHaveBeenCalledWith('tr');
    });

    it('opens the control panel from the prompt and the terminal from its button', () => {
        const { onOpenControlPanel, onOpenTerminal } = setup();
        fireEvent.click(screen.getByTitle('System control'));
        expect(onOpenControlPanel).toHaveBeenCalled();
        fireEvent.click(screen.getByRole('button', { name: /terminal/i }));
        expect(onOpenTerminal).toHaveBeenCalled();
    });

    it('links to the GitHub profile in a new tab', () => {
        setup();
        const link = screen.getByRole('link', { name: 'GitHub' });
        expect(link).toHaveAttribute('href', 'https://github.com/chelebyy');
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });
});
