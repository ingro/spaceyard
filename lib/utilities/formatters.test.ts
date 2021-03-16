import { highlightString } from "./formatters";

it('highlight a string correctly', () => {
    const res = highlightString('imap', 'Errori IMAP');

    expect(res).toBe('Errori&nbsp;<b>IMAP</b>');
});

it('handle spaces when highlighting a string', () => {
    const res = highlightString('logs', 'Export Error logs');

    expect(res).toBe('Export&nbsp;Error&nbsp;<b>logs</b>');
});
