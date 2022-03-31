import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

import { Checkbox, CheckboxFieldController } from '../../lib/components/Checkbox';
import { ComboBox } from '../../lib/components/ComboBox';
import { ComboBoxMultiple } from '../../lib/components/ComboBoxMultiple';
import { DatePickerInputField, DatePickerInputFieldController } from '../../lib/components/DatePickerInput';
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

export default function Forms() {
    const { control, handleSubmit } = useForm({});

    const [search, setSearch] = useState('');
    const [date, setDate] = useState<Date | string | null>(new Date());
    const [selected, setSelected] = useState(false);
    const [foo, setFoo] = useState<any>();
    const [bar, setBar] = useState<Array<any>>([]);

    const [isDoingAsyncAction, setIsDoingAsyncAction] = useState(false);

    function doAsyncAction() {
      setIsDoingAsyncAction(true);
  
      setTimeout(() => {
        setIsDoingAsyncAction(false);
      }, 2000);
    }

    return (
        <div>
            <div className="w-1/4 mb-2">
                <LoadingButton className='btn-primary w-full mb-2' onClick={doAsyncAction} isLoading={isDoingAsyncAction}>Async action</LoadingButton>
                <InputSearch 
                    // showIcon={false}
                    value={search}
                    onSubmit={(q: string) => {
                        alert(q);
                        setSearch(q);
                    }}
                />
                <br />
                <DatePickerInputField 
                    value={date}
                    asString={true}
                    label="Data di nascita"
                    placeholder="Foo"
                    onChange={d => {
                        console.log(d);
                        setDate(d);
                    }}
                    dateFormat="dd/MM/yyyy"
                />
                <Checkbox
                    checked={selected}
                    label="Attivo"
                    onChange={(e: any) => {
                        setSelected(e); 
                    }}
                />
                {/* <InputSearchReactAria 
                    value={search}
                    onSubmit={(q: string) => {
                    alert(q);
                    setSearch(q);
                    }}
                /> */}
            </div>
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
            <div className="w-1/4 mb-2">
                <ComboBox
                    value={foo}
                    options={options}
                    onSelect={(option) => {
                        setFoo(option);
                    }}
                />
            </div>
            <div className="w-1/4 mb-2">
                <ComboBoxMultiple
                    options={options}
                    value={bar}
                    onChange={(values: any) => setBar(values)}
                />
            </div>
            <button className="btn btn-primary" onClick={handleSubmit(data => console.warn(data))}>SUBMIT FORM</button>
        </div>
    );
}