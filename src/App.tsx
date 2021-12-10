import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { toast } from 'react-toastify';
// import { FiCheckCircle } from 'react-icons/fi';

// import { OmniBox } from '../lib/components/OmniBox';
import { Drawer } from '../lib/components/Drawer';
import { InputFieldController } from '../lib/components/Input';
import { SelectFieldController } from '../lib/components/Select';
import { useDisclosure } from '../lib/hooks/useDisclosure';
import { ComboBox } from '../lib/components/ComboBox';
import { Checkbox, CheckboxFieldController } from '../lib/components/Checkbox';
import { ComboBoxMultiple } from '../lib/components/ComboBoxMultiple';
import { InputSearch } from '../lib/components/InputSearch';
import { SwitchFieldController } from '../lib/components/Switch';
import { TimeAgo } from '../lib/components/TimeAgo';
import { CancelModalButton } from '../lib/components/Buttons';
import { Modal, ModalBody, ModalFooter, ModalTitle } from '../lib/components/Modal';
import { NumberInputFieldController } from '../lib/components/NumberInput';
import { DatePickerInputField, DatePickerInputFieldController } from '../lib/components/DatePickerInput';
import { ToastContainer } from '../lib/components/ToastContainer';
import { BasicNotification, NotificationWithConfirm, loadingNotification } from '../lib/components/Notifications';
// import { InputSearchReactAria } from './InputSearchReactAria';
// import { OmniBoxAction } from '../lib/types';

// import '../lib/styles/dialogs.css';
// import '../lib/styles/form.css';

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

function AppModal({ onClose }: any) {
  return (
    <Modal 
        labelId="foo"
        onClose={onClose} 
        size="small"
    >
        <ModalTitle labelId="foo" onClose={onClose}>Modale</ModalTitle>
        <ModalBody>
            Hello World!
        </ModalBody>
        <ModalFooter>
            <CancelModalButton onClose={onClose} />
        </ModalFooter>
    </Modal>
  );
}

function App() {
  const { toggle: toggleDrawer, isOpen: isOpenDrawer } = useDisclosure();
  const { toggle: toggleModal, isOpen: isOpenModal } = useDisclosure();

  const [foo, setFoo] = useState<any>();
  const [bar, setBar] = useState<Array<any>>([]);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState<Date | string | null>(new Date());
  const [selected, setSelected] = useState(false);

  const { control, handleSubmit } = useForm({
    // defaultValues: {
    //   qty: 6
    // }
  });

  return (
    <>
      <ToastContainer />
      <div className="m-4">
        <TimeAgo date={new Date()}/>
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
        <Drawer
          isOpen={isOpenDrawer}
          showOverlay={false}
          onClose={toggleDrawer}
          onOpened={() => console.warn('OPENED!')}
          dismissable={true}
        >
          <h1>I'm a Drawer!</h1>
        </Drawer>
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
        <button onClick={toggleDrawer}>Toggle Drawer</button>
        <br />
        <button onClick={toggleModal}>Show Modal</button>
        <br />
        <button onClick={() => toast.success(<BasicNotification text="Hurray!"/>)}>Show Notification</button>
        <br />
        <button onClick={() => toast.info(<BasicNotification title="Foo" text="Hurray!"/>)}>Show Notification with Title</button>
        <br />
        <button onClick={() => toast.info(<NotificationWithConfirm title="Action needed" text="Do you agree?" onClick={res => console.log(res)} />)}>Show Confirm</button>
        <br />
        <button onClick={() => {
          const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 3000));

          loadingNotification({
            promise: resolveAfter3Sec,
            resolveMessage: 'Hurray :)',
            rejectMessage: 'Oh noes :('
          });
        }}>
          Show Loading notification
        </button>
        {isOpenModal && <AppModal onClose={toggleModal} />}
        {/* <OmniBox 
          isOpen={true}
          onClose={() => {}}
          actions={actions}
        /> */}
      </div>
    </>
  )
}

export default App
