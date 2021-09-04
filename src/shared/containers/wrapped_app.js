
import React, { useEffect, useState } from 'react';
import { ZeroTradeApp } from '../components/zero_app';
import { MockDB } from '../helpers/db';
  
export const WrappedApp = () => {
  const [zero_data, setZeroData] = useState({});
  const [authtoken, setAuthtoken] = useState(
    window.localStorage.getItem('authtoken') || ''
  );
  useEffect(() => {
    // getZeroPrice('').then((d) => console.log)
    console.log('WrappedApp');

  }, []);
  return zero_data ? (
    <div className="popup">
      <input
        className="form-control"
        type="text"
        value={authtoken}
        onChange={() => {
          setAuthtoken(window.event.target.value);
          window.localStorage.setItem('authtoken', window.event.target.value);
        }}
      ></input>

      {authtoken ? (
        <ZeroTradeApp 
          db = {new MockDB()}
          token={authtoken}
          legs={zero_data || []}
        />
      ) : (
        <div>
          'Pls authenticate your Zerodha by entering your authtoken from
          localstorage of browser'
        </div>
      )}
    </div>
  ) : (
    <>void</>
  );
};