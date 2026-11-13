import { describe, expect, it } from 'vitest';
import {
    eventsToActivity,
    filterActivity,
    filterProjects,
    isProjectVisible,
    languageBreakdown,
    reposToProjects,
    safeHttpUrl,
    summarizeActivity,
} from './github';
import { ActivityLog, GitHubRepo, Project } from '../types';

const config = {
    githubUser: 'chelebyy',
    hiddenRepos: ['StokTakip', 'link-manager'],
    visibleForks: ['Lemma'],
    showArchived: true,
};

const repo = (overrides: Partial<GitHubRepo>): GitHubRepo => ({
    id: 1,
    name: 'tool',
    description: 'A tool',
    language: 'TypeScript',
    topics: [],
    stargazers_count: 0,
    forks_count: 0,
    html_url: 'https://github.com/chelebyy/tool',
    homepage: null,
    pushed_at: '2026-11-01T00:00:00Z',
    archived: false,
    fork: false,
    license: null,
    ...overrides,
});

const project = (name: string, overrides: Partial<Project> = {}): Project => ({
    ...reposToProjects([repo({ name })])[0],
    ...overrides,
});

describe('isProjectVisible', () => {
    it('hides blocked repositories regardless of letter case', () => {
        expect(isProjectVisible(project('stoktakip'), config)).toBe(false);
        expect(isProjectVisible(project('STOKTAKIP'), config)).toBe(false);
        expect(isProjectVisible(project('Link-Manager'), config)).toBe(false);
        expect(isProjectVisible(project('ai-office'), config)).toBe(true);
    });

    it('hides forks unless they are listed in visibleForks', () => {
        expect(isProjectVisible(project('codesaber', { fork: true }), config)).toBe(false);
        expect(isProjectVisible(project('lemma', { fork: true }), config)).toBe(true);
    });

    it('hides archived repositories only when showArchived is false', () => {
        const archived = project('old', { archived: true });
        expect(isProjectVisible(archived, config)).toBe(true);
        expect(isProjectVisible(archived, { ...config, showArchived: false })).toBe(false);
    });
});

describe('filterActivity', () => {
    const log = (repoName: string): ActivityLog => ({
        id: repoName,
        timestamp: '2026-11-01T00:00:00Z',
        type: 'push',
        repo: repoName,
        message: 'main',
        url: `https://github.com/${repoName}`,
    });

    it('drops activity from blocked, unknown and foreign repositories', () => {
        const projects = [project('ai-office'), project('StokTakip')];
        const logs = [log('chelebyy/ai-office'), log('chelebyy/StokTakip'), log('chelebyy/private-thing'), log('someone/ai-office')];
        expect(filterActivity(logs, projects, config).map(entry => entry.repo)).toEqual(['chelebyy/ai-office']);
    });
});

describe('reposToProjects', () => {
    it('sorts by last push and drops malformed entries', () => {
        const projects = reposToProjects([
            repo({ id: 1, name: 'older', pushed_at: '2026-01-01T00:00:00Z' }),
            { nope: true },
            repo({ id: 2, name: 'newer', pushed_at: '2026-11-01T00:00:00Z' }),
        ]);
        expect(projects.map(p => p.name)).toEqual(['newer', 'older']);
    });

    it('returns an empty list for a non-array API response', () => {
        expect(reposToProjects({ message: 'API rate limit exceeded' })).toEqual([]);
    });

    it('never turns a non-http homepage into a link', () => {
        const [p] = reposToProjects([repo({ homepage: 'javascript:alert(1)' })]);
        expect(p.homepage).toBeNull();
        expect(safeHttpUrl('https://cheleby.me/')).toBe('https://cheleby.me/');
    });
});

describe('eventsToActivity', () => {
    it('maps releases, tags, pushes and merged pull requests and drops other events', () => {
        const events = [
            { id: '1', type: 'PushEvent', repo: { name: 'chelebyy/a' }, payload: { ref: 'refs/heads/main' }, created_at: '2026-11-03T12:00:00Z' },
            { id: '2', type: 'PushEvent', repo: { name: 'chelebyy/a' }, payload: { ref: 'refs/heads/main' }, created_at: '2026-11-03T08:00:00Z' },
            { id: '3', type: 'ReleaseEvent', repo: { name: 'chelebyy/a' }, payload: { release: { tag_name: 'v1.0.0', name: 'First', html_url: 'https://github.com/chelebyy/a/releases/tag/v1.0.0' } }, created_at: '2026-11-01T00:00:00Z' },
            { id: '4', type: 'CreateEvent', repo: { name: 'chelebyy/b' }, payload: { ref_type: 'tag', ref: 'v2' }, created_at: '2026-10-01T00:00:00Z' },
            { id: '5', type: 'WatchEvent', repo: { name: 'chelebyy/b' }, payload: {}, created_at: '2026-10-01T00:00:00Z' },
            { id: '6', type: 'PullRequestEvent', repo: { name: 'chelebyy/b' }, payload: { action: 'opened', number: 7 }, created_at: '2026-09-02T00:00:00Z' },
            { id: '7', type: 'PullRequestEvent', repo: { name: 'chelebyy/b' }, payload: { action: 'merged', number: 7 }, created_at: '2026-09-01T00:00:00Z' },
        ];
        const logs = eventsToActivity(events);
        expect(logs.map(log => `${log.type}:${log.ref}`)).toEqual(['push:main', 'push:main', 'release:v1.0.0', 'tag:v2', 'merge:#7']);
        expect(logs[4].url).toBe('https://github.com/chelebyy/b/pull/7');
    });
});

describe('summarizeActivity', () => {
    const push = (id: string, repoName: string, ref: string, at: string) =>
        ({ id, type: 'PushEvent', repo: { name: repoName }, payload: { ref: `refs/heads/${ref}` }, created_at: at });
    const merge = (id: string, number: number, at: string, repoName = 'chelebyy/ai-office') =>
        ({ id, type: 'PullRequestEvent', repo: { name: repoName }, payload: { action: 'merged', number }, created_at: at });
    const tag = (id: string, repoName: string, at: string) =>
        ({ id, type: 'CreateEvent', repo: { name: repoName }, payload: { ref_type: 'tag', ref: id }, created_at: at });

    it('shows one line per project: its newest event, and how many more it had', () => {
        const logs = eventsToActivity([
            push('1', 'chelebyy/ai-office', 'main', '2026-11-03T20:00:00Z'),
            tag('t1', 'chelebyy/skills', '2026-11-03T18:00:00Z'),
            push('2', 'chelebyy/ai-office', 'main', '2026-11-03T10:00:00Z'),
            merge('m1', 4, '2026-11-02T10:00:00Z'),
            tag('t0', 'chelebyy/skills', '2026-11-01T18:00:00Z'),
        ]);
        const lines = summarizeActivity(logs, []);
        expect(lines.map(log => `${log.id}x${log.count ?? 1}+${log.more ?? 0}`)).toEqual(['1x2+1', 't1x1+1']);
    });

    it('folds pushes to one repo on one day, even when a hidden repo pushed in between', () => {
        const logs = eventsToActivity([
            push('1', 'chelebyy/ai-office', 'main', '2026-11-03T20:00:00Z'),
            push('2', 'chelebyy/StokTakip', 'main', '2026-11-03T15:00:00Z'),
            push('3', 'chelebyy/ai-office', 'main', '2026-11-03T10:00:00Z'),
            push('4', 'chelebyy/ai-office', 'main', '2026-11-02T10:00:00Z'),
        ]);
        const visible = filterActivity(logs, [project('ai-office'), project('StokTakip')], config);
        expect(summarizeActivity(visible, []).map(log => `${log.id}x${log.count}+${log.more}`)).toEqual(['1x2+1']);
    });

    it('folds one day of merges into one line that lists every pull request and opens the merged list', () => {
        const logs = eventsToActivity([
            merge('m5', 5, '2026-11-02T12:00:00Z'),
            push('p1', 'chelebyy/ai-office', 'main', '2026-11-02T11:00:00Z'),
            merge('m4', 4, '2026-11-02T10:00:00Z'),
            push('p2', 'chelebyy/ai-office', 'claude/linux-support', '2026-11-02T09:00:00Z'),
            merge('m1', 1, '2026-11-02T08:00:00Z'),
            merge('m0', 9, '2026-11-01T08:00:00Z'),
        ]);
        const [line, ...rest] = summarizeActivity(logs, []);
        expect(rest).toEqual([]);
        expect(`${line.id}x${line.count}`).toBe('m5x3');
        // Every merged pull request stays listed on its line, newest first.
        expect(line.refs).toEqual(['#5', '#4', '#1']);
        expect(line.url).toBe('https://github.com/chelebyy/ai-office/pulls?q=is%3Apr+is%3Amerged');
        // The main-branch push and the older merge are counted; the feature-branch push is not.
        expect(line.more).toBe(2);
    });

    it('keeps a single merge on its own pull request link', () => {
        const [line] = summarizeActivity(eventsToActivity([merge('m', 9, '2026-11-01T08:00:00Z')]), []);
        expect(line.refs).toEqual(['#9']);
        expect(line.url).toBe('https://github.com/chelebyy/ai-office/pull/9');
    });

    it('recognises a merged pull request in both event shapes GitHub sends', () => {
        const logs = eventsToActivity([
            { id: 'a', type: 'PullRequestEvent', repo: { name: 'chelebyy/ai-office' }, payload: { action: 'merged', number: 5 }, created_at: '2026-11-02T12:00:00Z' },
            { id: 'b', type: 'PullRequestEvent', repo: { name: 'chelebyy/ai-office' }, payload: { action: 'closed', number: 4, pull_request: { merged: true } }, created_at: '2026-11-02T11:00:00Z' },
            { id: 'c', type: 'PullRequestEvent', repo: { name: 'chelebyy/ai-office' }, payload: { action: 'closed', number: 3, pull_request: { merged: false } }, created_at: '2026-11-02T10:00:00Z' },
        ]);
        expect(logs.map(log => `${log.type}:${log.ref}`)).toEqual(['merge:#5', 'merge:#4']);
    });

    it('uses the default branch GitHub reports for the repository', () => {
        const logs = eventsToActivity([
            push('1', 'chelebyy/ai-office', 'main', '2026-11-02T12:00:00Z'),
            push('2', 'chelebyy/ai-office', 'develop', '2026-11-02T11:00:00Z'),
        ]);
        const [projectWithDevelop] = reposToProjects([repo({ name: 'ai-office', default_branch: 'develop' })]);
        expect(summarizeActivity(logs, [projectWithDevelop]).map(log => log.id)).toEqual(['2']);
    });

    it('fills in projects without recent events from their last push, newest first, up to the limit', () => {
        const logs = eventsToActivity([merge('m', 3, '2026-11-02T08:00:00Z', 'chelebyy/AI-Office')]);
        const projects = [
            project('ai-office', { pushedAt: '2026-11-05T00:00:00Z' }),
            project('skills', { pushedAt: '2026-11-04T00:00:00Z', url: 'https://github.com/chelebyy/skills' }),
            project('Depo', { pushedAt: '2024-01-01T00:00:00Z' }),
            project('Intranet', { pushedAt: '2026-06-01T00:00:00Z' }),
        ];
        const lines = summarizeActivity(logs, projects, 3, 'chelebyy');
        // ai-office keeps its real event (matched case-insensitively) instead of a fallback line.
        expect(lines.map(log => `${log.type}:${log.repo}`)).toEqual([
            'push:chelebyy/skills',
            'merge:chelebyy/AI-Office',
            'push:chelebyy/Intranet',
        ]);
        expect(lines[0]).toMatchObject({ timestamp: '2026-11-04T00:00:00Z', url: 'https://github.com/chelebyy/skills' });
        expect(lines[0].ref).toBeUndefined();
    });
});

describe('languageBreakdown', () => {
    it('counts the most used languages', () => {
        const projects = [project('a'), project('b'), project('c', { language: 'C#' }), project('d', { language: null })];
        expect(languageBreakdown(projects)).toEqual([
            { language: 'TypeScript', count: 2, share: 2 / 3 },
            { language: 'C#', count: 1, share: 1 / 3 },
        ]);
    });
});

describe('filterProjects', () => {
    it('keeps order while removing hidden entries', () => {
        expect(filterProjects([project('a'), project('StokTakip'), project('b')], config).map(p => p.name)).toEqual(['a', 'b']);
    });
});
