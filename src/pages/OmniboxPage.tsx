import React from 'react';
import { FiAlertTriangle, FiCheck } from 'react-icons/fi';

import { OmniBox } from "../../lib/components/OmniBox";
import { OmniBoxAction } from '../../lib/types';

const actions: Array<OmniBoxAction> = [
  {
    value: '/forms',
    label: 'Forms',
    Icon: FiCheck,
    key: 'forms'
  },
  {
    value: '/dashboard',
    label: 'Dashboard',
    Icon: FiAlertTriangle,
    key: 'dashboard'
  }
];


export default function OmniboxPage() {
    return (
        <div>
            <OmniBox 
                isOpen={true}
                onClose={() => {}}
                actions={actions}
            />
        </div>
    );
}