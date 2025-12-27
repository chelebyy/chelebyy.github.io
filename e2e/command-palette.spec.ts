import { test, expect } from '@playwright/test';

test.describe('Command Palette Interaction', () => {
    test.beforeEach(async ({ page }) => {
        // Bypass Boot Sequence logic if possible, or just wait through it.
        // Setting sessionStorage 'hasBooted' to 'true' should skip boot in App.tsx
        await page.goto('/');
        await page.evaluate(() => sessionStorage.setItem('hasBooted', 'true'));
        await page.reload();

        // Ensure we are on the main dashboard
        // Wait for the Connect button or the Header terminal text
        await expect(page.getByRole('button', { name: /Connect/i })).toBeVisible();
    });

    test('should open palette, execute help command, and exit', async ({ page }) => {
        // 1. Open with Shortcut (Ctrl+K or Meta+K)
        /* 
           Note: Playwright's keyboard.press('Control+k') works for Windows/Linux.
           For reliable cross-platform, we might try both or just 'Control+k' since setup is Windows.
        */
        await page.keyboard.press('Control+k');

        // 2. Verify Open
        const input = page.getByPlaceholder('Enter command...');
        await expect(input).toBeVisible();
        await expect(input).toBeFocused();

        // 3. Type "help" and Enter
        await input.fill('help');
        await page.keyboard.press('Enter');

        // 4. Verify Output
        // "Available commands:" part of text
        await expect(page.getByText('Available commands:')).toBeVisible();

        // 5. Type "exit" to close
        await input.fill('exit');
        await page.keyboard.press('Enter');

        // 6. Verify Closed
        await expect(input).not.toBeVisible();
    });

    test('should toggle Matrix mode', async ({ page }) => {
        await page.keyboard.press('Control+k');
        const input = page.getByPlaceholder('Enter command...');

        // Enable Matrix
        await input.fill('matrix');
        await page.keyboard.press('Enter');
        await expect(page.getByText('Wake up, Neo...')).toBeVisible();

        // Verify Matrix Element (canvas or identifiable div) 
        // MatrixRain component usually has a fixed canvas z-[5]
        // We can check if a canvas exists
        const canvas = page.locator('canvas');
        await expect(canvas).toBeAttached();

        // Disable Matrix
        await input.fill('matrix');
        await page.keyboard.press('Enter');
        await expect(page.getByText('The Matrix has been disabled')).toBeVisible();
    });
});
