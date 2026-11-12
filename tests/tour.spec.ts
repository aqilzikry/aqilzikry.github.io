import { expect, test } from "@playwright/test";

const card = (page: import("@playwright/test").Page) => page.locator("[data-tour-card]");

test.describe("Site tour", () => {
  test("covers the basics across pages, then lets visitors skip to the tools", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Take a guided tour of the site" }).click();

    await expect(card(page)).toBeVisible();
    await expect(page.locator("[data-tour-phase]")).toHaveText("Basics · 1 of 7");
    await expect(page.locator("[data-tour-title]")).toHaveText("Welcome! Here's a quick tour");

    await page.locator("[data-tour-next]").click();
    await expect(page.locator("[data-tour-title]")).toHaveText("Get around from anywhere");
    await page.locator("[data-tour-next]").click();
    await expect(page.locator("[data-tour-title]")).toHaveText("The tool bench");

    // Crossing to the tools page keeps the tour going.
    await page.locator("[data-tour-next]").click();
    await expect(page).toHaveURL(/\/tools\/$/);
    await expect(page.locator("[data-tour-title]")).toHaveText("Find a tool fast");
    await expect(page.locator("[data-tour-phase]")).toHaveText("Basics · 4 of 7");
    await page.locator("[data-tour-next]").click();
    await expect(page.locator("[data-tour-title]")).toHaveText("Pick a utility");
    await page.locator("[data-tour-next]").click();
    await expect(page.locator("[data-tour-title]")).toHaveText("Work in the stage");
    await page.locator("[data-tour-next]").click();

    await expect(page.locator("[data-tour-title]")).toHaveText("That's the basics");
    await page.getByRole("button", { name: "Start using the tools" }).click();
    await expect(card(page)).toBeHidden();
    await expect(page.locator("#tool-search")).toBeFocused();

    // Ended tours do not resume on the next page load.
    await page.reload();
    await expect(card(page)).toBeHidden();
  });

  test("continues past the checkpoint to cover every homepage section", async ({ page }) => {
    await page.goto("/tools/");
    await page.getByRole("button", { name: "Take a guided tour of the site" }).click();
    // Started on the tools page, the tour skips the homepage-only teaser.
    await expect(page.locator("[data-tour-phase]")).toHaveText("Basics · 1 of 6");

    const titles: string[] = [];
    for (let i = 0; i < 30 && (await card(page).isVisible()); i++) {
      titles.push((await page.locator("[data-tour-title]").textContent()) ?? "");
      await page.locator("[data-tour-next]").click();
      await page.waitForLoadState();
    }

    expect(titles).toEqual([
      "Welcome! Here's a quick tour",
      "Get around from anywhere",
      "Find a tool fast",
      "Pick a utility",
      "Work in the stage",
      "That's the basics",
      "Private by design",
      "Who's behind this",
      "About",
      "Experience",
      "Projects",
      "Tech stack",
      "Let's talk",
    ]);
    await expect(page).toHaveURL(/\/$/);
    await expect(card(page)).toBeHidden();
  });

  test("closes with Escape and keeps the card on screen on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/tools/");
    await page.getByRole("button", { name: "Take a guided tour of the site" }).click();
    for (let i = 0; i < 4; i++) await page.locator("[data-tour-next]").click();

    const box = await card(page).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);

    await page.keyboard.press("Escape");
    await expect(card(page)).toBeHidden();
  });
});
