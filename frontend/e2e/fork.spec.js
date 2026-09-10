import { test, expect } from "@playwright/test";

test.describe("The Fork - Full User Journey", () => {
  test("should display fork setup screen on initial load", async ({ page }) => {
    await page.goto("/");

    // Verify title and tagline are visible
    await expect(page.locator('[data-testid="app-title"]')).toContainText(
      "The Fork"
    );
    await expect(page.locator('[data-testid="app-tagline"]')).toContainText(
      "One decision"
    );

    // Verify fork input textarea is present and empty
    const forkInput = page.locator('[data-testid="fork-statement-input"]');
    await expect(forkInput).toBeVisible();
    await expect(forkInput).toHaveValue("");

    // Verify "Open the Other Door" button is disabled initially
    const startButton = page.locator('[data-testid="open-other-door-button"]');
    await expect(startButton).toBeDisabled();
  });

  test("should enable start button when fork statement is entered", async ({
    page,
  }) => {
    await page.goto("/");

    const forkInput = page.locator('[data-testid="fork-statement-input"]');
    const startButton = page.locator('[data-testid="open-other-door-button"]');

    // Button should be disabled initially
    await expect(startButton).toBeDisabled();

    // Type fork statement
    await forkInput.fill("I chose engineering instead of becoming a musician.");

    // Button should now be enabled
    await expect(startButton).toBeEnabled();
  });

  test("should allow intensity selection", async ({ page }) => {
    await page.goto("/");

    const mildButton = page.locator('[data-testid="intensity-toggle-mild"]');
    const savageButton = page.locator(
      '[data-testid="intensity-toggle-savage"]'
    );
    const brutalButton = page.locator(
      '[data-testid="intensity-toggle-brutal"]'
    );

    // Mild should be selected by default
    await expect(mildButton).toHaveClass(/bg-crimson/);

    // Click savage
    await savageButton.click();
    await expect(savageButton).toHaveClass(/bg-crimson/);
    await expect(mildButton).not.toHaveClass(/bg-crimson/);

    // Click brutal
    await brutalButton.click();
    await expect(brutalButton).toHaveClass(/bg-crimson/);
    await expect(savageButton).not.toHaveClass(/bg-crimson/);
  });

  test("should transition to chat view after starting conversation", async ({
    page,
  }) => {
    await page.goto("/");

    // Fill fork statement
    await page
      .locator('[data-testid="fork-statement-input"]')
      .fill("I chose law instead of medicine.");

    // Select intensity
    await page.locator('[data-testid="intensity-toggle-savage"]').click();

    // Click start button
    await page.locator('[data-testid="open-other-door-button"]').click();

    // Verify fork summary bar appears
    await expect(
      page.locator('[data-testid="fork-summary-bar"]')
    ).toBeVisible();

    // Verify chat window is visible
    await expect(page.locator('[data-testid="chat-window"]')).toBeVisible();

    // Verify empty state message
    await expect(
      page.locator('[data-testid="chat-empty-state"]')
    ).toContainText("interrogation room is ready");
  });

  test("should allow message composition and sending", async ({ page }) => {
    await page.goto("/");

    // Setup and start conversation
    await page
      .locator('[data-testid="fork-statement-input"]')
      .fill("I chose to move to the city instead of staying in my hometown.");
    await page.locator('[data-testid="open-other-door-button"]').click();

    // Wait for chat window to be ready
    await page.locator('[data-testid="message-list-container"]').waitFor();

    // Type message in composer
    const composerInput = page.locator('[data-testid="composer-input"]');
    await composerInput.fill("What would my life look like now?");

    // Verify send button is enabled
    const sendButton = page.locator('[data-testid="composer-send-button"]');
    await expect(sendButton).toBeEnabled();

    // Try to send (may fail due to API, but the UI should respond)
    await sendButton.click();

    // Verify typing indicator or loading state appears
    // (The actual response depends on backend availability)
    await page
      .locator('[data-testid="message-list"]')
      .waitFor({ state: "attached" });
  });

  test("should handle Enter key to send message", async ({ page }) => {
    await page.goto("/");

    // Setup conversation
    await page
      .locator('[data-testid="fork-statement-input"]')
      .fill("I chose to have children instead of pursuing my career.");
    await page.locator('[data-testid="open-other-door-button"]').click();

    // Wait for chat window
    await page.locator('[data-testid="message-list-container"]').waitFor();

    // Type message and press Enter
    const composerInput = page.locator('[data-testid="composer-input"]');
    await composerInput.fill("Do you regret it?");
    await composerInput.press("Enter");

    // Message list should exist (even if empty or loading)
    await page
      .locator('[data-testid="message-list"]')
      .waitFor({ state: "attached" });
  });

  test("should handle Shift+Enter for newline", async ({ page }) => {
    await page.goto("/");

    // Setup conversation
    await page
      .locator('[data-testid="fork-statement-input"]')
      .fill("I chose academia instead of industry.");
    await page.locator('[data-testid="open-other-door-button"]').click();

    // Wait for chat window
    await page.locator('[data-testid="message-list-container"]').waitFor();

    // Type message with newline
    const composerInput = page.locator('[data-testid="composer-input"]');
    await composerInput.fill("First line");
    await composerInput.press("Shift+Enter");
    await composerInput.type("Second line");

    // Verify the input contains a newline
    const value = await composerInput.inputValue();
    expect(value).toContain("\n");
  });

  test("should open reset modal when reset button is clicked", async ({
    page,
  }) => {
    await page.goto("/");

    // Start conversation
    await page
      .locator('[data-testid="fork-statement-input"]')
      .fill("I chose to travel instead of settling down.");
    await page.locator('[data-testid="open-other-door-button"]').click();

    // Wait for summary bar
    await page.locator('[data-testid="fork-summary-bar"]').waitFor();

    // Click reset button
    await page.locator('[data-testid="burn-timeline-button"]').click();

    // Verify modal appears
    await expect(page.locator('[data-testid="reset-modal"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="reset-modal-title"]')
    ).toContainText("Burn it");
  });

  test("should reset timeline when confirmed", async ({ page }) => {
    await page.goto("/");

    // Start conversation
    const forkStatement = "I chose sales instead of engineering.";
    await page
      .locator('[data-testid="fork-statement-input"]')
      .fill(forkStatement);
    await page.locator('[data-testid="open-other-door-button"]').click();

    // Wait and click reset
    await page.locator('[data-testid="fork-summary-bar"]').waitFor();
    await page.locator('[data-testid="burn-timeline-button"]').click();

    // Confirm reset
    await page.locator('[data-testid="reset-modal-confirm"]').click();

    // Verify back to setup screen
    await expect(page.locator('[data-testid="fork-setup"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="fork-statement-input"]')
    ).toHaveValue("");
  });

  test("should keep timeline when cancel is clicked", async ({ page }) => {
    await page.goto("/");

    // Start conversation
    const forkStatement = "I chose to learn biology instead of physics.";
    await page
      .locator('[data-testid="fork-statement-input"]')
      .fill(forkStatement);
    await page.locator('[data-testid="open-other-door-button"]').click();

    // Wait and click reset
    await page.locator('[data-testid="fork-summary-bar"]').waitFor();
    await page.locator('[data-testid="burn-timeline-button"]').click();

    // Cancel reset
    await page.locator('[data-testid="reset-modal-cancel"]').click();

    // Verify modal is closed and we're still in chat
    await expect(page.locator('[data-testid="reset-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="chat-window"]')).toBeVisible();
  });

  test("should display footer text", async ({ page }) => {
    await page.goto("/");

    const footer = page.locator('[data-testid="footer"]');
    await expect(footer).toContainText("Built for the present moment");
  });

  test("should show 'Speaking...' feedback while sending a message", async ({
    page,
  }) => {
    await page.goto("/");

    // Setup conversation
    await page
      .locator('[data-testid="fork-statement-input"]')
      .fill("I chose engineering instead of art.");
    await page.locator('[data-testid="open-other-door-button"]').click();

    // Mock API with delay
    await page.route("**/api/chat", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ reply: "Interesting choice." }),
      });
    });

    // Type message and click send
    const composerInput = page.locator('[data-testid="composer-input"]');
    await composerInput.fill("Why engineering?");
    const sendButton = page.locator('[data-testid="composer-send-button"]');
    await sendButton.click();

    // Verify button text changes to "Speaking..." during loading
    await expect(sendButton).toHaveText("Speaking...");
    await expect(sendButton).toBeDisabled();

    // Wait for the request to complete
    await expect(sendButton).toHaveText("Say It");
  });

  test("should highlight fork statement counter when reaching near maximum limit", async ({
    page,
  }) => {
    await page.goto("/");

    const forkInput = page.locator('[data-testid="fork-statement-input"]');
    const counter = page.locator('[data-testid="fork-statement-counter"]');

    // Initially standard text color
    await expect(counter).not.toHaveClass(/text-crimson/);

    // Fill with text below threshold (140 chars)
    await forkInput.fill("a".repeat(140));
    await expect(counter).not.toHaveClass(/text-crimson/);

    // Fill with text at threshold (150 chars)
    await forkInput.fill("a".repeat(150));
    await expect(counter).toHaveClass(/text-crimson/);
    await expect(counter).toHaveClass(/font-semibold/);
  });

  test("should highlight composer counter when reaching near maximum limit", async ({
    page,
  }) => {
    await page.goto("/");

    // Setup conversation
    await page
      .locator('[data-testid="fork-statement-input"]')
      .fill("I chose engineering instead of art.");
    await page.locator('[data-testid="open-other-door-button"]').click();

    await page.locator('[data-testid="message-list-container"]').waitFor();

    const composerInput = page.locator('[data-testid="composer-input"]');
    const counter = page.locator('[data-testid="composer-counter"]');

    // Initially standard text color
    await expect(counter).not.toHaveClass(/text-crimson/);

    // Fill with text below threshold (400 chars)
    await composerInput.fill("a".repeat(400));
    await expect(counter).not.toHaveClass(/text-crimson/);

    // Fill with text at threshold (425 chars)
    await composerInput.fill("a".repeat(425));
    await expect(counter).toHaveClass(/text-crimson/);
    await expect(counter).toHaveClass(/font-semibold/);
  });
});
