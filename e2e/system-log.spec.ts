import { test, expect } from '@playwright/test';
import { skipBoot, stubGitHub } from './github-stub';

test.describe('System log panel', () => {
    test.beforeEach(async ({ page }) => {
        await stubGitHub(page);
        await skipBoot(page);
        await page.goto('/');
    });

    test('stays out of the tab order while closed', async ({ page }) => {
        const opener = page.getByRole('button', { name: 'tail -f sys.log' });
        await expect(opener).toBeVisible();
        // The panel is mounted off-screen; without inert its buttons would be reachable.
        await expect(page.getByRole('button', { name: 'Close system log' })).toHaveCount(0);
        for (let index = 0; index < 40; index++) {
            await page.keyboard.press('Tab');
            const insidePanel = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
            expect(insidePanel).toBe(false);
        }
    });

    test('opens with focus inside, leaks the passcode, closes on Escape and restores focus', async ({ page }) => {
        const opener = page.getByRole('button', { name: 'tail -f sys.log' });
        await opener.click();

        const dialog = page.getByRole('dialog', { name: 'tail -f /var/log/sys.log' });
        await expect(dialog).toBeVisible();
        await expect(page.getByRole('button', { name: 'Close system log' })).toBeFocused();
        await expect(dialog.getByText('1905').first()).toBeVisible();

        // Tab cycles inside the dialog.
        for (let index = 0; index < 6; index++) {
            await page.keyboard.press('Tab');
            const insidePanel = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
            expect(insidePanel).toBe(true);
        }

        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
        await expect(opener).toBeFocused();
    });
});
