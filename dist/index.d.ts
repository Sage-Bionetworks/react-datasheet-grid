import * as React from 'react';
import React__default, { FC } from 'react';

type Cell = {
    col: number;
    row: number;
};
type CellProps$1<T, C> = {
    rowData: T;
    rowIndex: number;
    columnIndex: number;
    active: boolean;
    focus: boolean;
    disabled: boolean;
    columnData: C;
    setRowData: (rowData: T) => void;
    stopEditing: (opts?: {
        nextRow?: boolean;
    }) => void;
    insertRowBelow: () => void;
    duplicateRow: () => void;
    deleteRow: () => void;
    getContextMenuItems: () => ContextMenuItem$1[];
};
type CellComponent$1<T, C> = (props: CellProps$1<T, C>) => JSX.Element;
type Column$1<T, C, PasteValue> = {
    id?: string;
    headerClassName?: string;
    title?: React__default.ReactNode;
    /** @deprecated Use `basis`, `grow`, and `shrink` instead */
    width?: string | number;
    basis: number;
    grow: number;
    shrink: number;
    minWidth: number;
    maxWidth?: number;
    component: CellComponent$1<T, C>;
    columnData?: C;
    disableKeys: boolean;
    disabled: boolean | ((opt: {
        rowData: T;
        rowIndex: number;
    }) => boolean);
    cellClassName?: string | ((opt: {
        rowData: T;
        rowIndex: number;
        columnId?: string;
    }) => string | undefined);
    keepFocus: boolean;
    deleteValue: (opt: {
        rowData: T;
        rowIndex: number;
    }) => T;
    copyValue: (opt: {
        rowData: T;
        rowIndex: number;
    }) => number | string | null;
    pasteValue: (opt: {
        rowData: T;
        value: PasteValue;
        rowIndex: number;
    }) => T;
    prePasteValues: (values: string[]) => PasteValue[] | Promise<PasteValue[]>;
    isCellEmpty: (opt: {
        rowData: T;
        rowIndex: number;
    }) => boolean;
};
type SimpleColumn$1<T, C> = Partial<Pick<Column$1<T, C, string>, 'title' | 'maxWidth' | 'minWidth' | 'basis' | 'grow' | 'shrink' | 'component' | 'columnData'>>;
type AddRowsComponentProps$1 = {
    addRows: (count?: number) => void;
};
type ContextMenuItem$1 = {
    type: 'INSERT_ROW_BELLOW' | 'DELETE_ROW' | 'DUPLICATE_ROW' | 'COPY' | 'CUT' | 'PASTE';
    action: () => void;
} | {
    type: 'DELETE_ROWS' | 'DUPLICATE_ROWS';
    action: () => void;
    fromRow: number;
    toRow: number;
};
type ContextMenuComponentProps$1 = {
    clientX: number;
    clientY: number;
    items: ContextMenuItem$1[];
    cursorIndex: Cell;
    close: () => void;
};
type Operation = {
    type: 'UPDATE' | 'DELETE' | 'CREATE';
    fromRowIndex: number;
    toRowIndex: number;
};
type DataSheetGridProps$1<T> = {
    value?: T[];
    style?: React__default.CSSProperties;
    className?: string;
    rowClassName?: string | ((opt: {
        rowData: T;
        rowIndex: number;
    }) => string | undefined);
    cellClassName?: string | ((opt: {
        rowData: unknown;
        rowIndex: number;
        columnId?: string;
    }) => string | undefined);
    onChange?: (value: T[], operations: Operation[]) => void;
    columns?: Partial<Column$1<T, any, any>>[];
    gutterColumn?: SimpleColumn$1<T, any> | false;
    stickyRightColumn?: SimpleColumn$1<T, any>;
    rowKey?: string | ((opts: {
        rowData: T;
        rowIndex: number;
    }) => string);
    height?: number;
    rowHeight?: number | ((opt: {
        rowData: T;
        rowIndex: number;
    }) => number);
    headerRowHeight?: number;
    addRowsComponent?: ((props: AddRowsComponentProps$1) => React__default.ReactElement | null) | false;
    createRow?: () => T;
    duplicateRow?: (opts: {
        rowData: T;
        rowIndex: number;
    }) => T;
    autoAddRow?: boolean;
    lockRows?: boolean;
    disableContextMenu?: boolean;
    disableExpandSelection?: boolean;
    disableSmartDelete?: boolean;
    contextMenuComponent?: (props: ContextMenuComponentProps$1) => React__default.ReactElement | null;
    onFocus?: (opts: {
        cell: CellWithId;
    }) => void;
    onBlur?: (opts: {
        cell: CellWithId;
    }) => void;
    onActiveCellChange?: (opts: {
        cell: CellWithId | null;
    }) => void;
    onSelectionChange?: (opts: {
        selection: SelectionWithId | null;
    }) => void;
    onScroll?: React__default.UIEventHandler<HTMLDivElement> | undefined;
};
type CellWithIdInput = {
    col: number | string;
    row: number;
};
type SelectionWithIdInput = {
    min: CellWithIdInput;
    max: CellWithIdInput;
};
type CellWithId = {
    colId?: string;
    col: number;
    row: number;
};
type SelectionWithId = {
    min: CellWithId;
    max: CellWithId;
};
type DataSheetGridRef$1 = {
    activeCell: CellWithId | null;
    selection: SelectionWithId | null;
    setActiveCell: (activeCell: CellWithIdInput | null) => void;
    setSelection: (selection: SelectionWithIdInput | null) => void;
};

type TextColumnOptions<T> = {
    placeholder?: string;
    alignRight?: boolean;
    continuousUpdates?: boolean;
    deletedValue?: T;
    parseUserInput?: (value: string) => T;
    formatBlurredInput?: (value: T) => string;
    formatInputOnFocus?: (value: T) => string;
    formatForCopy?: (value: T) => string;
    parsePastedValue?: (value: string) => T;
};
type TextColumnData<T> = {
    placeholder?: string;
    alignRight: boolean;
    continuousUpdates: boolean;
    parseUserInput: (value: string) => T;
    formatBlurredInput: (value: T) => string;
    formatInputOnFocus: (value: T) => string;
};
declare const textColumn: Partial<Column$1<string | null, TextColumnData<string | null>, string>>;
declare function createTextColumn<T = string | null>({ placeholder, alignRight, continuousUpdates, deletedValue, parseUserInput, formatBlurredInput, formatInputOnFocus, formatForCopy, parsePastedValue, }?: TextColumnOptions<T>): Partial<Column$1<T, TextColumnData<T>, string>>;

declare const checkboxColumn: Partial<Column$1<boolean, any, string>>;

declare const floatColumn: Partial<Column$1<number | null, {
    placeholder?: string | undefined;
    alignRight: boolean;
    continuousUpdates: boolean;
    parseUserInput: (value: string) => number | null;
    formatBlurredInput: (value: number | null) => string;
    formatInputOnFocus: (value: number | null) => string;
}, string>>;

declare const intColumn: Partial<Column$1<number | null, {
    placeholder?: string | undefined;
    alignRight: boolean;
    continuousUpdates: boolean;
    parseUserInput: (value: string) => number | null;
    formatBlurredInput: (value: number | null) => string;
    formatInputOnFocus: (value: number | null) => string;
}, string>>;

declare const percentColumn: Partial<Column$1<number | null, {
    placeholder?: string | undefined;
    alignRight: boolean;
    continuousUpdates: boolean;
    parseUserInput: (value: string) => number | null;
    formatBlurredInput: (value: number | null) => string;
    formatInputOnFocus: (value: number | null) => string;
}, string>>;

declare const dateColumn: Partial<Column$1<Date | null, any, string>>;

declare const isoDateColumn: Partial<Column$1<string | null, any, string>>;

type ColumnData = {
    key: string;
    original: Partial<Column$1<any, any, any>>;
};
declare const keyColumn: <T extends Record<string, any>, K extends keyof T = keyof T, PasteValue = string>(key: K, column: Partial<Column$1<T[K], any, PasteValue>>) => Partial<Column$1<T, ColumnData, PasteValue>>;

declare const createAddRowsComponent: (translationKeys?: {
    button?: string;
    unit?: string;
}) => FC<AddRowsComponentProps$1>;

declare const defaultRenderItem: (item: ContextMenuItem$1) => React.JSX.Element;
declare const createContextMenuComponent: (renderItem?: (item: ContextMenuItem$1) => JSX.Element) => FC<ContextMenuComponentProps$1>;

type Column<T = any, C = any, PasteValue = string> = Partial<Column$1<T, C, PasteValue>>;
type CellComponent<T = any, C = any> = CellComponent$1<T, C>;
type CellProps<T = any, C = any> = CellProps$1<T, C>;
type DataSheetGridProps<T = any> = DataSheetGridProps$1<T>;
type AddRowsComponentProps = AddRowsComponentProps$1;
type SimpleColumn<T = any, C = any> = SimpleColumn$1<T, C>;
type ContextMenuComponentProps = ContextMenuComponentProps$1;
type ContextMenuItem = ContextMenuItem$1;
type DataSheetGridRef = DataSheetGridRef$1;
declare const DynamicDataSheetGrid: <T extends unknown>(props: DataSheetGridProps$1<T> & {
    ref?: React.ForwardedRef<DataSheetGridRef$1> | undefined;
}) => JSX.Element;
declare const DataSheetGrid: <T extends unknown>(props: DataSheetGridProps$1<T> & {
    ref?: React.ForwardedRef<DataSheetGridRef$1> | undefined;
}) => JSX.Element;

export { type AddRowsComponentProps, type CellComponent, type CellProps, type Column, type ContextMenuComponentProps, type ContextMenuItem, DataSheetGrid, type DataSheetGridProps, type DataSheetGridRef, DynamicDataSheetGrid, type SimpleColumn, checkboxColumn, createAddRowsComponent, createContextMenuComponent, createTextColumn, dateColumn, floatColumn, intColumn, isoDateColumn, keyColumn, percentColumn, defaultRenderItem as renderContextMenuItem, textColumn };
