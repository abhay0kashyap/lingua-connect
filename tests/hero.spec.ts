import { test, expect } from '@playwright/test';

test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Language selectors update persistence', async ({ page }) => {
    // Select French as target
    await page.selectOption('#target-lang', 'fr');
    
    // Check if Chat button updates text
    await expect(page.locator('button:has-text("Chat in French")')).toBeVisible();
    
    // Reload and check persistence
    await page.reload();
    await expect(page.locator('#target-lang')).toHaveValue('fr');
  });

  test('Start Chat navigates to Lobby', async ({ page }) => {
    await page.click('button:has-text("Chat in")');
    await expect(page.locator('text=AI Tutor')).toBeVisible();
  });

  test('3D Globe background exists', async ({ page }) => {
    // Check for canvas in background
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
  });
});
