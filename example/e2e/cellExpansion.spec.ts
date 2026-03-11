import { test, expect } from '@playwright/test'

test.describe('Cell Expansion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.dsg-container')).toBeVisible()
    await expect(page.locator('.dsg-row')).toHaveCount(5, { timeout: 5000 }) // header + 4 data rows
  })

  // The email column has a narrow minimum width (100px) while email addresses
  // like 'elon.musk@tesla-motors.com' are clearly wider — so clicking those
  // cells should reliably trigger expansion.

  test('active cell with overflowing content gets dsg-cell-expanded class', async ({ page }) => {
    const emailCell = page.locator('.dsg-cell').filter({ hasText: 'elon.musk@tesla-motors.com' })
    await emailCell.click()

    await expect(emailCell).toHaveClass(/dsg-cell-expanded/)
  })

  test('expanded cell is wider than its base column width', async ({ page }) => {
    const emailCell = page.locator('.dsg-cell').filter({ hasText: 'elon.musk@tesla-motors.com' })

    const basebox = await emailCell.boundingBox()
    expect(basebox).not.toBeNull()
    const baseWidth = basebox!.width

    await emailCell.click()

    const expandedBox = await emailCell.boundingBox()
    expect(expandedBox).not.toBeNull()
    expect(expandedBox!.width).toBeGreaterThan(baseWidth)
  })

  test('active cell with short content does not get dsg-cell-expanded class', async ({ page }) => {
    // "Elon" (~50px) fits comfortably inside the firstName column (100px min)
    const firstNameCell = page.locator('.dsg-cell').filter({ hasText: /^Elon$/ })
    await firstNameCell.click()

    await expect(firstNameCell).not.toHaveClass(/dsg-cell-expanded/)
  })

  test('expansion is removed when navigating to a short-content cell', async ({ page }) => {
    const emailCell = page.locator('.dsg-cell').filter({ hasText: 'elon.musk@tesla-motors.com' })
    await emailCell.click()
    await expect(emailCell).toHaveClass(/dsg-cell-expanded/)

    // Navigate left into the lastName column, which has short content ("Musk")
    await page.keyboard.press('ArrowLeft')

    await expect(emailCell).not.toHaveClass(/dsg-cell-expanded/)
    await expect(page.locator('.dsg-cell-expanded')).toHaveCount(0)
  })

  test('expansion follows the active cell on ArrowDown', async ({ page }) => {
    const firstEmailCell = page.locator('.dsg-cell').filter({ hasText: 'elon.musk@tesla-motors.com' })
    await firstEmailCell.click()
    await expect(firstEmailCell).toHaveClass(/dsg-cell-expanded/)

    await page.keyboard.press('ArrowDown')

    // Previous cell loses expansion
    await expect(firstEmailCell).not.toHaveClass(/dsg-cell-expanded/)
    // New active cell (jeff.bezos@...) also has overflowing content and should expand
    const secondEmailCell = page.locator('.dsg-cell').filter({ hasText: 'jeff.bezos@amazon-web-services.com' })
    await expect(secondEmailCell).toHaveClass(/dsg-cell-expanded/)
  })

  test('selection border width matches the expanded cell width', async ({ page }) => {
    const emailCell = page.locator('.dsg-cell').filter({ hasText: 'elon.musk@tesla-motors.com' })
    await emailCell.click()
    await expect(emailCell).toHaveClass(/dsg-cell-expanded/)

    const cellBox = await emailCell.boundingBox()
    const selectionBox = await page.locator('.dsg-active-cell').boundingBox()

    expect(cellBox).not.toBeNull()
    expect(selectionBox).not.toBeNull()
    // Allow 2px tolerance for borders
    expect(Math.abs(selectionBox!.width - cellBox!.width)).toBeLessThanOrEqual(2)
  })

  test('disabled column (checkbox) is never expanded', async ({ page }) => {
    // The Active column is a checkbox — checkboxColumn does not set displayValue
    // and its copyValue returns a boolean, which won't overflow the column
    const rows = page.locator('.dsg-row').filter({ hasNot: page.locator('.dsg-row-header') })
    const checkboxCell = rows.first().locator('.dsg-cell').nth(1) // col 0 is gutter, col 1 is Active
    await checkboxCell.click()

    await expect(checkboxCell).not.toHaveClass(/dsg-cell-expanded/)
  })

  test('Tab navigation into an overflowing cell expands it', async ({ page }) => {
    // Start on "Elon" (firstName col, row 0 — won't expand)
    const firstNameCell = page.locator('.dsg-cell').filter({ hasText: /^Elon$/ })
    await firstNameCell.click()
    await expect(firstNameCell).not.toHaveClass(/dsg-cell-expanded/)

    // Tab: lastName → Tab: email (which overflows)
    await page.keyboard.press('Tab') // lastName
    await page.keyboard.press('Tab') // email

    const emailCell = page.locator('.dsg-cell').filter({ hasText: 'elon.musk@tesla-motors.com' })
    await expect(emailCell).toHaveClass(/dsg-cell-expanded/)
  })

  test('typing long text into a short cell triggers expansion', async ({ page }) => {
    // Start on "Tesla" (company col) — short enough not to expand
    const companyCell = page.locator('.dsg-cell').filter({ hasText: /^Tesla$/ })
    await companyCell.click()
    await expect(companyCell).not.toHaveClass(/dsg-cell-expanded/)

    // Type text that is clearly longer than the column
    await page.keyboard.type('Tesla Motors Incorporated California')

    await expect(companyCell).toHaveClass(/dsg-cell-expanded/)
  })
})
