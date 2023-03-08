import React from 'react';
import { useTranslation } from 'react-i18next';

import { formatLocalizedDate } from "../utilities/formatters";
import { LocalizedDateFormat } from '../types';

type DisplayDateProps = {
    date: string | null | Date;
    forceLanguage?: string;
    dateFormat?: LocalizedDateFormat;
};

export function DisplayDate({ date, forceLanguage, dateFormat = 'full' }: DisplayDateProps) {
    let { i18n: { language } } = useTranslation();

    if (forceLanguage) {
        language = forceLanguage;
    }

    let localizedDate = 'Invalid date';

    console.log(date);

    try {
        localizedDate = formatLocalizedDate(date, language, dateFormat);
    } catch {}

    return (
        <>
            {localizedDate}
        </>
    );
}
