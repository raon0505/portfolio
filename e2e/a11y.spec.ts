import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { navItems } from "@/data/navigation";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("랜드마크가 하나씩 있다", async ({ page }) => {
  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("main#main")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "주 메뉴" })).toHaveCount(1);
});

test("h1은 하나이고 모든 section에 제목이 있다", async ({ page }) => {
  await expect(page.locator("h1")).toHaveCount(1);

  const sections = page.locator("main section");
  const count = await sections.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await expect(sections.nth(i).locator("h1, h2").first()).toBeVisible();
  }
});

test("메뉴 앵커가 실제 섹션을 가리킨다", async ({ page }) => {
  for (const item of navItems) {
    await expect(page.locator(`main section#${item.id}`)).toHaveCount(1);
  }
});

test("skip link가 첫 Tab에서 보이고 본문으로 이동한다", async ({ page }) => {
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "본문 바로가기" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();
  await skipLink.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("axe: WCAG 2 AA 위반이 없다", async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
