import React from 'react'
import { FiCheck, FiAlertTriangle } from 'react-icons/fi';

import { OmniBox } from '../lib/components/OmniBox';
import { Drawer } from '../lib/components/Drawer';
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
    <div>
      <OmniBox 
        isOpen={true}
        onClose={() => {}}
        actions={actions}
      />
      <button onClick={toggle}>Toggle Drawer</button>
      <Drawer
        isOpen={isOpen}
        onClose={()=>{}}
      >
        <h1>I'm a Drawer!</h1>
      </Drawer>
    </div>
  )
}

export default App
