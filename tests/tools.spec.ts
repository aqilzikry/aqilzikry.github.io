import { expect, test } from "@playwright/test";

const selectTool = async (page: import("@playwright/test").Page, id: string) => {
  await page.locator(`[data-tool="${id}"]`).click();
  await expect(page.locator(`[data-panel="${id}"]`)).toBeVisible();
};

test.describe("Tools page", () => {
  test("links homepage tool pills to their tools", async ({ page }) => {
    await page.goto("/");

    const deadlinePill = page.getByRole("link", { name: "Deadline countdown" });
    await expect(deadlinePill).toHaveAttribute("href", /\/tools\/#deadline$/);
    await deadlinePill.click();

    await expect(page).toHaveURL(/\/tools\/#deadline$/);
    await expect(page.locator("[data-active-title]")).toHaveText("Deadline countdown");
    await expect(page.locator('[data-panel="deadline"]')).toBeVisible();
  });

  for (const viewport of [
    { name: "desktop", width: 1280, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    test(`scrolls a referenced tool into view on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/tools/#deadline");

      await expect(page.locator("[data-active-title]")).toHaveText("Deadline countdown");
      await expect(page.locator('[data-tool="deadline"]')).toHaveClass(/active/);
      await page.waitForFunction(() => {
        const workspace = document.querySelector("[data-tools-workspace]");
        const nav = document.querySelector(".tool-nav");
        const active = document.querySelector('[data-tool="deadline"]');
        if (!workspace || !nav || !active) return false;
        const { y } = workspace.getBoundingClientRect();
        const navBox = nav.getBoundingClientRect();
        const activeBox = active.getBoundingClientRect();
        return (
          y >= 80 &&
          y <= 160 &&
          activeBox.x >= navBox.x &&
          activeBox.x + activeBox.width <= navBox.x + navBox.width + 1
        );
      });

      const workspaceBox = await page.locator("[data-tools-workspace]").boundingBox();
      const navBox = await page.locator(".tool-nav").boundingBox();
      const activeBox = await page.locator('[data-tool="deadline"]').boundingBox();

      expect(workspaceBox).not.toBeNull();
      expect(navBox).not.toBeNull();
      expect(activeBox).not.toBeNull();
      expect(workspaceBox!.y).toBeGreaterThanOrEqual(80);
      expect(workspaceBox!.y).toBeLessThanOrEqual(160);
      expect(activeBox!.x).toBeGreaterThanOrEqual(navBox!.x);
      expect(activeBox!.x + activeBox!.width).toBeLessThanOrEqual(navBox!.x + navBox!.width + 1);
      expect(activeBox!.y + activeBox!.height).toBeGreaterThanOrEqual(0);
      expect(activeBox!.y).toBeLessThanOrEqual(viewport.height);
    });
  }

  test("keeps datetime fields inside the mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/tools");

    for (const tool of ["timezone", "deadline"]) {
      await selectTool(page, tool);

      const input = page.locator(tool === "timezone" ? "#timezone-date" : "#deadline-input");
      const inputBox = await input.boundingBox();
      const workspaceBox = await page.locator("[data-tools-workspace]").boundingBox();

      expect(inputBox).not.toBeNull();
      expect(workspaceBox).not.toBeNull();
      expect(inputBox!.x).toBeGreaterThanOrEqual(workspaceBox!.x);
      expect(inputBox!.x + inputBox!.width).toBeLessThanOrEqual(workspaceBox!.x + workspaceBox!.width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    }
  });

  test("runs the browser-based utilities", async ({ page }) => {
    await page.goto("/tools");

    await expect(page.getByRole("heading", { name: "Useful, without the detour." })).toBeVisible();
    await expect(page.locator("[data-active-title]")).toHaveText("Color converter");

    await page.locator("#hex-input").fill("#336699");
    await expect(page.locator("#rgb-output")).toHaveValue("rgb(51, 102, 153)");
    await expect(page.locator("#hsl-output")).toHaveValue("hsl(210, 50%, 40%)");
    await expect(page.locator("#color-feedback")).toHaveText("Color values updated.");

    await page.locator("#tool-search").fill("encode");
    await expect(page.locator('[data-tool="base64"]')).toBeVisible();
    await expect(page.locator('[data-tool="url"]')).toBeVisible();
    await expect(page.locator('[data-tool="color"]')).toBeHidden();
    await page.locator("#tool-search").fill("definitely-not-a-tool");
    await expect(page.locator(".tool-empty")).toBeVisible();
    await page.locator("#tool-search").fill("");

    await selectTool(page, "validator");
    await page.locator("#validator-input").fill('{"status":"ready","count":2}');
    await page.locator("#validate-button").click();
    await expect(page.locator("#validator-input")).toHaveValue('{\n  "status": "ready",\n  "count": 2\n}');
    await expect(page.locator("#validator-feedback")).toHaveText(/Valid JSON .* formatted successfully\./);

    await selectTool(page, "jwt");
    await page.locator("#jwt-input").fill(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b29scy10ZXN0IiwibmFtZSI6IkFxaWwifQ.signature"
    );
    await page.locator("#jwt-button").click();
    await expect(page.locator("#jwt-header")).toHaveValue('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
    await expect(page.locator("#jwt-payload")).toHaveValue(/"sub": "tools-test"/);

    await selectTool(page, "base64");
    await page.locator("#base64-input").fill("Hello Tools");
    await page.locator("#base64-encode").click();
    await expect(page.locator("#base64-output")).toHaveValue("SGVsbG8gVG9vbHM=");
    await page.locator("#base64-input").fill("U2VsYW1hdA==");
    await page.locator("#base64-decode").click();
    await expect(page.locator("#base64-output")).toHaveValue("Selamat");

    await selectTool(page, "url");
    await page.locator("#url-input").fill("hello world & status=ready");
    await page.locator("#url-encode").click();
    await expect(page.locator("#url-output")).toHaveValue("hello%20world%20%26%20status%3Dready");
    await page.locator("#url-input").fill("hello%20tools");
    await page.locator("#url-decode").click();
    await expect(page.locator("#url-output")).toHaveValue("hello tools");

    await selectTool(page, "budget");
    await page.locator("#budget-income").fill("8000");
    await expect(page.locator("#budget-needs")).toHaveText("RM 4,000.00");
    await expect(page.locator("#budget-wants")).toHaveText("RM 2,400.00");
    await expect(page.locator("#budget-savings")).toHaveText("RM 1,600.00");

    await selectTool(page, "deadline");
    await page.locator("#deadline-input").fill("2099-01-01T00:00");
    await expect(page.locator("#deadline-feedback")).toHaveText("Countdown is live.");
  });
});
