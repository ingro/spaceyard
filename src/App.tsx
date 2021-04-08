import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
// import { FiCheck, FiAlertTriangle } from 'react-icons/fi';

// import { OmniBox } from '../lib/components/OmniBox';
import { Drawer } from '../lib/components/Drawer';
import { InputFieldController } from '../lib/components/Input';
import { SelectFieldController } from '../lib/components/Select';
import { useDisclosure } from '../lib/hooks/useDisclosure';
import { ComboBox } from '../lib/components/ComboBox';
import { ComboBoxMultiple } from '../lib/components/ComboBoxMultiple';
// import { OmniBoxAction } from '../lib/types';

import '../lib/styles/dialogs.css';
import '../lib/styles/form.css';

// const actions: Array<OmniBoxAction> = [
//   {
//     value: 'foo',
//     label: 'Foo',
//     Icon: FiCheck,
//     key: 'foo'
//   },
//   {
//     value: 'bar',
//     label: 'Bar',
//     Icon: FiAlertTriangle,
//     key: 'bar'
//   }
// ];

type FormExample = {
  name: string;
  foo: string;
};

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

function App() {
  const { toggle, isOpen } = useDisclosure();

  const [foo, setFoo] = useState<any>();
  const [bar, setBar] = useState<Array<any>>([]);

  const { control, handleSubmit } = useForm();

  return (
    <div className="m-4">
      <form onSubmit={handleSubmit(data => console.warn(data))}>
        <div className="w-1/4 mb-2">
          <InputFieldController 
            name="name"
            layout="stacked"
            placeholder="Name"
            control={control}
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
        </div>
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
      <Drawer
        isOpen={isOpen}
        showOverlay={false}
        onClose={()=>{}}
        onOpened={() => console.warn('OPENED!')}
      >
        <h1>I'm a Drawer!</h1>
      </Drawer>
      <button onClick={toggle}>Toggle Drawer</button>
      {/* <OmniBox 
        isOpen={true}
        onClose={() => {}}
        actions={actions}
      /> */}
    </div>
  )
}

export default App
