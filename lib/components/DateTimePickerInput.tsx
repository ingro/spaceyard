import React, { useEffect, useRef, useState } from 'react';
// import { usePopper } from 'react-popper';
import { useDateFieldState, useDatePickerState, useTimeFieldState } from '@react-stately/datepicker';
import { useDateField, useDatePicker, useDateSegment, useTimeField } from '@react-aria/datepicker';
import { useButton } from '@react-aria/button';
import { useCalendarState } from '@react-stately/calendar';
import { useCalendar, useCalendarCell, useCalendarGrid } from '@react-aria/calendar';
import { GregorianCalendar, getDayOfWeek, getWeeksInMonth, CalendarDate, Time } from '@internationalized/date';
import { FocusScope } from '@react-aria/focus';
import { useDialog } from '@react-aria/dialog';
import {
    useOverlay,
    useModal,
    DismissButton,
    OverlayContainer,
    useOverlayPosition,
    useOverlayTrigger,
} from '@react-aria/overlays';
import { mergeProps } from '@react-aria/utils';
import { useLocale, I18nProvider, useDateFormatter } from '@react-aria/i18n';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { isSameDay } from 'date-fns';
import clsx from 'clsx';

import { Select } from './Select';

function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function CalendarCell({ state, date }: any) {
    const ref = useRef();

    // console.log(state);

    // @ts-ignore
    const calendarCellAria = useCalendarCell({ date }, state, ref);
    const {
        cellProps,
        buttonProps,
        isSelected,
        isOutsideVisibleRange,
        isDisabled,
        formattedDate,
        isInvalid,
        // @ts-ignore
    } = calendarCellAria;

    // console.log(calendarCellAria);
    // console.log(state);

    // The start and end date of the selected range will have
    // an emphasized appearance.
    const isSelectionStart = state.highlightedRange ? isSameDay(date, state.highlightedRange.start) : isSelected;
    const isSelectionEnd = state.highlightedRange ? isSameDay(date, state.highlightedRange.end) : isSelected;

    // We add rounded corners on the left for the first day of the month,
    // the first day of each week, and the start date of the selection.
    // We add rounded corners on the right for the last day of the month,
    // the last day of each week, and the end date of the selection.
    // const { locale } = useLocale();
    const dayOfWeek = getDayOfWeek(date, 'it');
    // const isRoundedLeft = isSelected && (isSelectionStart || dayOfWeek === 0 || date.day === 1);
    // const isRoundedRight = isSelected && (isSelectionEnd || dayOfWeek === 6 || date.day === date.calendar.getDaysInMonth(date));

    // const { focusProps, isFocusVisible } = useFocusRing();

    let isFocusVisible = false;

    const d = new Date();
    const today = new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getUTCDate());

    const isToday = today.compare(date) === 0;

    return (
        <div {...cellProps} className={clsx('py-0.5 relative', isFocusVisible ? 'z-10' : 'z-0')}>
            <div
                {...buttonProps}
                // @ts-ignore
                ref={ref}
                hidden={isOutsideVisibleRange}
                // non é possibile cliccare sui giorni fuori dal mese corrente anche se è possibile renderli visibili,
                // attendere implementazione su react-aria -> https://github.com/adobe/react-spectrum/issues/3257
                className={clsx('h-10 outline-none group', {
                    // 'rounded-l-full': isRoundedLeft,
                    // 'rounded-r-full': isRoundedRight,
                    'bg-blue-300': isSelected && !isInvalid,
                    'bg-red-300': isSelected && isInvalid,
                    disabled: isDisabled,
                })}
            >
                <div
                    className={clsx('w-full h-full flex items-center justify-center', {
                        // rounded-full
                        'text-gray-400': isDisabled && !isInvalid,
                        'ring-2 group-focus:z-2 ring-blue-600 ring-offset-2': isFocusVisible,
                        'bg-red-600 text-white hover:bg-red-700': (isSelectionStart || isSelectionEnd) && isInvalid,
                        'bg-blue-600 text-white hover:bg-blue-700': (isSelectionStart || isSelectionEnd) && !isInvalid,
                        'bg-yellow-100': isToday && !isSelectionStart && !isSelectionEnd,
                        'hover:bg-red-400':
                            isSelected && !isDisabled && !(isSelectionStart || isSelectionEnd) && isInvalid,
                        'hover:bg-blue-400':
                            isSelected && !isDisabled && !(isSelectionStart || isSelectionEnd) && !isInvalid,
                        'hover:bg-blue-100': !isSelected && !isDisabled,
                        'cursor-default': isDisabled || isSelected,
                        'cursor-pointer': !isSelected && !isDisabled,
                    })}
                >
                    {formattedDate}
                </div>
            </div>
        </div>
    );
}

function CalendarGrid({ state, ...props }: any) {
    const { locale } = useLocale();
    const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

    // Get the number of weeks in the month so we can render the proper number of rows.
    const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale); // Gestire locale date-fns come secondo parametro

    return (
        <div {...gridProps}>
            <div {...headerProps} className="text-gray-600 grid grid-cols-7 justify-items-stretch">
                {weekDays.map((day, index) => (
                    <div className="text-center" key={index}>
                        {day}
                    </div>
                ))}
            </div>
            <div>
                {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 justify-items-stretch">
                        {state
                            .getDatesInWeek(weekIndex)
                            // @ts-ignore
                            .map((date, i) =>
                                date ? <CalendarCell key={i} state={state} date={date} /> : <div key={i} />
                            )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CalendarButton(props: any) {
    const ref = useRef();
    // @ts-ignore
    const { buttonProps } = useButton(props, ref);
    // const { focusProps, isFocusVisible } = useFocusRing();

    const isFocusVisible = false;

    const { isDisabled, onPress, ...rest } = props;

    return (
        <button
            {...buttonProps}
            // disabled={isDisabled}
            // onClick={onPress}
            // {...mergeProps(buttonProps, focusProps)}
            // @ts-ignore
            ref={ref}
            className={clsx('p-2 rounded-full outline-none', {
                'text-gray-400': props.isDisabled,
                'hover:bg-blue-100 active:bg-blue-200': !props.isDisabled,
                'ring-2 ring-offset-2 ring-primary': isFocusVisible,
            })}
        >
            {props.children}
        </button>
    );
}

function MonthGrid({ state, onSelect }: any) {
    let months: Array<any> = [];

    let formatter = useDateFormatter({
        month: "long",
        timeZone: state.timeZone
    });

    const numMonths = state.focusedDate.calendar.getMonthsInYear(state.focusedDate);

    const d = new Date();
    const today = new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getUTCDate());

    for (let i = 1; i <= numMonths; i++) {
        let date = state.focusedDate.set({ month: i });

        // console.log(formatter.format(date.toDate(state.timeZone)));
        
        months.push({
            label: formatter.format(date.toDate(state.timeZone)),
            disabled: date.compare(state.minValue) < 0 || state.maxValue.compare(date) < 0,
            current: today.month === date.month && today.year === date.year
        });
    }

    return (
        <div className="grid grid-cols-3 justify-items-stretch gap-0.5">
            {months.map((month, i) => {
                const monthIndex = i + 1;
                // console.log(monthIndex, state.focusedDate.month);

                return (
                    <div 
                        key={i}
                        className={clsx('h-16 flex items-center border', {
                            'bg-blue-600 text-white': monthIndex === state.value.month && !month.disabled,
                            'hover:bg-blue-100': monthIndex !== state.value.month && !month.disabled,
                            'bg-yellow-100': month.current && monthIndex !== state.value.month,
                            'bg-slate-100 text-gray-400': month.disabled,
                            'cursor-pointer': !month.disabled
                        })}
                        onClick={() => {
                            if (month.disabled) {
                                return;
                            }

                            const date = state.focusedDate.set({ month: i + 1 });
                            state.setFocusedDate(date);

                            onSelect();
                        }}
                    >
                        <div className="grow text-center">{month.label}</div>
                    </div>
                );
            })}
        </div>
    );
}

function getYearOptions(state: any) {
    let years = [];

    for (let i = -20; i <= 20; i++) {
        let date = state.focusedDate.add({ years: i });

        if (state.minValue && date.year < state.minValue.year) {
            continue;
        }
        
        if (state.maxValue && date.year > state.maxValue.year) {
            continue;
        }

        years.push({
            value: '' + date.year,
            label: '' + date.year
        });
    }

    return years;
}

function Calendar(props: any) {
    const { locale } = useLocale();
    const [depth, setDepth] = useState('day');
    const [showYearSelect, setShowYearSelect] = useState(false);

    let state = useCalendarState({
        ...props,
        locale,
        createCalendar: () => new GregorianCalendar(),
    });

    // const originalIsCellDisabled = state.isCellDisabled;

    // state.isCellDisabled = (date) => {
    //     console.log(date);
    //     const res = originalIsCellDisabled(date);

    //     console.log(res);

    //     return res;
    // }

    const ref = useRef();
    const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
        props,
        state,
        // @ts-ignore
        ref
    );

    useEffect(() => {
        if (depth !== 'month') {
            setShowYearSelect(false);
        }
    }, [depth]);

    // Get the number of weeks in the month so we can render the proper number of rows.
    const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);
    // console.log(state.focusedDate);
    // console.log(state.maxValue);

    let finalPrevButtonProps = { ...prevButtonProps };
    let finalNextButtonProps = { ...nextButtonProps };

    if (depth === 'month') {
        if (state.minValue && state.focusedDate.year === state.minValue.year) {
            finalPrevButtonProps.isDisabled = true;
        }

        if (state.maxValue && state.focusedDate.year === state.maxValue.year) {
            finalNextButtonProps.isDisabled = true;
        }
    }

    const yearOptions = getYearOptions(state);

    return (
        <div
            {...calendarProps}
            // @ts-ignore
            ref={ref}
            className="inline-block text-gray-800 w-full"
        >
            <div className="flex">
                <div className='grow'>
                    <div className="flex items-center pb-4">
                        <CalendarButton 
                            {...finalPrevButtonProps}
                            // @ts-ignore
                            onPress={() => depth === 'day' ? finalPrevButtonProps.onPress() : state.focusPreviousSection(true)}
                        >
                            <FiChevronLeft />
                        </CalendarButton>
                        {depth === 'day' && (
                            <h2 
                                className="flex-1 font-bold text-xl ml-2 text-center cursor-pointer"
                                onClick={() => setDepth('month')}
                            >
                                {capitalizeFirstLetter(title)}
                            </h2>
                        )}
                        {depth === 'month' && (
                            <h2
                                className={clsx('flex-1 flex font-bold text-xl ml-2 text-center h-10 items-center', {
                                    'cursor-pointer': yearOptions.length > 1
                                })}
                                onClick={() => {
                                    if (yearOptions.length > 1) {
                                        setShowYearSelect(true);
                                    }
                                }}
                            >
                                {showYearSelect ? 
                                    (<div className="grow">
                                        <Select 
                                            options={yearOptions}
                                            value={'' + state.focusedDate.year}
                                            initialIsOpen={true}
                                            onChange={(o) => {
                                                const date = state.focusedDate.set({ year: parseInt(o.value) });
                                                state.setFocusedDate(date);
                                                
                                                setShowYearSelect(false);
                                            }} 
                                        />
                                    </div>)
                                    : (<div className="grow">{state.focusedDate.year}</div>)
                                }
                            </h2>
                        )}
                        <CalendarButton 
                            {...finalNextButtonProps} 
                            // @ts-ignore
                            onPress={() => depth === 'day' ? finalNextButtonProps.onPress() : state.focusNextSection(true)}
                        >
                            <FiChevronRight />
                        </CalendarButton>
                    </div>
                    {depth === 'month' && (
                        <MonthGrid state={state} onSelect={() => setDepth('day')}/>
                    )}
                    {depth === 'day' && (
                        <div className='grow'>
                            <CalendarGrid state={state} />
                            {props.granularity === 'second' && (
                                <div className="w-1/2 mt-2 ml-2">
                                    <TimeField 
                                        className={clsx(
                                            'form-input cursor-default flex group-focus-within:border-primary group-focus-within:group-hover:border-primary',
                                            // {
                                            //     'group-hover:border-gray-400': !state.isOpen,
                                            //     '!border-primary': state.isOpen,
                                            // }
                                        )}
                                        value={props.timeValue}
                                        onChange={props.setTimeValue}
                                        granularity={props.granularity}
                                        label="Time"
                                        // {...fieldProps}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {props.granularity === 'second' && depth === 'day' && props.showTimeScroller && (
                    <div className={clsx('px-4 overflow-y-auto', {
                        'max-h-[20rem]': weeksInMonth === 4,
                        'max-h-[22.5rem]': weeksInMonth === 5,
                        'max-h-[25rem]': weeksInMonth === 6
                    })}>
                        <TimeScroller 
                            value={props.timeValue}
                            onChange={props.setTimeValue}
                        />
                    </div>
                )}   
            </div>
        </div>
    );
}

function DateSegment({ segment, state }: any) {
    const ref = useRef();
    // @ts-ignore
    const { segmentProps } = useDateSegment(segment, state, ref);

    return (
        <div
            {...segmentProps}
            // @ts-ignore
            ref={ref}
            style={{
                ...segmentProps.style,
                // @ts-ignore
                minWidth: segment.maxValue != null && String(segment.maxValue).length + 'ch',
            }}
            className={`px-0.5 tabular-nums text-right outline-none rounded-sm focus:bg-primary focus:text-white group ${
                !segment.isEditable ? 'text-gray-500' : 'text-gray-800'
            }`}
        >
            {/* Always reserve space for the placeholder, to prevent layout shift when editing. */}
            <span
                aria-hidden="true"
                className="block w-full text-center font-mono italic text-gray-500 group-focus:text-white"
                style={{
                    // @ts-ignore
                    visibility: segment.isPlaceholder ? '' : 'hidden',
                    height: segment.isPlaceholder ? '' : 0,
                    pointerEvents: 'none',
                }}
            >
                {segment.placeholder}
            </span>
            {segment.isPlaceholder ? '' : segment.text}
        </div>
    );
}

function DateField(props: any) {
    const { locale } = useLocale();
    const state = useDateFieldState({
        ...props,
        locale,
        hideTimeZone: true,
        createCalendar: () => new GregorianCalendar()
    });

    const ref = useRef();
    // @ts-ignore
    const { fieldProps } = useDateField(props, state, ref);

    return (
        <div
            {...fieldProps}
            // @ts-ignore
            ref={ref}
            className={props.className}
        >
            {state.segments.map((segment, i) => (
                <DateSegment key={i} segment={segment} state={state} />
            ))}
        </div>
    );
}

function TimeScroller(props: any) {
    let options = [];

    for (let i = 0; i < 24; i++) {
        options.push([i, 0]);
        options.push([i, 30]);
    }

    const selectedRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            if (selectedRef.current) {
                // @ts-ignore
                selectedRef.current.focus();
            }
        }, 0);
    }, []);

    return (
        <div className='flex flex-col items-stretch'>
            {options.map(([h, m]) => {
                const minutes = m === 0 ? '00' : m;
                const hours = h < 10 ? `0${h}` : h;

                const t = new Time(h, m);

                const diff = t.compare(props.value);
                const isCurrent = diff > -1800000 && diff < 0;

                return (
                    <div
                        className={clsx('grow px-1 outline-0', {
                            'bg-blue-600 text-white': isCurrent,
                            'hover:bg-blue-100 cursor-pointer': !isCurrent
                        })}
                        key={`${h}:${m}`}
                        onClick={() => props.onChange(t)}
                        tabIndex={0}
                        // @ts-ignore
                        ref={(node: any) => {
                            if (isCurrent) {
                                selectedRef.current = node;
                            }
                        }}
                    >
                        {`${hours}:${minutes}`}
                    </div>
                );
            })}       
        </div>
    );
}

function TimeField(props: any) {
    const { locale } = useLocale();
    const state = useTimeFieldState({
        ...props,
        locale,
        hideTimeZone: true,
        createCalendar: () => new GregorianCalendar()
    });

    const ref = useRef();
    // @ts-ignore
    const { labelProps, fieldProps } = useTimeField(props, state, ref);

    return (
        <>
            <label className="font-bold" {...labelProps}>{props.label}</label>
            <div
                {...fieldProps}
                // @ts-ignore
                ref={ref}
                className={props.className}
            >
                {state.segments.map((segment, i) => (
                    <DateSegment key={i} segment={segment} state={state} />
                ))}
            </div>
        </>
    );
}

const Popover = React.forwardRef((props: any, ref) => {
    const { isOpen, onClose, children, ...otherProps } = props;

    // console.log(props);

    // Handle events that should cause the popup to close,
    // e.g. blur, clicking outside, or pressing the escape key.
    const { overlayProps } = useOverlay(
        {
            isOpen,
            onClose,
            shouldCloseOnBlur: true,
            isDismissable: true,
            // shouldCloseOnInteractOutside: (e) => {
            //     // FIXME: per qualche motivo quando clicco in un punto bianco del calendario che non sia cliccabile di suo (ad esempio di fianco al nome del mese)
            //     // l'elemento su cui viene triggherato il click è l'ultimo DateSegment, ed essendo fuori dal dialog lo chiude, nel codice di esempio questo non accade
            //     // Aggiornamento: inserendo il pop-up all'interno di un OverlayContainer il problema non si presenta, ma si sono dovuti includere altri accorgimenti per il posizionamento
            //     console.log(e);

            //     return false;
            // },
        },
        // @ts-ignore
        ref
    );

    const { modalProps } = useModal();
    // @ts-ignore
    const { dialogProps } = useDialog(otherProps, ref);

    // console.log(mergeProps(overlayProps, modalProps, dialogProps));

    // console.log(props.style);

    return (
        <FocusScope contain={true} restoreFocus={true}>
            <div
                {...mergeProps(overlayProps, modalProps, dialogProps)}
                // @ts-ignore
                ref={ref}
                className={clsx("bg-white border border-gray-300 rounded-md shadow-lg pt-4 px-1 pb-2", {
                    'w-96': props.granularity === 'second' && props.showTimeScroller,
                    'w-80': props.granularity !== 'second' || !props.showTimeScroller,
                })}
                style={props.style}
            >
                {children}
                <DismissButton onDismiss={onClose} />
            </div>
        </FocusScope>
    );
});

function FieldButton(props: any) {
    const ref = useRef();
    // @ts-ignore
    const { buttonProps /*, isPressed*/ } = useButton(props, ref);

    // console.log(props);

    // const { onPress, ...rest } = props;

    return (
        <button
            className={clsx(
                'flex items-center cursor-pointer text-gray-400 hover:text-gray-700 outline-none select-none',
                // group-focus-within:text-primary
                {
                    '!text-primary': props.isOpen,
                }
            )}
            tabIndex={0}
            {...buttonProps}
        >
            <FiCalendar className="h-5 w-5" />
        </button>
    );
}

type DateTimePickerInputProps = {
    minValue?: any,
    maxValue?: any,
    value?: any,
    defaultValue?: any,
    granularity?: any,
    label?: string,
    locale?: string,
    onChange?: (date: any) => void,
    showTimeScroller?: boolean
};

export function DateTimePickerInput({
    locale = 'en',
    showTimeScroller = false,
    ...props
}: DateTimePickerInputProps) {
    const finalProps = {
        ...props,
        shouldCloseOnSelect: props.granularity !== 'second',
        'aria-label': 'Select a date'
    };

    const state = useDatePickerState(finalProps);
    const ref = useRef();
    const triggerRef = useRef();
    const popoverRef = useRef();

    const overlayState = useOverlayTriggerState({});

    const {
        groupProps,
        labelProps,
        fieldProps,
        buttonProps,
        dialogProps,
        calendarProps,
        // @ts-ignore
    } = useDatePicker(finalProps, state, ref);

    // console.log(calendarProps);

    // @ts-ignore
    let { triggerProps /*, overlayProps*/ } = useOverlayTrigger({ type: 'dialog' }, overlayState, triggerRef);

    const overlayPosition = useOverlayPosition({
        // @ts-ignore
        targetRef: triggerRef,
        // @ts-ignore
        overlayRef: popoverRef,
        containerPadding: 0,
        placement: 'bottom end',
        // shouldFlip: false,
        offset: 4,
        isOpen: state.isOpen,
    });

    const { overlayProps: positionProps } = overlayPosition;

    // const [referenceElement, setReferenceElement] = useState(null);
    // const [popperElement, setPopperElement] = useState(null);

    // const { styles, attributes } = usePopper(referenceElement, popperElement);

    const { onPress, ...triggerPropsProper } = triggerProps;

    return (
        <I18nProvider locale={locale}>
            <div>
                <div {...labelProps} className="text-sm text-gray-800">
                    {props.label}
                </div>
                <div
                    className="relative group w-full"
                    {...triggerPropsProper}
                    // @ts-ignore
                    ref={ref}
                    {...groupProps}
                >
                    <DateField
                        // ref={setReferenceElement}
                        className={clsx(
                            'form-input cursor-default flex group-focus-within:border-primary group-focus-within:group-hover:border-primary',
                            {
                                'group-hover:border-gray-400': !state.isOpen,
                                '!border-primary': state.isOpen,
                                '!border-red-500': state.validationState === 'invalid'
                            }
                        )}
                        {...fieldProps}
                    />
                    <span 
                        className="absolute flex inset-y-0 right-0 pr-1" 
                        // @ts-ignore
                        ref={triggerRef}
                    >
                        <FieldButton {...buttonProps} isOpen={state.isOpen} />
                    </span>
                    {state.isOpen && (
                        <OverlayContainer>
                            <Popover
                                {...dialogProps}
                                {...positionProps}
                                // {...overlayProps}
                                ref={popoverRef}
                                isOpen={state.isOpen}
                                onClose={() => {
                                    state.setOpen(false);
                                }}
                                granularity={props.granularity}
                                showTimeScroller={showTimeScroller}
                            >
                                <Calendar 
                                    {...calendarProps} 
                                    granularity={props.granularity} 
                                    timeValue={state.timeValue} 
                                    setTimeValue={state.setTimeValue}
                                    showTimeScroller={showTimeScroller}
                                />
                            </Popover>
                        </OverlayContainer>
                    )}
                </div>
            </div>
        </I18nProvider>
    );
}
