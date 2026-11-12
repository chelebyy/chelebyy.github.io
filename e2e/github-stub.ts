import type { Page } from '@playwright/test';

const repo = (id: number, name: string, language: string, description: string, extra: Record<string, unknown> = {}) => ({
    id,
    name,
    description,
    language,
    topics: [],
    stargazers_count: id,
    forks_count: 0,
    html_url: `https://github.com/chelebyy/${name}`,
    homepage: null,
    pushed_at: `2026-11-0${id}T10:00:00Z`,
    archived: false,
    fork: false,
    license: { spdx_id: 'MIT' },
    ...extra,
});

export const repos = [
    repo(1, 'herdr-agent-workspace', 'JavaScript', 'Herdr layout for running several coding agents.'),
    repo(2, 'ai-office', 'TypeScript', 'Watch your Codex sessions in a virtual office.'),
    repo(3, 'StokTakip', 'C#', 'Blocked in site config.'),
    repo(4, 'codesaber', 'Go', 'A fork that stays hidden.', { fork: true }),
    repo(5, 'arackiralama', 'C#', 'Arac Kiralama Platformu'),
];

const events = [
    { id: 'e1', type: 'ReleaseEvent', repo: { name: 'chelebyy/ai-office' }, payload: { release: { tag_name: 'v1.2.0', name: 'Office 1.2', html_url: 'https://github.com/chelebyy/ai-office/releases/tag/v1.2.0' } }, created_at: '2026-11-05T10:00:00Z' },
    { id: 'e2', type: 'PushEvent', repo: { name: 'chelebyy/StokTakip' }, payload: { ref: 'refs/heads/main' }, created_at: '2026-11-04T10:00:00Z' },
];

/** Serve fixed GitHub API answers so browser tests never depend on the real API or its rate limit. */
export const stubGitHub = async (page: Page, options: { fail?: boolean; delayMs?: number } = {}) => {
    await page.route('https://api.github.com/**', async route => {
        // A delay makes the page render its loading state first, like a real network would.
        if (options.delayMs) await new Promise(resolve => setTimeout(resolve, options.delayMs));
        if (options.fail) return route.fulfill({ status: 403, json: { message: 'API rate limit exceeded' } });
        const url = route.request().url();
        if (url.includes('/repos')) return route.fulfill({ json: repos });
        if (url.includes('/events')) return route.fulfill({ json: events });
        return route.fulfill({ json: { login: 'chelebyy', avatar_url: '', bio: null, public_repos: repos.length, followers: 0, html_url: 'https://github.com/chelebyy' } });
    });
};

/** Skip the boot screen and pin the language so selectors are stable. */
export const skipBoot = async (page: Page, lang: 'en' | 'tr' = 'en') => {
    await page.addInitScript(([language]) => {
        sessionStorage.setItem('hasBooted', 'true');
        localStorage.setItem('cheleby:lang', language);
    }, [lang]);
};
