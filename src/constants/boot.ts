/** The CRT screen warms up (line → full screen) during the first BOOT_POWER_ON ms. */
export const BOOT_POWER_ON = 600;
/** Delay (ms) at which each intro line appears, after the screen is on. */
export const BOOT_LINE_DELAYS = [700, 1350, 2000, 2650, 3300];
/** The screen switches off at BOOT_FADE_AT and the site takes over at BOOT_DONE_AT (about 5.4 s in total). */
export const BOOT_FADE_AT = 4800;
export const BOOT_DONE_AT = 5400;
