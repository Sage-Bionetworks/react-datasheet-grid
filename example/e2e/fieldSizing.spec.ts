import { test, expect } from '@playwright/test'

test.describe('field-sizing: content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.dsg-container')).toBeVisible()
    await expect(page.locator('.dsg-row')).toHaveCount(5, { timeout: 5000 }) // header + 4 data rows
  })

  test('input expands beyond column width when typing a long value (supported browsers)', async ({
    page,
  }) => {
    const supported = await page.evaluate(() =>
      CSS.supports('field-sizing', 'content')
    )
    test.skip(!supported, 'field-sizing not supported in this browser')

    // "First name" is the 3rd cell (after gutter + Active checkbox)
    const firstDataRow = page
      .locator('.dsg-row')
      .filter({ hasNot: page.locator('.dsg-row-header') })
      .first()
    const firstNameCell = firstDataRow.locator('.dsg-cell').nth(2)

    const cellBox = await firstNameCell.boundingBox()
    expect(cellBox).not.toBeNull()
    const columnWidth = cellBox!.width

    await firstNameCell.dblclick()
    await page.keyboard.type('A very long first name that exceeds column width')

    // Measure the focused input directly — more reliable than re-resolving the cell
    // locator after the grid re-renders on input.
    const inputWidth = await page.evaluate(
      () => (document.activeElement as HTMLElement).getBoundingClientRect().width
    )
    expect(inputWidth).toBeGreaterThan(columnWidth)
  })

  test('cell gets z-index: 2 while its input is focused (supported browsers)', async ({
    page,
  }) => {
    const supported = await page.evaluate(() =>
      CSS.supports('field-sizing', 'content')
    )
    test.skip(!supported, 'field-sizing not supported in this browser')

    const firstDataRow = page
      .locator('.dsg-row')
      .filter({ hasNot: page.locator('.dsg-row-header') })
      .first()
    const firstNameCell = firstDataRow.locator('.dsg-cell').nth(2)

    await firstNameCell.dblclick()
    await page.keyboard.type('some text')

    // Walk up from document.activeElement to find the actual .dsg-cell that the
    // :has(.dsg-input:focus) rule targets — more reliable than re-resolving the locator.
    const zIndex = await page.evaluate(() => {
      const input = document.activeElement
      if (!input) return null
      const cell = input.closest('.dsg-cell')
      if (!cell) return null
      return window.getComputedStyle(cell).zIndex
    })
    expect(zIndex).toBe('2')
  })

  test('input expands to ~3× column width as fallback when field-sizing is unsupported', async ({
    page,
  }) => {
    const supported = await page.evaluate(() =>
      CSS.supports('field-sizing', 'content')
    )
    test.skip(supported, 'field-sizing is supported — fallback test not applicable')

    const firstDataRow = page
      .locator('.dsg-row')
      .filter({ hasNot: page.locator('.dsg-row-header') })
      .first()
    const firstNameCell = firstDataRow.locator('.dsg-cell').nth(2)

    const cellBox = await firstNameCell.boundingBox()
    expect(cellBox).not.toBeNull()
    const columnWidth = cellBox!.width

    await firstNameCell.dblclick()

    const inputWidth = await page.evaluate(
      () => (document.activeElement as HTMLElement).getBoundingClientRect().width
    )
    // The fallback sets width: 300% on the input, so it should be ~3× the column width
    expect(inputWidth).toBeCloseTo(columnWidth * 3, -1)
  })
})
