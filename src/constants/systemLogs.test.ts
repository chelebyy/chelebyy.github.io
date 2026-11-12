import { describe, it, expect } from 'vitest';
import {
    ALERT_CHANCE,
    SECRET_CHANCE,
    SECRET_MAX_GAP,
    SECRET_PASSCODE,
    SEED_LINES,
    formatLogTime,
    initialStreamState,
    nextLogLine,
    seedLogLines,
    LogLine,
    StreamState,
} from './systemLogs';
import { reposToProjects } from '../lib/github';
import { Language } from '../types';

const projects = reposToProjects([
    { id: 1, name: 'ai-office', description: '', language: 'TypeScript', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/chelebyy/ai-office', homepage: null, pushed_at: '2026-11-01T00:00:00Z', archived: false, fork: false, license: null },
]);

/** Random source that replays `values` in a loop. */
const sequence = (...values: number[]) => {
    let index = 0;
    return () => values[index++ % values.length];
};

const run = (count: number, lang: Language, random: () => number, withProjects = projects): LogLine[] => {
    let state: StreamState = initialStreamState();
    const lines: LogLine[] = [];
    for (let index = 0; index < count; index++) {
        const [line, next] = nextLogLine(state, { lang, projects: withProjects, random, now: 0 });
        lines.push(line);
        state = next;
    }
    return lines;
};

describe('system log stream', () => {
    it.each(['en', 'tr'] as const)('leaks the passcode at least every %s lines even when chance never picks it (%s)', lang => {
        // 0.99 always lands in the flavour band, so only the forced gap can produce the passcode.
        const lines = run(SECRET_MAX_GAP * 5, lang, () => 0.99);
        const positions = lines.flatMap((line, index) => (line.code === SECRET_PASSCODE ? [index] : []));
        expect(positions[0]).toBe(SECRET_MAX_GAP - 1);
        positions.slice(1).forEach((position, index) => expect(position - positions[index]).toBe(SECRET_MAX_GAP));
    });

    it('shows the passcode in the first screen the panel opens with', () => {
        const { lines } = seedLogLines(SEED_LINES, { lang: 'en', projects: [], random: () => 0.99, spacingMs: 800, now: 10_000 });
        expect(lines).toHaveLength(SEED_LINES);
        expect(lines.some(line => line.code === SECRET_PASSCODE)).toBe(true);
    });

    it('spaces seeded lines back in time so the newest is now', () => {
        const { lines } = seedLogLines(3, { lang: 'en', projects: [], random: () => 0.99, spacingMs: 800, now: 10_000 });
        expect(lines.map(line => line.time)).toEqual([8_400, 9_200, 10_000]);
        expect(lines.map(line => line.id)).toEqual([0, 1, 2]);
    });

    it.each(['en', 'tr'] as const)('prints the humanity alert in the alert band (%s)', lang => {
        const [line] = run(1, lang, sequence(ALERT_CHANCE / 2));
        expect(line.level).toBe('alert');
        expect(line.text).toContain(lang === 'en' ? 'FREE_PALESTINE' : 'ÖZGÜR_FİLİSTİN');
    });

    it('prints a passcode line in the secret band', () => {
        const [line] = run(1, 'en', sequence(ALERT_CHANCE + SECRET_CHANCE / 2, 0));
        expect(line.code).toBe(SECRET_PASSCODE);
    });

    it('builds data lines from the real repositories', () => {
        // roll in the data band, then project 0, then kind 1 (indexer line)
        const [line] = run(1, 'en', sequence(ALERT_CHANCE + SECRET_CHANCE + 0.01, 0, 0.5));
        expect(line.text).toBe('indexed ai-office/ (TypeScript)');
    });

    it('falls back to flavour lines while no repositories have loaded', () => {
        const [line] = run(1, 'en', sequence(ALERT_CHANCE + SECRET_CHANCE + 0.01, 0), []);
        expect(line.text).not.toContain('ai-office');
        expect(line.unit).not.toMatch(/gh-sync|indexer/);
    });

    it('never emits markup in line text', () => {
        const random = (() => {
            let seed = 7;
            return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
        })();
        for (const lang of ['en', 'tr'] as const) {
            for (const line of run(500, lang, random)) {
                expect(line.text).not.toMatch(/[<>]/);
            }
        }
    });

    it('formats midnight as 00, not 24', () => {
        expect(formatLogTime(new Date(2026, 0, 1, 0, 5, 9).getTime())).toBe('00:05:09');
        expect(formatLogTime(new Date(2026, 0, 1, 23, 59, 59).getTime())).toBe('23:59:59');
    });
});
