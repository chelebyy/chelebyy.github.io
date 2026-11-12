import { Language, Project } from '../types';
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
    t('ok', 'kernel', 'integrity check passed', 'bütünlük kontrolü geçti'),
    t('ok', 'uplink', 'satellite uplink established', 'uydu bağlantısı kuruldu'),
    t('info', 'crypto', 'decrypting user data [##########] 100%', 'kullanıcı verisi çözülüyor [##########] %100'),
    t('warn', 'mem', 'high memory usage: 97 open browser tabs', 'yüksek bellek kullanımı: 97 açık sekme'),
    t('ok', 'render', 'render cycle optimised', 'render döngüsü optimize edildi'),
    t('info', 'auth', 'visitor verified // access level: guest (read-only)', 'ziyaretçi doğrulandı // yetki: misafir (salt okunur)'),
    t('info', 'net', 'monitoring traffic… stable', 'ağ trafiği izleniyor… stabil'),
    t('info', 'privacy', 'analysing visitor behaviour… skipped, no trackers here', 'ziyaretçi davranışı analiz ediliyor… atlandı, burada izleyici yok'),
    t('info', 'dom', 'deploying nanobots to the DOM', 'DOM’a nanobotlar gönderiliyor'),
    t('ok', 'lint', '0 errors, 0 warnings', '0 hata, 0 uyarı'),
    t('info', 'empire', 'executing order 66… skipped', 'emir 66 uygulanıyor… atlandı'),
    t('info', 'upload', 'uploading consciousness [###.......] 23%', 'bilinç yükleniyor [###.......] %23'),
    t('err', 'coffee', 'coffee level critical', 'kahve seviyesi kritik'),
    t('warn', 'coffee', 'refill requested, ETA 4 min', 'dolum istendi, tahmini 4 dk'),
    t('info', 'drive', 'initiating hyperdrive', 'hiper sürücü başlatılıyor'),
    t('warn', 'sector-7g', 'anomaly detected', 'anomali tespit edildi'),
    t('info', 'flux', 'recalibrating flux capacitor (1.21 GW)', 'akı kapasitörü kalibre ediliyor (1,21 GW)'),
    t('info', 'net', 'downloading the internet… please wait', 'internet indiriliyor… lütfen bekleyin'),
    t('warn', 'update', 'system update required [ignored]', 'sistem güncellemesi gerekli [yok sayıldı]'),
    t('ok', 'scan', 'vulnerability scan: clean', 'zafiyet taraması: temiz'),
    t('info', 'shields', 'rerouting power to shields', 'kalkanlara güç aktarılıyor'),
    t('info', 'ntp', 'clocks synchronised', 'saatler eşitlendi'),
    t('info', 'disk', 'free space: 99 TB (probably)', 'boş alan: 99 TB (muhtemelen)'),
    t('ok', 'kernel', 'kernel panic prevented', 'çekirdek paniği önlendi'),
    t('info', 'build', 'compiling source code… works on my machine', 'kaynak kod derleniyor… bende çalışıyor'),
    t('warn', 'net', 'packet loss: 0.0001%', 'paket kaybı: %0,0001'),
    t('info', 'daemon', 'loading daemon processes', 'arka plan süreçleri yükleniyor'),
    t('ok', 'verify', 'checksums match', 'sağlama toplamları eşleşti'),
    t('err', 'stackoverflow', 'connection lost, falling back to reading the docs', 'bağlantı koptu, belgeleri okumaya geçiliyor'),
    t('info', 'git', 'rebasing onto reality… 0 conflicts', 'gerçekliğe rebase ediliyor… 0 çakışma'),
    t('ok', 'cache', 'cache invalidated (one of the two hard things)', 'önbellek geçersiz kılındı (iki zor şeyden biri)'),
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

const dataLine = (projects: Project[], lang: Language, random: () => number, now: number): Template => {
    const project = projects[Math.floor(random() * projects.length)];
    const kind = Math.floor(random() * 3);
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
    random?: () => number;
    now?: number;
}

/** Picks the next log line. Pure apart from the injected random source. */
export const nextLogLine = (state: StreamState, { lang, projects, random = Math.random, now = Date.now() }: StreamContext): [LogLine, StreamState] => {
    const pick = <T,>(items: T[]): T => items[Math.floor(random() * items.length)];
    const choose = (): Template => {
        if (state.sinceSecret >= SECRET_MAX_GAP - 1) return pick(SECRETS);
        const roll = random();
        if (roll < ALERT_CHANCE) return ALERT;
        if (roll < ALERT_CHANCE + SECRET_CHANCE) return pick(SECRETS);
        if (roll < ALERT_CHANCE + SECRET_CHANCE + DATA_CHANCE && projects.length > 0) return dataLine(projects, lang, random, now);
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
