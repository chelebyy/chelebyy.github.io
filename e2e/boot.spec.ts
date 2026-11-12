import { test, expect } from '@playwright/test';
import { stubGitHub } from './github-stub';

test.describe('Intro & Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await stubGitHub(page);
        await page.addInitScript(() => localStorage.setItem('cheleby:lang', 'en'));
    });

    test('plays a short intro without a click and lands on the home page', async ({ page }) => {
        await page.goto('/');

        const intro = page.getByTestId('boot-sequence');
        await expect(intro).toBeVisible();
        await expect(intro.getByText('ssh guest@cheleby.me')).toBeVisible();

        // The intro hands over to the site on its own in about five and a half seconds.
        await expect(intro).toHaveCount(0, { timeout: 8000 });
        await expect(page.getByTitle('System control')).toContainText('chelebyy:~/open-source$');
        await expect(page.getByRole('button', { name: 'en', exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: /terminal/i })).toBeVisible();
    });

    test('can be skipped with a key press and does not replay in the same session', async ({ page }) => {
        await page.goto('/');
        const intro = page.getByTestId('boot-sequence');
        await expect(intro).toBeVisible();

        await page.keyboard.press('Space');
        await expect(intro).toHaveCount(0, { timeout: 1000 });

        await page.reload();
        await expect(page.getByTitle('System control')).toBeVisible();
        await expect(intro).toHaveCount(0);
    });

    test('is not shown to visitors who prefer reduced motion', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto('/');
        await expect(page.getByTitle('System control')).toBeVisible();
        await expect(page.getByTestId('boot-sequence')).toHaveCount(0);
    });

    for (const width of [280, 320, 375]) {
        test(`keeps every intro line inside the monitor screen at ${width} px`, async ({ page }) => {
            await page.setViewportSize({ width, height: 640 });
            await page.goto('/');

            const intro = page.getByTestId('boot-sequence');
            await expect(intro.getByText('open ./open-source')).toBeVisible();

            const glass = await intro.locator('.crt-glass').boundingBox();
            // Measure the rendered text itself (a Range), not the paragraph box,
            // so text that overflows a fixed-width paragraph is caught too.
            const lines = await intro.locator('.crt-screen p').evaluateAll(nodes =>
                nodes.map(node => {
                    const range = document.createRange();
                    range.selectNodeContents(node);
                    const text = range.getBoundingClientRect();
                    const lineHeight = parseFloat(getComputedStyle(node).lineHeight);
                    return { bottom: text.bottom, right: text.right, rows: Math.round(text.height / lineHeight) };
                }));
            expect(glass).toBeTruthy();
            expect(lines).toHaveLength(5);
            for (const line of lines) {
                // A terminal line must not wrap, and its text must stay inside the glass.
                expect(line.rows).toBe(1);
                expect(line.bottom).toBeLessThanOrEqual(glass!.y + glass!.height);
                expect(line.right).toBeLessThanOrEqual(glass!.x + glass!.width);
            }
        });
    }
});
