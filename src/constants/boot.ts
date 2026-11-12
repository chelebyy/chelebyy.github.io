/** The CRT screen warms up (line → full screen) during the first BOOT_POWER_ON ms. */
export const BOOT_POWER_ON = 600;
/** Delay (ms) at which each intro line appears, after the screen is on. */
export const BOOT_LINE_DELAYS = [700, 1350, 2000, 2650, 3300];
/** The exit transition starts at BOOT_FADE_AT and the site takes over at BOOT_DONE_AT (about 5.8 s in total). */
export const BOOT_FADE_AT = 4800;
export const BOOT_EXIT_MS = 1000;
export const BOOT_DONE_AT = BOOT_FADE_AT + BOOT_EXIT_MS;

/** How the intro hands over to the site once the last command has run. */
export type BootExit = 'zoom' | 'static' | 'wipe';
export const BOOT_EXITS: BootExit[] = ['zoom', 'static', 'wipe'];
