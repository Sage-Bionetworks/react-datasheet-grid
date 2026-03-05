import React, { FC } from 'react'
import cx from 'classnames'

export const Cell: FC<{
  gutter: boolean
  stickyRight: boolean
  disabled?: boolean
  className?: string
  active?: boolean
  children?: any
  width: number
  left: number
  expandedWidth?: number
}> = ({
  children,
  gutter,
  stickyRight,
  active,
  disabled,
  className,
  width,
  left,
  expandedWidth,
}) => {
  const isExpanded = expandedWidth !== undefined && expandedWidth > width

  return (
    <div
      className={cx(
        'dsg-cell',
        gutter && 'dsg-cell-gutter',
        disabled && 'dsg-cell-disabled',
        gutter && active && 'dsg-cell-gutter-active',
        stickyRight && 'dsg-cell-sticky-right',
        isExpanded && 'dsg-cell-expanded',
        className
      )}
      style={{
        width: isExpanded ? expandedWidth : width,
        left: stickyRight ? undefined : left,
      }}
    >
      {children}
    </div>
  )
}
