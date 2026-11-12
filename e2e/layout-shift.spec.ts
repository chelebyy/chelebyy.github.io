import { test, expect, type Page } from '@playwright/test';
import { skipBoot, stubGitHub } from './github-stub';

/** Sum of layout-shift scores so far (the CLS a visitor would feel on this load). */
const layoutShiftTotal = (page: Page) =>
    page.evaluate(() => new Promise<number>(resolve => {
        let total = 0;
        new PerformanceObserver(list => {
            for (const entry of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
                if (!entry.hadRecentInput) total += entry.value;
            }
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve(total), 300);
    }));

test.describe('Layout stability', () => {
    // Only Chromium exposes layout-shift entries.
    test.skip(({ browserName }) => browserName !== 'chromium', 'layout-shift API is Chromium-only');

    for (const viewport of [{ width: 1350, height: 940 }, { width: 375, height: 812 }]) {
        test(`GitHub data arriving late does not shift the page at ${viewport.width}px`, async ({ page }) => {
            // Web fonts swapping in shift text on their own schedule; keep the fallback font so
            // this test measures only the shift caused by GitHub data arriving.
            await page.route(/fonts\.(googleapis|gstatic)\.com/, route => route.abort());
            await stubGitHub(page, { delayMs: 800 });
            await skipBoot(page);
            await page.setViewportSize(viewport);
            await page.goto('/');

            await expect(page.locator('#projects-section').getByRole('heading', { level: 3 }).first()).toBeVisible();
            // Before the fix this scenario measured 0.04 at 1350px; anything visible above the
            // noise floor means a section moved when the data arrived.
            expect(await layoutShiftTotal(page)).toBeLessThan(0.01);
        });
    }
});
