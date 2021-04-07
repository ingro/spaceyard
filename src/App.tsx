import React from 'react'
import { FiCheck, FiAlertTriangle } from 'react-icons/fi';

// import { OmniBox } from '../lib/components/OmniBox';
import { Drawer } from '../lib/components/Drawer';
import { Input } from '../lib/components/Input';
import { Select } from '../lib/components/Select';
import { useDisclosure } from '../lib/hooks/useDisclosure';
import { OmniBoxAction } from '../lib/types';

const actions: Array<OmniBoxAction> = [
  {
    value: 'foo',
    label: 'Foo',
    Icon: FiCheck,
    key: 'foo'
  },
  {
    value: 'bar',
    label: 'Bar',
    Icon: FiAlertTriangle,
    key: 'bar'
  }
];

function App() {
  const { toggle, isOpen } = useDisclosure();

  return (
    <div className="m-4">
      {/* <OmniBox 
        isOpen={true}
        onClose={() => {}}
        actions={actions}
      /> */}
      <div className="w-1/4 mb-2">
        <Input 
          placeholder="Name"
        />
      </div>
      <div className="w-1/4 mb-2">
        <Select
          options={[
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
          ]}
        />
      </div>
      {/* <button onClick={toggle}>Toggle Drawer</button> */}
      <Drawer
        isOpen={isOpen}
        onClose={()=>{}}
        onOpened={() => console.warn('OPENED!')}
      >
        <h1>I'm a Drawer!</h1>
      </Drawer>
    </div>
  )
}

export default App
