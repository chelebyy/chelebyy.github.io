import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

const languages = [
    { language: 'TypeScript', count: 4 },
    { language: 'C#', count: 2 },
];

const setup = (selectedLanguage: string | null = null) => {
    const onSelectLanguage = vi.fn();
    render(
        <Sidebar
            lang="en"
            languages={languages}
            total={6}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={onSelectLanguage}
            activityCount={3}
            secretUnlocked={false}
        />
    );
    return onSelectLanguage;
};

describe('Sidebar Component', () => {
    it('lists the languages found in the repositories with their counts', () => {
        setup();
        expect(screen.getByRole('button', { name: /all\s*6/ })).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', { name: /typescript\s*4/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /c#\s*2/i })).toBeInTheDocument();
    });

    it('filters by language and clears the filter', () => {
        const onSelect = setup('C#');
        expect(screen.getByRole('button', { name: /c#/i })).toHaveAttribute('aria-pressed', 'true');
        fireEvent.click(screen.getByRole('button', { name: /typescript/i }));
        expect(onSelect).toHaveBeenCalledWith('TypeScript');
        fireEvent.click(screen.getByRole('button', { name: /all/ }));
        expect(onSelect).toHaveBeenCalledWith(null);
    });

    it('scrolls to the section of a directory link', () => {
        setup();
        const scrollIntoView = vi.fn();
        const spy = vi.spyOn(document, 'getElementById').mockReturnValue({ scrollIntoView } as unknown as HTMLElement);
        fireEvent.click(screen.getByRole('link', { name: /activity\.log/ }));
        expect(spy).toHaveBeenCalledWith('activity-section');
        expect(scrollIntoView).toHaveBeenCalled();
        spy.mockRestore();
    });
});
