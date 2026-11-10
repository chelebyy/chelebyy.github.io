import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CACHE_KEY, useGitHubData } from './useGitHubData';
import { reposToProjects } from '../lib/github';

const config = {
    githubUser: 'chelebyy',
    hiddenRepos: ['StokTakip'],
    visibleForks: [] as string[],
    showArchived: true,
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
