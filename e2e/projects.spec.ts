import { test, expect } from '@playwright/test';
import { skipBoot, stubGitHub } from './github-stub';

test.describe('Projects from GitHub', () => {
    test('the explore button scrolls straight to the project list', async ({ page }) => {
        await stubGitHub(page);
        await skipBoot(page);
        await page.setViewportSize({ width: 1280, height: 480 });
        await page.goto('/');

        const heading = page.getByRole('heading', { name: /^projects/ });
        await expect(heading).not.toBeInViewport();
        await page.getByRole('button', { name: './explore_projects' }).click();
        await expect(heading).toBeInViewport({ timeout: 1500 });
        await expect(page.getByText('INITIALIZING_KERNEL')).toHaveCount(0);
    });

    test('lists public repositories but hides blocked repos and forks everywhere', async ({ page }) => {
        await stubGitHub(page);
        await skipBoot(page);
        await page.goto('/');

        const list = page.locator('#projects-section');
        await expect(list.getByRole('heading', { name: 'ai-office' })).toBeVisible();
        await expect(list.getByRole('heading', { name: 'arackiralama' })).toBeVisible();
        await expect(list.getByRole('heading', { name: 'StokTakip' })).toHaveCount(0);
        await expect(list.getByRole('heading', { name: 'codesaber' })).toHaveCount(0);

        const activity = page.locator('#activity-section');
        await expect(activity.getByText('ai-office')).toBeVisible();
        await expect(activity.getByText('StokTakip')).toHaveCount(0);
    });

    test('filters with grep and by language', async ({ page }) => {
        await stubGitHub(page);
        await skipBoot(page);
        await page.goto('/');

        const list = page.locator('#projects-section');
        await list.getByRole('searchbox').fill('office');
        await expect(list.getByRole('heading', { level: 3 })).toHaveText(['ai-office']);

        await list.getByRole('searchbox').fill('');
        await page.getByRole('button', { name: /c#/i }).first().click();
        await expect(list.getByRole('heading', { level: 3 })).toHaveText(['arackiralama']);
    });

    test('pins the featured repo first and greps the Turkish description shown on the TR page', async ({ page }) => {
        await stubGitHub(page);
        await skipBoot(page, 'tr');
        await page.goto('/');

        const list = page.locator('#projects-section');
        await expect(list.getByRole('heading', { level: 3 }).first()).toHaveText('herdr-agent-workspace');
        await expect(list.locator('li').first().getByText('öne çıkan')).toBeVisible();

        await list.getByRole('searchbox').fill('sanal bir ofiste');
        await expect(list.getByRole('heading', { level: 3 })).toHaveText(['ai-office']);
    });

    test('shows an honest error instead of placeholder projects when GitHub fails', async ({ page }) => {
        await stubGitHub(page, { fail: true });
        await skipBoot(page);
        await page.goto('/');

        const list = page.locator('#projects-section');
        await expect(list.getByText(/github\.com did not answer/)).toBeVisible();
        await expect(list.getByRole('button', { name: 'Retry' })).toBeVisible();
        await expect(list.getByRole('heading', { level: 3 })).toHaveCount(0);
    });
});
