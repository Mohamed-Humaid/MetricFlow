export interface CSVColumn<T> {
  header: string;
  value: (row: T) => string | number | null | undefined;
}

const FORMULA_PREFIX = /^[=+\-@]/;

function protectSpreadsheetValue(value: string): string {
  return FORMULA_PREFIX.test(value) ? `'${value}` : value;
}

export function escapeCSVValue(value: string | number | null | undefined): string {
  const normalized = value == null ? '' : String(value);
  const protectedValue =
    typeof value === 'string' ? protectSpreadsheetValue(normalized) : normalized;
  return `"${protectedValue.replace(/"/g, '""')}"`;
}

export function generateCSV<T>(rows: T[], columns: CSVColumn<T>[]): string {
  const header = columns.map((column) => escapeCSVValue(column.header)).join(',');
  const body = rows.map((row) =>
    columns.map((column) => escapeCSVValue(column.value(row))).join(',')
  );

  return [header, ...body].join('\r\n');
}

export function downloadCSV<T>(
  rows: T[],
  columns: CSVColumn<T>[],
  filename: string
): void {
  const csv = generateCSV(rows, columns);
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  try {
    link.href = objectUrl;
    link.download = filename;
    link.setAttribute('aria-hidden', 'true');
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }
}
