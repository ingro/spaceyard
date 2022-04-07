import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

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

const options = [
    { value: 'foo', label: 'Foo' },
    { value: 'bar', label: 'Bar' },
    { value: 'baz', label: 'Baz' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: '13', label: '13' },
    { value: '14', label: '14' },
];

const pause = (ms: number) =>  new Promise(resolve => setTimeout(resolve, ms));

export default function Forms() {
    const { control, handleSubmit, formState } = useForm({});

    const [search, setSearch] = useState('');
    const [date, setDate] = useState<Date | string | null>(new Date());
    const [bar, setBar] = useState<Array<any>>([]);

    const onSubmit = handleSubmit(async (data) => {
        console.log(data);

        await pause(2000);
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
            <div className="text text-purple-500 text-xl">Form</div>
            <form onSubmit={handleSubmit(data => console.warn(data))}>
                <div className="w-1/4 mb-2">
                    <InputFieldController 
                        name="name"
                        layout="stacked"
                        placeholder="Name"
                        control={control}
                        disabled={true}
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
                        value={date}
                        asString={true}
                        label="Data di nascita"
                        placeholder="Foo"
                        onChange={d => {
                            console.log(d);
                            setDate(d);
                        }}
                        dateFormat="dd/MM/yyyy"
                        control={control}
                    />
                </div>
                <DevTool control={control} placement="top-right" />
            </form>
            <LoadingButton className='btn-primary mb-2 w-32' onClick={onSubmit} isLoading={formState.isSubmitting}>SUBMIT</LoadingButton>
        </div>
    );
}