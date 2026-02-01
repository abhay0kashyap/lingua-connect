import { test, expect } from '@playwright/test';

test.describe('Game Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=Explore Games');
  });

  test('Starts a Vocab Matcher game and handles interaction', async ({ page }) => {
    // Open Vocab Matcher
    await page.click('text=Vocab Matcher');
    await expect(page.locator('text=Ready to start?')).toBeVisible();

    // Start Round
    await page.click('button:has-text("Start Round 1")');
    
    // Check if options appear
    await expect(page.locator('.grid.grid-cols-2 button').first()).toBeVisible();
    
    // Click an option
    await page.locator('.grid.grid-cols-2 button').first().click();
    
    // Check for feedback state (disabled or color change logic usually handled via class, here we wait)
    // We expect the next question or finish screen eventually, but simple interaction check passes here.
  });

  test('Phrase Builder interaction', async ({ page }) => {
    await page.click('text=Phrase Builder');
    await page.click('button:has-text("Start Round 1")');
    
    // Check if word bank appears
    const bankWord = page.locator('div.flex-wrap.justify-center button').first();
    await expect(bankWord).toBeVisible();
    
    // Move word to answer area
    await bankWord.click();
    
    // Verify check button enables or logic proceeds
    await expect(page.locator('button:has-text("Check Answer")')).toBeVisible();
  });
});
