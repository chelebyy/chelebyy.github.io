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

    /** Repository pinned to the top of the list with a "featured" highlight. Empty string turns it off. */
    featuredRepo: 'herdr-agent-workspace',

    /**
     * Turkish descriptions shown on the TR page instead of the GitHub description.
     * Keyed by repository name (case-insensitive). Repos not listed keep their GitHub text.
     */
    descriptionsTr: {
        'herdr-agent-workspace':
            'Birden fazla kodlama ajanını yan yana çalıştırmak için Herdr düzeni: göstergeler, kota, önceliğe göre ajanlar, takım nabzı, görev ön ayarları ve takım modu, Android ve kaynak panelleri. Türkçe/İngilizce arayüz.',
        'ai-office':
            'Codex oturumlarını ve ajanlarını sanal bir ofiste çalışırken izle. Masaüstü tarayıcı arayüzü; Windows ve Linux (Ubuntu/WSL) üzerinde denendi. macOS ve diğer LLM\'ler denenmedi. MIT.',
        skills:
            'Pratik yazılım geliştirme için ajan becerileri: projeye duyarlı test, güvenlik, GitHub CI ve depo yönetişimi ile başlıyor.',
    } as Record<string, string>,
};

export type SiteConfig = typeof siteConfig;

const turkishDescriptions = new Map(
    Object.entries(siteConfig.descriptionsTr).map(([name, text]) => [name.toLowerCase(), text]),
);

/** Hand-written Turkish description for a repo, if one exists. */
export const turkishDescription = (repoName: string): string | undefined =>
    turkishDescriptions.get(repoName.toLowerCase());

export const isFeatured =(repoName: string): boolean =>
    siteConfig.featuredRepo !== '' && repoName.toLowerCase() === siteConfig.featuredRepo.toLowerCase();
