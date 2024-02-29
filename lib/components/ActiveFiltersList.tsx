import React from 'react';
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { FiChevronsRight, FiX } from "react-icons/fi";
import { TFunction } from "i18next";
import { Table } from "@tanstack/react-table";
import { updateFilterValue } from "../utilities/filters";

type ActiveFilterElement = [string, any];

type FilterEl = {
    id: string;
    value: any;
};

type ActiveFiltersListProps = {
    table: Table<any>;
    filterToString?: (key: string, value: any, t: TFunction, language: string) => string | null;
};

const fallbackFilterToString = (key: string, value: any, t: TFunction, language: string) => {
    if (typeof value === 'boolean') {
        return t(value ? 'yes' : 'no');
    }

    return String(value);
};

function getActiveFilters(filters: Array<FilterEl>): Array<ActiveFilterElement> {
    let active: Array<any> = [];

    filters.forEach((filter) => {
        if (filter.value !== '') {
            active.push([filter.id, filter.value]);
        }
    });

    return active;
}

function handleOpenFilter(filterKey: string) {
    const match = document.querySelectorAll(`[data-toggle-filter="${filterKey}"]`);

    if (match.length > 0) {
        // @ts-ignore
        match[0].click();
    }
}

function hasTableFilterControl(filterKey: string) {
    const match = document.querySelectorAll(`[data-toggle-filter="${filterKey}"]`);

    return match.length > 0;
}

export function ActiveFiltersList({ table, filterToString = () => null }: ActiveFiltersListProps) {
    const {
        t,
        i18n: { language },
    } = useTranslation();

    const activeFilters = getActiveFilters(table.getState().columnFilters);

    if (activeFilters.length === 0) {
        return (
            <div className="flex col-span-full h-6 text-gray-500 items-center">
                <FiChevronsRight />
                <span className="ml-1">Nessun filtro applicato</span>
            </div>
        );
    }

    const computedFilterToString = (key: string, value: any) => {
        let formattedValue = filterToString(key, value, t, language);

        if (formattedValue === null) {
            return fallbackFilterToString(key, value, t, language);
        }

        return formattedValue;
    };

    return (
        <div className="flex col-span-full items-center text-gray-500">
            <FiChevronsRight />
            <span className="mx-1">{activeFilters.length === 0 ? '' : 'Filtri applicati:'}</span>
            {activeFilters.map(([key, value]) => {
                return (
                    <div
                        key={key}
                        className="flex mr-1 bg-primary text-white text-xs rounded-xl items-center divide-x divide-gray-400"
                    >
                        <span
                            className={clsx('truncate pl-2.5 pr-1.5 py-0.5 rounded-l-xl', {
                                'hover:bg-primary-lighter cursor-pointer': hasTableFilterControl(key),
                            })}
                            onClick={() => handleOpenFilter(key)}
                            style={{ maxWidth: '16rem' }}
                            title={computedFilterToString(key, value)}
                        >
                            {t(`filters.${key}`, key)}
                            {': "'}
                            {computedFilterToString(key, value)}
                            {'"'}
                        </span>
                        <span className="hover:bg-primary-lighter py-0.5 pr-1 rounded-r-xl">
                            <FiX className="cursor-pointer h-4 w-5" onClick={() => table.setColumnFilters(updateFilterValue(key, null))} />
                        </span>
                    </div>
                );
            })}
        </div>
    );
}