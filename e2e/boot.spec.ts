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

        // The intro hands over to the site on its own in about three seconds.
        await expect(intro).toHaveCount(0, { timeout: 5000 });
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
});
