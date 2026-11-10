import { Language } from '../types';

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 365 * 24 * 3600],
    ['month', 30 * 24 * 3600],
    ['week', 7 * 24 * 3600],
    ['day', 24 * 3600],
    ['hour', 3600],
    ['minute', 60],
];

/** "3 days ago" / "3 gün önce". Invalid dates yield an empty string. */
export const timeAgo = (iso: string | number, lang: Language, now = Date.now()): string => {
    const then = typeof iso === 'number' ? iso : Date.parse(iso);
    if (Number.isNaN(then)) return '';
    const seconds = Math.round((then - now) / 1000);
    const formatter = new Intl.RelativeTimeFormat(lang, { numeric: 'auto', style: 'long' });
    for (const [unit, size] of UNITS) {
        if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit);
    }
    return formatter.format(0, 'minute');
};

/** ISO date as YYYY-MM-DD, the way `git log --date=short` prints it. */
export const shortDate = (iso: string): string => {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? '----------' : date.toISOString().slice(0, 10);
};

/** GitHub linguist-style colors for the languages likely to appear. */
const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    'C#': '#178600',
    Go: '#00ADD8',
    Rust: '#dea584',
    Kotlin: '#A97BFF',
    Swift: '#F05138',
    Java: '#b07219',
    Shell: '#89e051',
    PowerShell: '#012456',
    HTML: '#e34c26',
    CSS: '#663399',
    Dart: '#00B4AB',
    Vue: '#41b883',
};

export const languageColor = (language: string | null): string =>
    (language && LANGUAGE_COLORS[language]) || '#6b7280';
