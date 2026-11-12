/** The CRT screen warms up (line → full screen) during the first BOOT_POWER_ON ms. */
export const BOOT_POWER_ON = 400;
/** Delay (ms) at which each intro line appears, after the screen is on. */
export const BOOT_LINE_DELAYS = [450, 900, 1350, 1800, 2250];
/** The screen switches off at BOOT_FADE_AT and the site takes over at BOOT_DONE_AT (about 3.4 s in total). */
export const BOOT_FADE_AT = 3000;
export const BOOT_DONE_AT = 3400;
