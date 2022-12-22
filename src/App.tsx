import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';

import { TimeAgo } from '../lib/components/TimeAgo';
import { useAppContext } from '../lib/hooks';

// import { InputSearchReactAria } from './InputSearchReactAria';

function App() {
  // const [dateLocale, setDateLocale] = useState<any>(null);
  const { setDateLocale } = useAppContext();
  const [localeToLoad, setLocaleToLoad] = useState<string | null>(null);

  useEffect(() => {
    load();

    async function load() {
      if (localeToLoad) {
        const locale = await import(`./locales/${localeToLoad}.ts`);

        setDateLocale(locale.default);
      } else {
        setDateLocale(null);
      }
    }
  }, [localeToLoad]);

  return (
    <>
      <div>
        <TimeAgo date={new Date()} forceLanguage="de" />
        {' '}<button className='btn btn-primary' onClick={() => setLocaleToLoad('de')}>Change locale</button>
        <div className="flex flex-col space-y-1 mt-4 w-64">
          <NavLink className="btn btn-link" to="/dashboard">Dashboard</NavLink>
          <NavLink className="btn btn-link" to="/forms">Forms</NavLink>
          <NavLink className="btn btn-link" to="/notifications">Notifications</NavLink>
          <NavLink className="btn btn-link" to="/overlays">Overlays</NavLink>
          <NavLink className="btn btn-link" to="/datatable">DataTable</NavLink>
          <NavLink className="btn btn-link" to="/omnibox">Omnibox</NavLink>
        </div>
      </div>
    </>
  );
}

export default App;
