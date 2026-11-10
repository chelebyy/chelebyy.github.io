import { ActivityLog, GitHubEvent, GitHubRepo, GitHubUser, Project } from '../types';
import { SiteConfig } from '../config/site';

type VisibilityConfig = Pick<SiteConfig, 'githubUser' | 'hiddenRepos' | 'visibleForks' | 'showArchived'>;
type VisibilityInput = Pick<Project, 'name' | 'fork' | 'archived'>;

const normalize = (name: string) => name.trim().toLowerCase();

/** Only http(s) links from GitHub data may become hrefs. */
export const safeHttpUrl = (value: unknown): string | null => {
    if (typeof value !== 'string' || value.trim() === '') return null;
    try {
        const url = new URL(value.trim());
        return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
    } catch {
        return null;
    }
};

export const isProjectVisible = (project: VisibilityInput, config: VisibilityConfig): boolean => {
    const name = normalize(project.name);
    if (config.hiddenRepos.some(hidden => normalize(hidden) === name)) return false;
    if (project.fork && !config.visibleForks.some(fork => normalize(fork) === name)) return false;
    if (project.archived && !config.showArchived) return false;
    return true;
};

export const filterProjects = (projects: Project[], config: VisibilityConfig): Project[] =>
    projects.filter(project => isProjectVisible(project, config));

/** Activity is kept only for this account's own repositories that are visible on the site. */
export const filterActivity = (logs: ActivityLog[], projects: Project[], config: VisibilityConfig): ActivityLog[] => {
    const owner = normalize(config.githubUser);
    const visible = new Set(filterProjects(projects, config).map(project => normalize(project.name)));
    return logs.filter(log => {
        const [logOwner, repo] = log.repo.split('/');
        return normalize(logOwner ?? '') === owner && visible.has(normalize(repo ?? ''));
    });
};

export const repoToProject = (repo: GitHubRepo): Project => ({
    id: String(repo.id),
    name: repo.name,
    description: repo.description?.trim() ?? '',
    language: repo.language ?? null,
    topics: Array.isArray(repo.topics) ? repo.topics.filter(topic => typeof topic === 'string') : [],
    stars: Number(repo.stargazers_count) || 0,
    forks: Number(repo.forks_count) || 0,
    url: safeHttpUrl(repo.html_url) ?? `https://github.com/${encodeURIComponent(repo.name)}`,
    homepage: safeHttpUrl(repo.homepage),
    pushedAt: repo.pushed_at,
    archived: Boolean(repo.archived),
    fork: Boolean(repo.fork),
    license: repo.license?.spdx_id && repo.license.spdx_id !== 'NOASSERTION' ? repo.license.spdx_id : null,
});

const sortByPushed = (a: Project, b: Project) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt);

export const reposToProjects = (repos: unknown): Project[] =>
    Array.isArray(repos)
        ? (repos as GitHubRepo[])
            .filter(repo => repo && typeof repo.name === 'string' && typeof repo.id === 'number')
            .map(repoToProject)
            .sort(sortByPushed)
        : [];

export const eventToActivity = (event: GitHubEvent): ActivityLog | null => {
    const repo = event.repo?.name;
    if (typeof repo !== 'string') return null;
    const repoUrl = `https://github.com/${repo}`;
    const base = { id: String(event.id), timestamp: event.created_at, repo };

    switch (event.type) {
        case 'ReleaseEvent': {
            const release = event.payload.release;
            if (!release) return null;
            return {
                ...base,
                type: 'release',
                ref: release.tag_name,
                message: release.name || release.tag_name,
                url: safeHttpUrl(release.html_url) ?? `${repoUrl}/releases`,
            };
        }
        case 'CreateEvent': {
            if (event.payload.ref_type === 'tag' && event.payload.ref) {
                return {
                    ...base,
                    type: 'tag',
                    ref: event.payload.ref,
                    message: event.payload.ref,
                    url: `${repoUrl}/releases/tag/${encodeURIComponent(event.payload.ref)}`,
                };
            }
            if (event.payload.ref_type === 'repository') {
                return { ...base, type: 'create', message: repo.split('/')[1] ?? repo, url: repoUrl };
            }
            return null;
        }
        case 'PushEvent': {
            const branch = event.payload.ref?.replace(/^refs\/heads\//, '') ?? '';
            return {
                ...base,
                type: 'push',
                ref: branch || undefined,
                message: branch,
                url: branch ? `${repoUrl}/commits/${encodeURIComponent(branch)}` : repoUrl,
            };
        }
        case 'PullRequestEvent': {
            const number = event.payload.number;
            if (event.payload.action !== 'merged' || typeof number !== 'number') return null;
            return { ...base, type: 'merge', ref: `#${number}`, message: `#${number}`, url: `${repoUrl}/pull/${number}` };
        }
        default:
            return null;
    }
};

/** Consecutive pushes (or merges) to the same repository collapse into one line. */
export const eventsToActivity = (events: unknown, limit = 12): ActivityLog[] => {
    if (!Array.isArray(events)) return [];
    const logs: ActivityLog[] = [];
    const sorted = [...(events as GitHubEvent[])].sort((a, b) => Date.parse(b?.created_at) - Date.parse(a?.created_at));
    for (const event of sorted) {
        const log = event && typeof event === 'object' ? eventToActivity(event) : null;
        if (!log) continue;
        const previous = logs[logs.length - 1];
        if ((log.type === 'push' || log.type === 'merge') && previous?.type === log.type && previous.repo === log.repo) continue;
        logs.push(log);
        if (logs.length >= limit) break;
    }
    return logs;
};

export const pickUser = (user: unknown): GitHubUser | null => {
    if (!user || typeof user !== 'object') return null;
    const u = user as Partial<GitHubUser>;
    if (typeof u.login !== 'string') return null;
    return {
        login: u.login,
        avatar_url: safeHttpUrl(u.avatar_url) ?? '',
        bio: typeof u.bio === 'string' ? u.bio : null,
        public_repos: Number(u.public_repos) || 0,
        followers: Number(u.followers) || 0,
        html_url: safeHttpUrl(u.html_url) ?? `https://github.com/${encodeURIComponent(u.login)}`,
    };
};

export interface LanguageShare {
    language: string;
    count: number;
    share: number;
}

export const languageBreakdown = (projects: Project[], top = 4): LanguageShare[] => {
    const counts = new Map<string, number>();
    for (const project of projects) {
        if (project.language) counts.set(project.language, (counts.get(project.language) ?? 0) + 1);
    }
    const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, top)
        .map(([language, count]) => ({ language, count, share: total ? count / total : 0 }));
};
