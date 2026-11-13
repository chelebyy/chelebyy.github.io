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
    it('counts event types from the full history, not the shortened list', () => {
        const shown = [push('a', 1)];
        const history = [push('a', 1), push('b', 1), push('c', 5), push('d', 40)];
        render(<ActivityLogList logs={shown} history={history} lang="en" />);

        // The type breakdown is exposed to screen readers (getAllByRole skips aria-hidden), with the full count.
        const items = screen.getAllByRole('listitem').map(item => item.textContent);
        expect(items).toContain('push4');
    });
});

describe('ActivityLogList merge lines', () => {
    it('lists every pull request folded into a merge line', () => {
        const merged: ActivityLog = {
            id: 'm',
            timestamp: daysAgo(1),
            type: 'merge',
            repo: 'chelebyy/ai-office',
            ref: '#5',
            message: '#5',
            url: 'https://github.com/chelebyy/ai-office/pull/5',
            count: 3,
            refs: ['#5', '#4', '#1'],
        };
        render(<ActivityLogList logs={[merged]} lang="en" />);

        const line = screen.getByRole('link');
        expect(line.textContent).toContain('#5 #4 #1');
        expect(line.textContent).toContain('×3');
    });
});
