import { test, expect } from "@playwright/test";

test.describe("The Fork - UX Improvements", () => {
  test("should display character counter and update correctly", async ({ page }) => {
    await page.goto("/");

    const forkInput = page.locator('[data-testid="fork-statement-input"]');
    const charCounter = page.locator('[data-testid="fork-char-counter"]');

    // Initial state
    await expect(charCounter).toBeVisible();
    await expect(charCounter).toHaveText("0 / 240");
    await expect(charCounter).toHaveClass(/text-zinc-500/);

    // Type something
    await forkInput.fill("I chose engineering.");
    await expect(charCounter).toHaveText("20 / 240");

    // Type more than 200 characters to test color change
    const longText = "a".repeat(201);
    await forkInput.fill(longText);
    await expect(charCounter).toHaveText("201 / 240");
    await expect(charCounter).toHaveClass(/text-zinc-200/);
    await expect(charCounter).toHaveClass(/font-medium/);
  });

  test("should enforce max length of 240", async ({ page }) => {
    await page.goto("/");

    const forkInput = page.locator('[data-testid="fork-statement-input"]');
    const charCounter = page.locator('[data-testid="fork-char-counter"]');

    const tooLongText = "a".repeat(300);
    await forkInput.fill(tooLongText);

    // Should be truncated at 240
    await expect(forkInput).toHaveValue("a".repeat(240));
    await expect(charCounter).toHaveText("240 / 240");
  });

  test("should show tooltip on start button when disabled", async ({ page }) => {
    await page.goto("/");

    const startButton = page.locator('[data-testid="open-other-door-button"]');

    // Verify initial disabled state and tooltip
    await expect(startButton).toBeDisabled();
    await expect(startButton).toHaveAttribute("title", "Tell me the decision first.");

    // Fill input and verify tooltip is removed
    const forkInput = page.locator('[data-testid="fork-statement-input"]');
    await forkInput.fill("I chose engineering.");
    await expect(startButton).toBeEnabled();
    await expect(startButton).toHaveAttribute("title", "");
  });
});
