import { test, expect } from '@playwright/test';
import { skipBoot, stubGitHub } from './github-stub';

test.describe('Command Palette Interaction', () => {
    test.beforeEach(async ({ page }) => {
        await stubGitHub(page);
        await skipBoot(page);
        await page.goto('/');
        await expect(page.getByRole('button', { name: /terminal/i })).toBeVisible();
    });

    test('should open palette, execute help command, and exit', async ({ page }) => {
        // Open through the visible header control so the interaction is consistent across browser engines.
        await page.getByRole('button', { name: /terminal/i }).click();

        // 2. Verify Open
        const input = page.getByPlaceholder('Enter command...');
        await expect(input).toBeVisible();

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
        await page.getByRole('button', { name: /terminal/i }).click();
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
