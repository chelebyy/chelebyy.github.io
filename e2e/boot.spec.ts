import { test, expect } from '@playwright/test';

test.describe('Boot Sequence & Navigation', () => {
    test.beforeEach(async ({ page }) => {
        // Clear session storage to force boot sequence
        await page.goto('/');
        await page.evaluate(() => sessionStorage.clear());
        await page.reload();
    });

    test('should go through boot sequence and land on home page', async ({ page }) => {
        // 1. Check for Initial Start Screen
        const initButton = page.getByRole('button', { name: /INITIALIZE SYSTEM/i });
        await expect(initButton).toBeVisible();

        // 2. Start Boot
        await initButton.click();

        // 3. Verify BIOS Phase
        await expect(page.getByText('BIOS_MEM_CHECK')).toBeVisible();

        // 4. Verify Auth Phase (wait for it to appear)
        await expect(page.getByText('AUTHENTICATING_USER')).toBeVisible({ timeout: 10000 });

        // 5. Verify Access Granted
        await expect(page.getByText('ACCESS GRANTED')).toBeVisible({ timeout: 10000 });

        // 6. Verify Boot Sequence Ends (Home Page Loaded)
        // We check for elements that are on the dashboard but not in boot
        await expect(page.getByText('System Ready')).not.toBeVisible(); // Boot phrase gone

        // Check for Header or Hero content
        // Check for Header or Hero content
        // 'chelebyy@root:~' is typed out in the header
        await expect(page.getByText('chelebyy@root:~')).toBeVisible({ timeout: 10000 });
        // Note: Header types this out, so we might need to wait or check static text
        // Let's check the language toggle or something static
        await expect(page.getByRole('button', { name: 'EN' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'CONNECT' })).toBeVisible();
    });
});
