import { describe, expect, it } from 'vitest';
import { escapeCSVValue, generateCSV } from './exportCSV';

describe('CSV export', () => {
  it('escapes commas, quotes, newlines and missing values', () => {
    expect(escapeCSVValue('Acme, Inc.')).toBe('"Acme, Inc."');
    expect(escapeCSVValue('She said "hello"')).toBe('"She said ""hello"""');
    expect(escapeCSVValue('line one\nline two')).toBe('"line one\nline two"');
    expect(escapeCSVValue(undefined)).toBe('""');
  });

  it('protects string formula prefixes without changing numeric values', () => {
    expect(escapeCSVValue('=SUM(A1:A2)')).toBe("\"'=SUM(A1:A2)\"");
    expect(escapeCSVValue('+1-1')).toBe("\"'+1-1\"");
    expect(escapeCSVValue('-10')).toBe("\"'-10\"");
    expect(escapeCSVValue('@user')).toBe("\"'@user\"");
    expect(escapeCSVValue(-10)).toBe('"-10"');
  });

  it('generates headers and rows in stable CRLF format', () => {
    expect(
      generateCSV([{ name: 'A', amount: 10 }], [
        { header: 'Name', value: (row) => row.name },
        { header: 'Amount', value: (row) => row.amount },
      ])
    ).toBe('"Name","Amount"\r\n"A","10"');
  });
});
