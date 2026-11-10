import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityLog, GitHubUser, Project } from '../types';
import { siteConfig as defaultConfig, SiteConfig } from '../config/site';
import { eventsToActivity, filterActivity, filterProjects, pickUser, reposToProjects } from '../lib/github';

export const CACHE_KEY = 'cheleby:github:v2';
const LEGACY_CACHE_KEYS = ['github_cache', 'github_cache_time'];
export const CACHE_TTL_MS = 10 * 60 * 1000;

export type GitHubDataStatus = 'loading' | 'ready' | 'error';

interface CachedData {
    savedAt: number;
    user: GitHubUser | null;
    projects: Project[];
    activity: ActivityLog[];
}

export interface GitHubData {
    status: GitHubDataStatus;
    user: GitHubUser | null;
    projects: Project[];
    activity: ActivityLog[];
    syncedAt: number | null;
    retry: () => void;
}

const readCache = (): CachedData | null => {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw) as CachedData;
        if (typeof data?.savedAt !== 'number' || !Array.isArray(data.projects) || !Array.isArray(data.activity)) return null;
        if (Date.now() - data.savedAt > CACHE_TTL_MS || data.savedAt > Date.now()) return null;
        return data;
    } catch {
        return null;
    }
};

const writeCache = (data: CachedData) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        LEGACY_CACHE_KEYS.forEach(key => localStorage.removeItem(key));
    } catch {
        /* Storage full or disabled: the site still works without a cache. */
    }
};

const fetchJson = async (url: string, signal: AbortSignal): Promise<unknown> => {
    const response = await fetch(url, { signal, headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error(`GitHub ${response.status}`);
    return response.json();
};

/**
 * Loads public repositories and recent activity from GitHub.
 * Visibility rules from the site config are applied on every read, including cached data,
 * so a repository added to `hiddenRepos` disappears even from an existing cache.
 */
export const useGitHubData = (config: SiteConfig = defaultConfig): GitHubData => {
    const [raw, setRaw] = useState<{ status: GitHubDataStatus; data: CachedData | null }>(() => {
        const cached = readCache();
        return cached ? { status: 'ready', data: cached } : { status: 'loading', data: null };
    });

    useEffect(() => {
        if (raw.status === 'ready') return;
        const controller = new AbortController();
        const user = encodeURIComponent(config.githubUser);
        const base = `https://api.github.com/users/${user}`;

        const load = async () => {
            const [userResult, reposResult, eventsResult] = await Promise.allSettled([
                fetchJson(base, controller.signal),
                fetchJson(`${base}/repos?type=owner&sort=pushed&per_page=100`, controller.signal),
                fetchJson(`${base}/events/public?per_page=100`, controller.signal),
            ]);
            if (controller.signal.aborted) return;

            if (reposResult.status !== 'fulfilled') {
                setRaw({ status: 'error', data: null });
                return;
            }

            const data: CachedData = {
                savedAt: Date.now(),
                user: userResult.status === 'fulfilled' ? pickUser(userResult.value) : null,
                projects: reposToProjects(reposResult.value),
                activity: eventsResult.status === 'fulfilled' ? eventsToActivity(eventsResult.value, 40) : [],
            };
            // Cache only complete results so one failed request does not hide activity for the whole TTL.
            if (userResult.status === 'fulfilled' && eventsResult.status === 'fulfilled') writeCache(data);
            setRaw({ status: 'ready', data });
        };

        load().catch(() => {
            if (!controller.signal.aborted) setRaw({ status: 'error', data: null });
        });
        return () => controller.abort();
    }, [raw.status, config.githubUser]);

    const retry = useCallback(() => setRaw(current => current.status === 'error' ? { status: 'loading', data: null } : current), []);

    return useMemo(() => {
        const projects = raw.data ? filterProjects(raw.data.projects, config) : [];
        const activity = raw.data ? filterActivity(raw.data.activity, raw.data.projects, config).slice(0, 12) : [];
        return {
            status: raw.status,
            user: raw.data?.user ?? null,
            projects,
            activity,
            syncedAt: raw.data?.savedAt ?? null,
            retry,
        };
    }, [raw, config, retry]);
};
