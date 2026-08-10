import { test, expect } from '@playwright/test'

const LONG_VALUE = 'A very long first name that is much wider than the column'

test.describe('cell expansion on focus', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.dsg-container')).toBeVisible()
    await expect(page.locator('.dsg-row')).toHaveCount(5, { timeout: 5000 }) // header + 4 data rows
  })

  const getFirstNameCell = (page: import('@playwright/test').Page) => {
    // Grid columns: gutter | Active (checkbox, pinned) | First name | Last name | Email | Company | Department
    const rows = page
      .locator('.dsg-row')
      .filter({ hasNot: page.locator('.dsg-row-header') })
    return rows.first().locator('.dsg-cell').nth(2)
  }

  // Selecting a cell and then typing starts editing (standard spreadsheet
  // behavior, replacing the existing value) — this is used instead of
  // dblclick() throughout, since a synthetic double-click's two mousedown
  // events can arrive faster than React re-renders activeCell between them,
  // so the click-tracking logic never recognizes it as landing on an
  // already-active cell.
  const startEditingWith = async (
    cell: ReturnType<typeof getFirstNameCell>,
    value: string
  ) => {
    await cell.click()
    await cell.page().keyboard.type(value)
  }

  test('typing a long value does not move the container scroll position', async ({
    page,
  }) => {
    const container = page.locator('.dsg-container')

    // Confirm the demo grid actually has horizontal overflow to scroll —
    // otherwise this test would trivially pass without exercising anything.
    const { scrollWidth, clientWidth } = await container.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }))
    expect(scrollWidth).toBeGreaterThan(clientWidth)

    const firstNameCell = getFirstNameCell(page)
    const columnWidth = (await firstNameCell.boundingBox())!.width

    const { scrollLeft: scrollLeftBefore, scrollTop: scrollTopBefore } =
      await container.evaluate((el) => ({
        scrollLeft: el.scrollLeft,
        scrollTop: el.scrollTop,
      }))

    await startEditingWith(firstNameCell, LONG_VALUE)
    await expect(page.locator('.dsg-input:focus')).toBeVisible()

    const { scrollLeft: scrollLeftAfter, scrollTop: scrollTopAfter } =
      await container.evaluate((el) => ({
        scrollLeft: el.scrollLeft,
        scrollTop: el.scrollTop,
      }))

    expect(scrollLeftAfter).toBe(scrollLeftBefore)
    expect(scrollTopAfter).toBe(scrollTopBefore)

    // Sanity check: the input is still focused (never unmounted mid-edit)
    // and holds the full value we typed.
    const activeValue = await page.evaluate(
      () => (document.activeElement as HTMLInputElement).value
    )
    expect(activeValue).toBe(LONG_VALUE)

    // And, where field-sizing is supported, the input actually grew past the
    // column width rather than silently truncating.
    const supported = await page.evaluate(() =>
      CSS.supports('field-sizing', 'content')
    )
    if (supported) {
      const inputWidth = await page.evaluate(
        () => (document.activeElement as HTMLElement).getBoundingClientRect().width
      )
      expect(inputWidth).toBeGreaterThan(columnWidth)
    }
  })

  test('expanded cell overlays neighboring cells without changing container scrollWidth', async ({
    page,
  }) => {
    const container = page.locator('.dsg-container')
    const scrollWidthBefore = await container.evaluate((el) => el.scrollWidth)

    const firstNameCell = getFirstNameCell(page)
    await startEditingWith(firstNameCell, LONG_VALUE)
    await expect(page.locator('.dsg-input:focus')).toBeVisible()

    const scrollWidthAfter = await container.evaluate((el) => el.scrollWidth)
    expect(scrollWidthAfter).toBe(scrollWidthBefore)
  })

  test('clicking on the overflowing part of the focused input keeps it in edit mode', async ({
    page,
  }) => {
    const supported = await page.evaluate(() =>
      CSS.supports('field-sizing', 'content')
    )
    test.skip(!supported, 'field-sizing not supported in this browser')

    const firstNameCell = getFirstNameCell(page)
    const columnBox = (await firstNameCell.boundingBox())!

    await startEditingWith(firstNameCell, LONG_VALUE)
    await expect(page.locator('.dsg-input:focus')).toBeVisible()

    const inputBox = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement
      const rect = el.getBoundingClientRect()
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
    })
    expect(inputBox.width).toBeGreaterThan(columnBox.width)

    // Click near the right edge of the now-wider input, past where the
    // original column ended — this lands geometrically over the next
    // column, but should still be treated as a click on the active input.
    await page.mouse.click(
      inputBox.x + inputBox.width - 5,
      inputBox.y + inputBox.height / 2
    )

    await expect(page.locator('.dsg-input:focus')).toBeVisible()
    const activeValue = await page.evaluate(
      () => (document.activeElement as HTMLInputElement).value
    )
    expect(activeValue).toBe(LONG_VALUE)
  })

  test('cell with focused input raises above the active-cell selection overlay', async ({
    page,
  }) => {
    const firstNameCell = getFirstNameCell(page)
    await startEditingWith(firstNameCell, 'some text')
    await expect(page.locator('.dsg-input:focus')).toBeVisible()

    const zIndex = await page.evaluate(() => {
      const input = document.activeElement
      const cell = input?.closest('.dsg-cell')
      return cell ? window.getComputedStyle(cell).zIndex : null
    })
    expect(Number(zIndex)).toBeGreaterThan(55)
  })
})
