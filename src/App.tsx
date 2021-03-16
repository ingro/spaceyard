import React from 'react'
import { FiCheck, FiAlertTriangle } from 'react-icons/fi';

import { OmniBox } from '../lib/components/OmniBox';
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
  return (
    <div>
      <OmniBox 
        isOpen={true}
        onClose={() => {}}
        actions={actions}
      />
    </div>
  )
}

export default App
