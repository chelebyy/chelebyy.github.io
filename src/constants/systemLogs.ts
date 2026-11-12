import { ActivityLog, Language, Project } from '../types';
import { timeAgo } from '../lib/format';

/** Passcode for the secret sector. The system log is the only place that leaks it. */
export const SECRET_PASSCODE = '1905';

export type LogLevel = 'info' | 'ok' | 'warn' | 'err' | 'alert';

/** One rendered line of the fake `tail -f sys.log` stream. Plain data: no HTML. */
export interface LogLine {
    id: number;
    /** Epoch milliseconds. */
    time: number;
    level: LogLevel;
    unit: string;
    text: string;
    /** Highlighted value appended to the text (the passcode, in yellow and red). */
    code?: string;
}

interface Template {
    level: LogLevel;
    unit: string;
    text: Record<Language, string>;
    code?: string;
}

const t = (level: LogLevel, unit: string, en: string, tr: string, code?: string): Template =>
    ({ level, unit, text: { en, tr }, code });

const FLAVOUR: Template[] = [
    // Dev classics
    t('ok', 'kernel', 'integrity check passed', 'bütünlük kontrolü geçti'),
    t('info', 'auth', 'visitor verified // access level: guest (read-only)', 'ziyaretçi doğrulandı // yetki: misafir (salt okunur)'),
    t('info', 'privacy', 'analysing visitor behaviour… skipped, no trackers here', 'ziyaretçi davranışı analiz ediliyor… atlandı, burada izleyici yok'),
    t('warn', 'mem', 'high memory usage: 97 open browser tabs', 'yüksek bellek kullanımı: 97 açık sekme'),
    t('ok', 'lint', '0 errors, 0 warnings', '0 hata, 0 uyarı'),
    t('info', 'build', 'compiling… works on my machine', 'derleniyor… bende çalışıyor'),
    t('err', 'stackoverflow', 'connection lost, falling back to reading the docs', 'bağlantı koptu, belgeleri okumaya geçiliyor'),
    t('info', 'git', 'rebasing onto reality… 0 conflicts', 'gerçekliğe rebase ediliyor… 0 çakışma'),
    t('ok', 'cache', 'cache invalidated (one of the two hard things)', 'önbellek geçersiz kılındı (iki zor şeyden biri)'),
    t('info', 'empire', 'executing order 66… skipped', 'emir 66 uygulanıyor… atlandı'),
    t('err', 'coffee', 'coffee level critical', 'kahve seviyesi kritik'),
    t('warn', 'coffee', 'refill requested, ETA 4 min', 'dolum istendi, tahmini 4 dk'),
    // The kitchen ("everything I cook ends up here, burnt ones included")
    t('info', 'oven', '2 projects in the oven, one smells burnt', 'fırında 2 proje var, biri yanık kokuyor'),
    t('warn', 'oven', 'burnt build detected, shipping it anyway', 'yanık derleme tespit edildi, yine de yayında'),
    t('info', 'pantry', 'new idea stored (total: too many)', 'kilere yeni fikir eklendi (toplam: çok fazla)'),
    t('ok', 'taste', 'tasted it, needs a few more tests', 'tadına bakıldı, biraz daha test lazım'),
    t('info', 'tea', 'brewing… the build can wait', 'demleniyor… derleme bekleyebilir'),
    t('ok', 'tea', 'second glass poured', 'ikinci bardak dolduruldu'),
    // Working with agents
    t('info', 'agents', '3 Codex sessions running, one of them is arguing', '3 Codex oturumu çalışıyor, biri tartışıyor'),
    t('ok', 'review', 'reviewer found nothing. suspicious.', 'reviewer bulgu bulmadı. şüpheli.'),
    t('warn', 'agents', 'Claude and Codex disagree, calling a referee', 'Claude ile Codex anlaşamadı, hakem çağrılıyor'),
    // Habits
    t('err', 'deploy', 'friday 17:45, deploy request denied', 'cuma 17:45, deploy isteği reddedildi'),
    t('info', 'projects', 'side project #14 started before #13 shipped', '13. bitmeden 14. yan proje başladı'),
    t('warn', 'todo', 'a TODO from 2024 is still here', '2024’ten kalma bir TODO hâlâ burada'),
    t('info', 'docs', 'README updated, code unchanged', 'README güncellendi, kod aynı'),
    t('ok', 'tests', 'all green. ran them twice to be sure', 'hepsi yeşil. emin olmak için iki kez çalıştırıldı'),
    t('info', 'clock', '02:13, one last commit', 'saat 02:13, son bir commit'),
    t('warn', 'naming', 'naming things: attempt 3', 'isim bulma: 3. deneme'),
    t('info', 'license', 'open source: take it, fork it, burn it better', 'açık kaynak: al, fork’la, daha güzel yak'),
];

/** Lines that leak the passcode. */
const SECRETS: Template[] = [
    t('info', 'oracle', 'searching for the meaning of life…', 'hayatın anlamı aranıyor…', SECRET_PASSCODE),
    t('ok', 'cimbom', 'galatasaray protocol initialised', 'galatasaray protokolü başlatıldı', SECRET_PASSCODE),
    t('warn', 'vault', 'secret key found', 'gizli anahtar bulundu', SECRET_PASSCODE),
];

const ALERT = t(
    'alert',
    'conscience',
    'SYSTEM_ALERT: humanity protocol initiated [FREE_PALESTINE 🇵🇸]',
    'SİSTEM_UYARISI: insanlık protokolü başlatıldı [ÖZGÜR_FİLİSTİN 🇵🇸]',
);

/** Chance per line of the humanity alert. */
export const ALERT_CHANCE = 0.06;
/** Chance per line of a passcode line. */
export const SECRET_CHANCE = 0.08;
/** Chance per line of a line built from the real GitHub data (when it has loaded). */
export const DATA_CHANCE = 0.3;
/** A passcode line is forced if this many lines passed without one, so every view leaks it. */
export const SECRET_MAX_GAP = 10;
/** Lines shown at once when the panel opens, like `tail` does. */
export const SEED_LINES = 10;

/** A line for one real GitHub event (repo and ref come from the API and are rendered as text). */
const activityLine = (log: ActivityLog, lang: Language, now: number): Template => {
    const repo = log.repo.split('/')[1] ?? log.repo;
    const ref = log.ref ?? '';
    const ago = timeAgo(log.timestamp, lang, now);
    switch (log.type) {
        case 'release':
            return t('ok', 'release', `${repo} ${ref} published ${ago}`, `${repo} ${ref} yayınlandı, ${ago}`);
        case 'tag':
            return t('info', 'tag', `${repo} tagged ${ref}`, `${repo} etiketlendi: ${ref}`);
        case 'create':
            return t('ok', 'init', `${repo} created ${ago}`, `${repo} oluşturuldu, ${ago}`);
        case 'merge':
            return t('ok', 'merge', `${repo} ${ref} merged ${ago}`, `${repo} ${ref} birleştirildi, ${ago}`);
        default:
            return ref
                ? t('info', 'push', `${repo} → ${ref}, ${ago}`, `${repo} → ${ref}, ${ago}`)
                : t('info', 'push', `${repo} pushed ${ago}`, `${repo} push aldı, ${ago}`);
    }
};

const dataLine = (projects: Project[], activity: ActivityLog[], lang: Language, random: () => number, now: number): Template => {
    const project = projects[Math.floor(random() * projects.length)];
    // Three project-based kinds; when there is recent activity, two more slots go to real events.
    const kind = Math.floor(random() * (activity.length > 0 ? 5 : 3));
    if (kind >= 3) return activityLine(activity[Math.floor(random() * activity.length)], lang, now);
    if (kind === 0) {
        return t('ok', 'gh-sync', `${projects.length} public repos mirrored from api.github.com`, `api.github.com’dan ${projects.length} açık depo eşitlendi`);
    }
    if (kind === 1) {
        const language = project.language ?? (lang === 'tr' ? 'dil yok' : 'no language');
        return t('info', 'indexer', `indexed ${project.name}/ (${language})`, `${project.name}/ dizinlendi (${language})`);
    }
    const ago = timeAgo(project.pushedAt, lang, now);
    return t('info', 'git', `${project.name} pushed ${ago}`, `${project.name} son push: ${ago}`);
};

export interface StreamState {
    nextId: number;
    sinceSecret: number;
    lastText: string | null;
}

export const initialStreamState = (): StreamState => ({ nextId: 0, sinceSecret: 0, lastText: null });

export interface StreamContext {
    lang: Language;
    projects: Project[];
    /** Recent public GitHub events, already filtered like the activity list. */
    activity?: ActivityLog[];
    random?: () => number;
    now?: number;
}

/** Picks the next log line. Pure apart from the injected random source. */
export const nextLogLine = (state: StreamState, { lang, projects, activity = [], random = Math.random, now = Date.now() }: StreamContext): [LogLine, StreamState] => {
    const pick = <T,>(items: T[]): T => items[Math.floor(random() * items.length)];
    const choose = (): Template => {
        if (state.sinceSecret >= SECRET_MAX_GAP - 1) return pick(SECRETS);
        const roll = random();
        if (roll < ALERT_CHANCE) return ALERT;
        if (roll < ALERT_CHANCE + SECRET_CHANCE) return pick(SECRETS);
        if (roll < ALERT_CHANCE + SECRET_CHANCE + DATA_CHANCE && projects.length > 0) return dataLine(projects, activity, lang, random, now);
        return pick(FLAVOUR);
    };
    let template = choose();
    // One retry keeps the same line from printing twice in a row most of the time.
    if (template.text[lang] === state.lastText) template = choose();

    const line: LogLine = {
        id: state.nextId,
        time: now,
        level: template.level,
        unit: template.unit,
        text: template.text[lang],
        code: template.code,
    };
    return [line, {
        nextId: state.nextId + 1,
        sinceSecret: template.code ? 0 : state.sinceSecret + 1,
        lastText: line.text,
    }];
};

/** The first screen of the stream: `count` lines spaced `spacingMs` apart, ending at `now`. */
export const seedLogLines = (count: number, context: StreamContext & { spacingMs: number }): { lines: LogLine[]; state: StreamState } => {
    const now = context.now ?? Date.now();
    let state = initialStreamState();
    const lines: LogLine[] = [];
    for (let index = 0; index < count; index++) {
        const [line, next] = nextLogLine(state, { ...context, now: now - (count - 1 - index) * context.spacingMs });
        lines.push(line);
        state = next;
    }
    return { lines, state };
};

/** 24-hour HH:MM:SS. `hourCycle: 'h23'` because `hour12: false` can print "24:05:00". */
export const formatLogTime = (time: number): string =>
    new Date(time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
