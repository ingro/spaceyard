import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';

// import { OmniBox } from '../lib/components/OmniBox';
import { TimeAgo } from '../lib/components/TimeAgo';

// import { InputSearchReactAria } from './InputSearchReactAria';
// import { OmniBoxAction } from '../lib/types';

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

function App() {
  const [dateLocale, setDateLocale] = useState<any>(null);

  const localeToLoad = 'it';

  useEffect(() => {
    load();

    async function load() {
      const locale = await import(`./locales/${localeToLoad}.ts`);

      setDateLocale(locale.default);
    }
  }, [localeToLoad]);

  return (
    <>
      <div>
        <TimeAgo date={new Date()} forceLanguage="de" dateLocale={dateLocale}/>
        <div className="flex flex-col space-y-1 mt-4 w-64">
          <NavLink className="btn btn-link" to="/dashboard">Dashboard</NavLink>
          <NavLink className="btn btn-link" to="/forms">Forms</NavLink>
          <NavLink className="btn btn-link" to="/notifications">Notifications</NavLink>
          <NavLink className="btn btn-link" to="/overlays">Overlays</NavLink>
          <NavLink className="btn btn-link" to="/datatable">DataTable</NavLink>
        </div>
        {/* <OmniBox 
          isOpen={true}
          onClose={() => {}}
          actions={actions}
        /> */}
      </div>
    </>
  )
}

export default App;
