import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ActivityLogList from './ActivityLogList';
import { ActivityLog } from '../types';

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

const push = (id: string, n: number): ActivityLog => ({
    id,
    timestamp: daysAgo(n),
    type: 'push',
    repo: 'chelebyy/ai-office',
    ref: 'main',
    message: 'main',
    url: 'https://github.com/chelebyy/ai-office/commits/main',
});

describe('ActivityLogList summaries', () => {
    it('builds the heatmap and type counts from the full history, not the shortened list', () => {
        const shown = [push('a', 1)];
        const history = [push('a', 1), push('b', 1), push('c', 5), push('d', 40)];
        render(<ActivityLogList logs={shown} history={history} lang="en" />);

        expect(screen.getByRole('img', { name: '4 events on 3 days in the last 90 days' })).toBeTruthy();
        // The type breakdown is exposed to screen readers (getAllByRole skips aria-hidden), with the full count.
        const items = screen.getAllByRole('listitem').map(item => item.textContent);
        expect(items).toContain('push4');
    });
});
