import React, { useRef } from 'react';
// import { usePopper } from 'react-popper';
import { useDateFieldState, useDatePickerState } from '@react-stately/datepicker';
import { useDateField, useDatePicker, useDateSegment } from '@react-aria/datepicker';
import { useButton } from '@react-aria/button';
import { useCalendarState } from '@react-stately/calendar';
import { useCalendar, useCalendarCell, useCalendarGrid } from '@react-aria/calendar';
import { createCalendar, getDayOfWeek, getWeeksInMonth } from '@internationalized/date';
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
import { useLocale, I18nProvider } from '@react-aria/i18n';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { isSameDay } from 'date-fns';
import clsx from 'clsx';

function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function CalendarCell({ state, date }: any) {
    const ref = useRef();
    const {
        cellProps,
        buttonProps,
        isSelected,
        isOutsideVisibleRange,
        isDisabled,
        formattedDate,
        isInvalid,
        // @ts-ignore
    } = useCalendarCell({ date }, state, ref);

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
    const isRoundedLeft = isSelected && (isSelectionStart || dayOfWeek === 0 || date.day === 1);
    const isRoundedRight =
        isSelected && (isSelectionEnd || dayOfWeek === 6 || date.day === date.calendar.getDaysInMonth(date));

    // const { focusProps, isFocusVisible } = useFocusRing();

    let isFocusVisible = false;

    return (
        <td {...cellProps} className={clsx('py-0.5 relative', isFocusVisible ? 'z-10' : 'z-0')}>
            <div
                {...buttonProps}
                // @ts-ignore
                ref={ref}
                hidden={isOutsideVisibleRange}
                className={clsx('w-10 h-10 outline-none group', {
                    'rounded-l-full': isRoundedLeft,
                    'rounded-r-full': isRoundedRight,
                    'bg-blue-300': isSelected && !isInvalid,
                    'bg-red-300': isSelected && isInvalid,
                    disabled: isDisabled,
                })}
            >
                <div
                    className={clsx('w-full h-full rounded-full flex items-center justify-center', {
                        'text-gray-400': isDisabled && !isInvalid,
                        'ring-2 group-focus:z-2 ring-blue-600 ring-offset-2': isFocusVisible,
                        'bg-red-600 text-white hover:bg-red-700': (isSelectionStart || isSelectionEnd) && isInvalid,
                        'bg-blue-600 text-white hover:bg-blue-700': (isSelectionStart || isSelectionEnd) && !isInvalid,
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
        </td>
    );
}

function CalendarGrid({ state, ...props }: any) {
    const { locale } = useLocale();
    const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

    // Get the number of weeks in the month so we can render the proper number of rows.
    const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale); // Gestire locale date-fns come secondo parametro

    return (
        <table {...gridProps} cellPadding="0" className="flex-1">
            <thead {...headerProps} className="text-gray-600">
                <tr>
                    {weekDays.map((day, index) => (
                        <th className="text-center" key={index}>
                            {day}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
                    <tr key={weekIndex}>
                        {state
                            .getDatesInWeek(weekIndex)
                            // @ts-ignore
                            .map((date, i) =>
                                date ? <CalendarCell key={i} state={state} date={date} /> : <td key={i} />
                            )}
                    </tr>
                ))}
            </tbody>
        </table>
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

function Calendar(props: any) {
    const { locale } = useLocale();

    const state = useCalendarState({
        ...props,
        locale,
        createCalendar,
    });

    // console.log(state);

    const ref = useRef();
    const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
        props,
        state,
        // @ts-ignore
        ref
    );

    return (
        <div
            {...calendarProps}
            // @ts-ignore
            ref={ref}
            className="inline-block text-gray-800"
        >
            <div className="flex items-center pb-4">
                <h2 className="flex-1 font-bold text-xl ml-2">{capitalizeFirstLetter(title)}</h2>
                <CalendarButton {...prevButtonProps}>
                    <FiChevronLeft />
                </CalendarButton>
                <CalendarButton {...nextButtonProps}>
                    <FiChevronRight />
                </CalendarButton>
            </div>
            <CalendarGrid state={state} />
        </div>
    );
}

function DateSegment({ segment, state }: any) {
    const ref = useRef();
    // @ts-ignore
    const { segmentProps } = useDateSegment(segment, state, ref);

    // console.log(segmentProps);

    // const { id, ...rest } = segmentProps;

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
                className="block w-full text-center italic text-gray-500 group-focus:text-white"
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
        createCalendar,
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
                className="bg-white border border-gray-300 rounded-md shadow-lg p-4"
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
                'flex items-center cursor-pointer text-gray-400 hover:text-gray-700 outline-none select-none group-focus-within:text-primary',
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

export function DateTimePickerInput(props: any) {
    const state = useDatePickerState(props);
    const ref = useRef();
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
    } = useDatePicker(props, state, ref);

    // @ts-ignore
    let { triggerProps /*, overlayProps*/ } = useOverlayTrigger({ type: 'dialog' }, overlayState, ref);

    const { overlayProps: positionProps } = useOverlayPosition({
        // @ts-ignore
        targetRef: ref,
        // @ts-ignore
        overlayRef: popoverRef,
        placement: 'bottom start',
        offset: 4,
        isOpen: state.isOpen,
    });

    // console.log('group', groupProps);
    // console.log('field', fieldProps);
    // console.log('dialog', dialogProps);
    // console.log('button', buttonProps);
    // console.log('state', state);

    // const [referenceElement, setReferenceElement] = useState(null);
    // const [popperElement, setPopperElement] = useState(null);

    // const { styles, attributes } = usePopper(referenceElement, popperElement);

    const { onPress, ...triggerPropsProper } = triggerProps;

    return (
        <I18nProvider locale="it-IT">
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
                            }
                        )}
                        {...fieldProps}
                    />
                    <span className="absolute flex inset-y-0 right-0 pr-1">
                        {/* {date && (
                            <span 
                                className="flex items-center cursor-pointer text-gray-400 hover:text-gray-700 mr-2" 
                                // onClick={() => onChange(null)}
                            >
                                <FiX className="h-5 w-5"/>
                            </span>
                        )} */}
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
                            >
                                <Calendar {...calendarProps} />
                            </Popover>
                        </OverlayContainer>
                    )}
                </div>
            </div>
        </I18nProvider>
    );
}
