import { test, expect } from '@playwright/test';

test.describe('Boot Sequence & Navigation', () => {
    test.beforeEach(async ({ page }) => {
        // Clear session storage to force boot sequence
        await page.goto('/');
        await page.evaluate(() => sessionStorage.clear());
        await page.reload();
    });

    test('should initialize the system and land on the home page', async ({ page }) => {
        // 1. Check for Initial Start Screen
        const initButton = page.getByRole('button', { name: /INITIALIZE SYSTEM/i });
        await expect(initButton).toBeVisible();

        // 2. Start Boot
        await initButton.click();

        // Intermediate boot phases are timer-driven and intentionally short-lived.
        // Their transitions are covered deterministically by BootSequence.test.tsx;
        // this browser test verifies the durable user outcome.
        await expect(page.getByText('chelebyy@root:~')).toBeVisible({ timeout: 15000 });
        await expect(initButton).not.toBeVisible();
        await expect(page.getByRole('button', { name: 'EN' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'CONNECT' })).toBeVisible();
    });
});