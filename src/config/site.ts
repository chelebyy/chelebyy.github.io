/**
 * Site settings you edit by hand.
 *
 * Projects are pulled automatically from GitHub. Use the lists below to decide
 * what appears on the site. Repository names are matched case-insensitively.
 */
export const siteConfig = {
    /** GitHub account whose public repositories are listed. */
    githubUser: 'chelebyy',

    /** Repositories that never appear on the site (project list and activity feed). */
    hiddenRepos: [
        'chelebyy.github.io',
        'link-manager',
        'StokTakip',
    ],

    /** Forks are hidden by default. Add a fork's name here to show it. */
    visibleForks: [] as string[],

    /** Show archived repositories (they get an "archived" label). */
    showArchived: true,
};

export type SiteConfig = typeof siteConfig;
