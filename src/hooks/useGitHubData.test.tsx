import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CACHE_KEY, useGitHubData } from './useGitHubData';
import { reposToProjects } from '../lib/github';

const config = {
    githubUser: 'chelebyy',
    hiddenRepos: ['StokTakip'],
    visibleForks: [] as string[],
    showArchived: true,
    featuredRepo: '',
    descriptionsTr: {} as Record<string, string>,
};

const repo = (id: number, name: string) => ({
    id,
    name,
    description: `${name} description`,
    language: 'TypeScript',
    topics: [],
    stargazers_count: 1,
    forks_count: 0,
    html_url: `https://github.com/chelebyy/${name}`,
    homepage: null,
    pushed_at: `2026-11-0${id}T00:00:00Z`,
    archived: false,
    fork: false,
    license: null,
});

const respond = (body: unknown, ok = true) => Promise.resolve({ ok, status: ok ? 200 : 403, json: () => Promise.resolve(body) } as Response);

describe('useGitHubData', () => {
    beforeEach(() => localStorage.clear());
    afterEach(() => vi.unstubAllGlobals());

    it('loads repositories and hides blocked ones', async () => {
        vi.stubGlobal('fetch', vi.fn((url: string) => {
            if (url.includes('/repos')) return respond([repo(1, 'StokTakip'), repo(2, 'ai-office')]);
            if (url.includes('/events')) return respond([]);
            return respond({ login: 'chelebyy', public_repos: 2, followers: 0 });
        }));

        const { result } = renderHook(() => useGitHubData(config));
        await waitFor(() => expect(result.current.status).toBe('ready'));
        expect(result.current.projects.map(p => p.name)).toEqual(['ai-office']);
    });

    it('applies the block list to data that was cached before the repo was blocked', () => {
        const fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            savedAt: Date.now(),
            user: null,
            projects: reposToProjects([repo(1, 'stoktakip'), repo(2, 'ai-office')]),
            activity: [],
        }));

        const { result } = renderHook(() => useGitHubData(config));
        expect(result.current.status).toBe('ready');
        expect(result.current.projects.map(p => p.name)).toEqual(['ai-office']);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('reports an error with no projects when GitHub is unavailable', async () => {
        vi.stubGlobal('fetch', vi.fn(() => respond({ message: 'API rate limit exceeded' }, false)));

        const { result } = renderHook(() => useGitHubData(config));
        await waitFor(() => expect(result.current.status).toBe('error'));
        expect(result.current.projects).toEqual([]);
    });

    it('ignores an expired cache', async () => {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            savedAt: Date.now() - 60 * 60 * 1000,
            user: null,
            projects: reposToProjects([repo(1, 'stale')]),
            activity: [],
        }));
        vi.stubGlobal('fetch', vi.fn((url: string) => url.includes('/repos') ? respond([repo(2, 'fresh')]) : respond([])));

        const { result } = renderHook(() => useGitHubData(config));
        expect(result.current.status).toBe('loading');
        await waitFor(() => expect(result.current.status).toBe('ready'));
        expect(result.current.projects.map(p => p.name)).toEqual(['fresh']);
    });
});

describe('useGitHubData request budget and activity', () => {
    beforeEach(() => localStorage.clear());
    afterEach(() => vi.unstubAllGlobals());

    it('sends a single round of requests when GitHub fails', async () => {
        const fetchMock = vi.fn(() => respond({ message: 'API rate limit exceeded' }, false));
        vi.stubGlobal('fetch', fetchMock);

        const { result } = renderHook(() => useGitHubData(config));
        await waitFor(() => expect(result.current.status).toBe('error'));
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it('keeps visible activity when many newer events come from a hidden repository', async () => {
        const hiddenTags = Array.from({ length: 60 }, (_, i) => ({
            id: `t${i}`, type: 'CreateEvent', repo: { name: 'chelebyy/StokTakip' },
            payload: { ref_type: 'tag', ref: `v${i}` }, created_at: '2026-11-09T00:00:00Z',
        }));
        const visiblePush = { id: 'p1', type: 'PushEvent', repo: { name: 'chelebyy/ai-office' }, payload: { ref: 'refs/heads/main' }, created_at: '2026-11-01T00:00:00Z' };
        vi.stubGlobal('fetch', vi.fn((url: string) => {
            if (url.includes('/repos')) return respond([repo(1, 'StokTakip'), repo(2, 'ai-office')]);
            if (url.includes('/events')) return respond([...hiddenTags, visiblePush]);
            return respond({ login: 'chelebyy' });
        }));

        const { result } = renderHook(() => useGitHubData(config));
        await waitFor(() => expect(result.current.status).toBe('ready'));
        expect(result.current.activity.map(log => log.repo)).toEqual(['chelebyy/ai-office']);
    });

    it('keeps the full visible history next to the collapsed, limited list', async () => {
        // 20 visible tags (more than the 12-line display limit), 3 consecutive pushes that collapse, 1 hidden push.
        const tags = Array.from({ length: 20 }, (_, i) => ({
            id: `t${i}`, type: 'CreateEvent', repo: { name: 'chelebyy/ai-office' },
            payload: { ref_type: 'tag', ref: `v${i}` }, created_at: '2026-11-09T00:00:00Z',
        }));
        const pushes = Array.from({ length: 3 }, (_, i) => ({
            id: `p${i}`, type: 'PushEvent', repo: { name: 'chelebyy/ai-office' }, payload: { ref: 'refs/heads/main' }, created_at: '2026-11-10T00:00:00Z',
        }));
        const hidden = { id: 'h1', type: 'PushEvent', repo: { name: 'chelebyy/StokTakip' }, payload: { ref: 'refs/heads/main' }, created_at: '2026-11-10T00:00:00Z' };
        vi.stubGlobal('fetch', vi.fn((url: string) => {
            if (url.includes('/repos')) return respond([repo(1, 'StokTakip'), repo(2, 'ai-office')]);
            if (url.includes('/events')) return respond([...pushes, hidden, ...tags]);
            return respond({ login: 'chelebyy' });
        }));

        const { result } = renderHook(() => useGitHubData(config));
        await waitFor(() => expect(result.current.status).toBe('ready'));
        expect(result.current.activity).toHaveLength(12);
        expect(result.current.activityHistory).toHaveLength(23);
        expect(result.current.activityHistory.some(log => log.repo === 'chelebyy/StokTakip')).toBe(false);
    });
});
