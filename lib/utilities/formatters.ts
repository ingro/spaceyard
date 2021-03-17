export function highlightString(query: string, text: string, opts: any = { tag: 'b' }): string|null {
    if (!query || query.length === 0) {
        return text;
    }

    const offset = text.toLowerCase().indexOf(query[0].toLowerCase());

    if (offset === -1) {
        return null;
    }

    const fullQueryOffset = text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());

    if (fullQueryOffset !== -1) {
        const before = text.slice(0, fullQueryOffset);
        const match = text.slice(fullQueryOffset, fullQueryOffset + query.length);
        const highlighted = `<${opts.tag}>${match}</${opts.tag}>`;
        const after = text.slice(fullQueryOffset + query.length);

        return `${before}${highlighted}${after}`.replace(/\s/g, '&nbsp;');
    }

    let last = 0;

    for (let i = 1; i < query.length; i++) {
        if (text[offset + i] !== query[i]) {
            break;
        }

        last = i;
    }

    const before = text.slice(0, offset);
    const match = `<${opts.tag}>` + text.slice(offset, offset + last + 1) + `</${opts.tag}>`;
    const after = highlightString(query.slice(last + 1), text.slice(offset + last + 1), opts);

    return after === null ? null : `${before}${match}${after}`.replace(/\s/g, '&nbsp;');
}

const dateOptions = {
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric'
};

const timeOptions = {
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric'
};

export type LocalizedDateFormat = 'full' | 'dateOnly' | 'timeOnly' | 'long';

export function formatLocalizedDate(isoDate: string | null | Date, language = 'default', format: LocalizedDateFormat = 'full') {
    if (isoDate === null)  {
        return '-';
    }

    const date = (isoDate instanceof Date) ? isoDate : new Date(isoDate);

    let options = {};

    if (format === 'timeOnly') {
        options = timeOptions;
    } else {
        options = dateOptions;

        if (format !== 'dateOnly') {
            options = {
                ...options,
                ...timeOptions
            };
        }

        if (format === 'long') {
            options = {
                ...options,
                weekday: 'long'
            };
        }
    }

    return new Intl.DateTimeFormat(language, options).format(date);
}

export function capitalize(s: string) {
    if (typeof s !== 'string') {
        return '';
    }

    return s.charAt(0).toUpperCase() + s.slice(1);
}
