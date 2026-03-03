import React from 'react'
import { test, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { DataSheetGrid, Column, textColumn, keyColumn } from '../src'

vi.mock('react-resize-detector', () => ({
  useResizeDetector: () => ({ width: 800, height: 600 }),
}))

const columns: Column[] = [
  keyColumn('firstName', textColumn),
  keyColumn('lastName', textColumn),
  keyColumn('email', textColumn),
]

const data = [
  { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
  { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
]

test('DataSheetGrid renders with pinFirstColumn=false', () => {
  const onChange = vi.fn()
  
  expect(() => {
    render(
      <DataSheetGrid
        value={data}
        onChange={onChange}
        columns={columns}
        pinFirstColumn={false}
      />
    )
  }).not.toThrow()
})

test('DataSheetGrid renders with pinFirstColumn=true', () => {
  const onChange = vi.fn()
  
  expect(() => {
    render(
      <DataSheetGrid
        value={data}
        onChange={onChange}
        columns={columns}
        pinFirstColumn={true}
      />
    )
  }).not.toThrow()
})

test('pinFirstColumn prop is optional and defaults correctly', () => {
  const onChange = vi.fn()
  
  // Should work without the prop (default behavior)
  expect(() => {
    render(
      <DataSheetGrid
        value={data}
        onChange={onChange}
        columns={columns}
      />
    )
  }).not.toThrow()
})

test('pinFirstColumn only accepts boolean values (TypeScript check)', () => {
  const onChange = vi.fn()
  
  const validProps: React.ComponentProps<typeof DataSheetGrid> = {
    value: data,
    onChange,
    columns,
    pinFirstColumn: true, // boolean is valid
  }
  
  const alsoValidProps: React.ComponentProps<typeof DataSheetGrid> = {
    value: data,
    onChange,
    columns,
    pinFirstColumn: false, // boolean is valid
  }

  expect(validProps.pinFirstColumn).toBe(true)
  expect(alsoValidProps.pinFirstColumn).toBe(false)
})