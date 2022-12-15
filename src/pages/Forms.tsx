import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import { now, today, getLocalTimeZone } from "@internationalized/date";

import { CheckboxFieldController } from '../../lib/components/Checkbox';
import { ComboBoxFieldController } from '../../lib/components/ComboBox';
import { ComboBoxMultipleFieldController } from '../../lib/components/ComboBoxMultiple';
import { DatePickerInputFieldController } from '../../lib/components/DatePickerInput';
import { InputFieldController } from '../../lib/components/Input';
import { InputSearch } from '../../lib/components/InputSearch';
import { LoadingButton } from '../../lib/components/Buttons';
import { NumberInputFieldController } from '../../lib/components/NumberInput';
import { SelectFieldController } from '../../lib/components/Select';
import { SwitchFieldController } from '../../lib/components/Switch';
import { DateTimePickerInput, DateTimePickerInputFieldController } from '../../lib/components/DateTimePickerInput';
import { format } from 'date-fns';

const options = [
    { value: 'foo', label: 'Foo' },
    { value: 'bar', label: 'Bar' },
    { value: 'baz', label: 'Baz' },
    { value: '1', label: 'Uno' },
    { value: '2', label: 'Due' },
    { value: '3', label: 'Tre' },
    { value: '4', label: 'Quattro' },
    { value: '5', label: 'Cinque' },
    { value: '6', label: 'Sei' },
    { value: '7', label: 'Sette' },
    { value: '8', label: 'Otto' },
    { value: '9', label: 'Nove' },
    { value: '10', label: 'Dieci' },
    { value: '11', label: 'Undici' },
    { value: '12', label: 'Dodici' },
    { value: '13', label: 'Tredici' },
    { value: '14', label: 'Quattrodici' },
];

// const dateSchema = z.preprocess((arg) => {
//     if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
// }, z.date());

const validationSchema = z.object({
    combo: z.any().nullish(),
    confirm: z.boolean().nullish(),
    foo: z.any().nullish(),
    multiple: z.array(z.any()).nullish(),
    name: z.string().min(1),
    privacy: z.boolean().nullish(),
    qty: z.number().max(10).nullish(),
    start_date: z.date().max(new Date()).transform((d) => format(d, 'yyyy-MM-dd')),
    event_date: z.date().max(new Date())
});

const pause = (ms: number) =>  new Promise(resolve => setTimeout(resolve, ms));

export default function Forms() {
    const { control, handleSubmit, formState } = useForm({
        mode: 'onTouched',
        resolver: zodResolver(validationSchema),
        // defaultValues: {
        //     event_date: new Date('2022-12-06T14:55:00.000Z')
        // }
    });

    const [search, setSearch] = useState('');

    const onSubmit = handleSubmit(async (data) => {
        console.log(data);

        await pause(2000);

        alert('Data sent!');
    });

    return (
        <div>
            <div className="text text-purple-500 text-xl">Input liberi</div>
            <div className="w-1/4 mb-2">
                <InputSearch 
                    // showIcon={false}
                    value={search}
                    onSubmit={(q: string) => {
                        alert(q);
                        setSearch(q);
                    }}
                />
                <br />
                {/* <DatePickerInputField 
                    value={date}
                    asString={true}
                    label="Data di nascita"
                    placeholder="Foo"
                    onChange={d => {
                        console.log(d);
                        setDate(d);
                    }}
                    dateFormat="dd/MM/yyyy"
                /> */}
                {/* <Checkbox
                    checked={selected}
                    label="Attivo"
                    onChange={(e: any) => {
                        setSelected(e); 
                    }}
                /> */}
                {/* <InputSearchReactAria 
                    value={search}
                    onSubmit={(q: string) => {
                    alert(q);
                    setSearch(q);
                    }}
                /> */}
            </div>
            {/* <div className="text text-purple-500 text-xl">Date Time Picker</div>
            <div className="w-1/4 mb-2">
                <DateTimePickerInput 
                    locale='it'
                    // granularity="day"
                    granularity="second"
                    showTimeScroller={true}
                    defaultValue={now(getLocalTimeZone())}
                    minValue={today(getLocalTimeZone())} 
                    maxValue={today(getLocalTimeZone()).add({ months: 6 })}
                    onChange={(f) => console.log(f)}
                />
            </div> */}
            <div className="text text-purple-500 text-xl">Form</div>
            <form onSubmit={onSubmit}>
                <div className="w-1/4 mb-2">
                    <InputFieldController 
                        name="name"
                        layout="stacked"
                        placeholder="Name"
                        control={control}
                        // disabled={true}
                        // error="Required"
                    />
                </div>
                <div className="w-1/4 mb-2">
                    <SelectFieldController
                        name="foo"
                        layout="stacked"
                        showClearBtn={true}
                        control={control}
                        // value={'12'}
                        options={options}
                    />
                    <ComboBoxFieldController
                        name="combo"
                        control={control}
                        options={options}
                    />
                    <ComboBoxMultipleFieldController
                        name="multiple"
                        options={options}
                        control={control}
                    />
                    <SwitchFieldController
                        name="confirm"
                        label="Conferma"
                        control={control}
                        labelPosition="none"
                    />
                    <CheckboxFieldController
                        name="privacy"
                        label="GDPR"
                        control={control}
                        labelPosition="none"
                    />
                    <NumberInputFieldController
                        name="qty"
                        label="Quantity" 
                        placeholder="Quantity"
                        control={control}
                        // maxValue={10}
                        // minValue={0}
                        // step={2}
                        formatOptions={{
                            // style: 'percent',

                            // style: 'currency',
                            // currency: 'EUR',
                            // currencyDisplay: 'code',
                            // currencySign: 'accounting',

                            // style: 'unit',
                            // unit: 'centimeter',
                            // unitDisplay: 'long',

                            // signDisplay: 'exceptZero',
                            // minimumFractionDigits: 1,
                            // maximumFractionDigits: 2
                        }}
                    />
                    <DatePickerInputFieldController 
                        name="start_date"
                        // value={date}
                        // asString={true}
                        label="Data di nascita"
                        placeholder="Inserisci data"
                        // minDate={new Date()}
                        // onChange={d => {
                        //     console.log(d);
                        //     setDate(d);
                        // }}
                        //dateFormat="dd/MM/yyyy"
                        // dateFormat="yyyy-MM-dd"
                        control={control}
                    />
                    <DateTimePickerInputFieldController
                        name="event_date"
                        locale="it"
                        granularity="second"
                        control={control}
                        label="Data e orario appuntamento"
                        confirmBtn={true}
                    />
                </div>
                <DevTool control={control} placement="top-right" />
            </form>
            <LoadingButton className='btn-primary mb-2 w-32' onClick={onSubmit} isLoading={formState.isSubmitting}>SUBMIT</LoadingButton>
        </div>
    );
}