import { test, expect } from '@playwright/test';
import { stubGitHub } from './github-stub';

test.describe('Boot Sequence & Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await stubGitHub(page);
        await page.addInitScript(() => localStorage.setItem('cheleby:lang', 'en'));
    });

    test('should initialize the system and land on the home page', async ({ page }) => {
        test.setTimeout(45_000);
        await page.goto('/');

        const initButton = page.getByRole('button', { name: /INITIALIZE SYSTEM/i });
        await expect(initButton).toBeVisible();
        await initButton.click();

        // Intermediate boot phases are timer-driven and covered by BootSequence.test.tsx;
        // this browser test verifies the durable user outcome.
        await expect(page.getByTestId('boot-sequence')).toHaveCount(0, { timeout: 30000 });
        await expect(page.getByText('chelebyy@cheleby.me')).toBeVisible();
        await expect(page.getByRole('button', { name: 'en', exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: /terminal/i })).toBeVisible();
    });
});
