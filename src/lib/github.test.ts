import { describe, expect, it } from 'vitest';
import {
    eventsToActivity,
    filterActivity,
    filterProjects,
    isProjectVisible,
    languageBreakdown,
    reposToProjects,
    safeHttpUrl,
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
    it('maps releases, tags and pushes and collapses consecutive pushes to one repo', () => {
        const events = [
            { id: '1', type: 'PushEvent', repo: { name: 'chelebyy/a' }, payload: { ref: 'refs/heads/main' }, created_at: '2026-11-03T00:00:00Z' },
            { id: '2', type: 'PushEvent', repo: { name: 'chelebyy/a' }, payload: { ref: 'refs/heads/main' }, created_at: '2026-11-02T00:00:00Z' },
            { id: '3', type: 'ReleaseEvent', repo: { name: 'chelebyy/a' }, payload: { release: { tag_name: 'v1.0.0', name: 'First', html_url: 'https://github.com/chelebyy/a/releases/tag/v1.0.0' } }, created_at: '2026-11-01T00:00:00Z' },
            { id: '4', type: 'CreateEvent', repo: { name: 'chelebyy/b' }, payload: { ref_type: 'tag', ref: 'v2' }, created_at: '2026-10-01T00:00:00Z' },
            { id: '5', type: 'WatchEvent', repo: { name: 'chelebyy/b' }, payload: {}, created_at: '2026-10-01T00:00:00Z' },
            { id: '6', type: 'PullRequestEvent', repo: { name: 'chelebyy/b' }, payload: { action: 'opened', number: 7 }, created_at: '2026-09-02T00:00:00Z' },
            { id: '7', type: 'PullRequestEvent', repo: { name: 'chelebyy/b' }, payload: { action: 'merged', number: 7 }, created_at: '2026-09-01T00:00:00Z' },
        ];
        const logs = eventsToActivity(events);
        expect(logs.map(log => `${log.type}:${log.ref}`)).toEqual(['push:main', 'release:v1.0.0', 'tag:v2', 'merge:#7']);
        expect(logs[3].url).toBe('https://github.com/chelebyy/b/pull/7');
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
