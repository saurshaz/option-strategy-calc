import React from 'react';
import { getAppropriateStyledText } from '../helpers/utils';

export const NetSummary = ({ data, positions, symbol }) => {
  console.log('Netsummary data');
  console.log(data);
  // {"payoff_date":"2021-08-18","legs":[{"side":"+","quantity":25,"expiry":"18AUG2021","strike":35600,"price":344.34,"optType":"CE"},{"side":"+","quantity":100,"expiry":"18AUG2021","strike":35700,"price":168.93,"optType":"CE"},{"side":"-","quantity":50,"expiry":"18AUG2021","strike":35900,"price":89.67,"optType":"CE"},{"side":"-","quantity":75,"expiry":"18AUG2021","strike":36100,"price":109.14,"optType":"CE"}]}
  
  return (
    <div className="row">
      {positions?.legs[symbol] && positions?.legs[symbol].map((leg, idx) => {
        // const isLoss = (data?.pnl && data?.pnl[idx]["P&L"] < 0) || false;
        return (
          <div key={idx} style={{ padding: 10 }}>
            {data?.pnl && data?.pnl[idx]
              ? getAppropriateStyledText(
                parseInt(data?.pnl && data?.pnl[idx] && data?.pnl[idx]['P&L'])
              )
              : 0}
            <p style={{ padding: 20 }}>
              <label>{leg?.side}</label>
              <label>{leg.quantity}</label> of <label> {leg.strike}</label>
              <label>{leg.optType}</label>
              <label>{leg.expiry}</label> at <label>{leg.price}</label>
            </p>
            {/* <label>Leg Entry: {data?.pnl[idx]['EntryPrice']}</label> */}
          </div>
        );
      })}
    </div>
  );
};
  