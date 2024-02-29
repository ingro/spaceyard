import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, differenceInMilliseconds } from 'date-fns';

import { formatLocalizedDate } from "../utilities/formatters";
// import { useDateLocale } from '../hooks/useDateLocale';
import { LocalizedDateFormat } from '../types';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../hooks';

type TimeAgoProps = {
    date: Date | string | null;
    forcedDateLocale?: any | null;
    forceLanguage?: string;
    showTooltip?: boolean;
    tooltipDateFormat?: LocalizedDateFormat;
    tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
};

const TimeAgoComponent: React.FC<TimeAgoProps> = ({ 
    date,
    forcedDateLocale = null,
    forceLanguage = null, 
    showTooltip = false, 
    tooltipDateFormat = 'full',
    tooltipPosition = 'top'
}) => {
    const [counter, setCounter] = useState(0);
    const { dateLocale } = useAppContext();

    let { i18n: { language } } = useTranslation();

    if (forceLanguage) {
        language = forceLanguage;
    }

    let finalDateLocale = dateLocale;

    if (forcedDateLocale) {
        finalDateLocale = forcedDateLocale;
    }

    //const { language, dateLocale } = useDateLocale(forceLanguage);

    if (typeof date === 'string') {
        date = new Date(date);
    }

    let diff: null | number = null;

    if (date !== null) {
        diff = Math.ceil(differenceInMilliseconds(new Date(), date) / 1000);
    }

    useEffect(() => {
        if (date === null) {
            return;
        }

        let ms = 30 * 1000;

        if (diff && diff > 3000) {
            ms = 1800 * 1000;
        }

        const interval = setInterval(() => {
            setCounter(counter + 1);
        }, ms);

        return function cleanup() {
            clearInterval(interval);
        }
    });

    if (date === null) {
        return <span>-</span>;
    }

    // if (dateLocale === null) {
    //     return null;
    // }

    const tooltipProps = showTooltip
        ? {
            'data-tooltip': formatLocalizedDate(date.toISOString(), language, tooltipDateFormat),
            'data-tooltip-location': tooltipPosition
        } 
        : {};

    let formatDistanceToNowOptions = {
        includeSeconds: true,
        addSuffix: true
    };

    if (finalDateLocale !== null && finalDateLocale !== 'error') {
        /** @ts-ignore */
        formatDistanceToNowOptions.locale = finalDateLocale;
    }

    return (
        <span {...tooltipProps}>
            {formatDistanceToNow(date, formatDistanceToNowOptions)}
        </span>
    );
};

export const TimeAgo = React.memo(TimeAgoComponent);
