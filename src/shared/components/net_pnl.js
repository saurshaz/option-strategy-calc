
import React from 'react';
import { getAppropriateStyledText } from '../helpers/utils';

export const NetPnl = ({ data }) => {
  // {"payoff_date":"2021-08-18","legs":[{"side":"+","quantity":25,"expiry":"18AUG2021","strike":35600,"price":344.34,"optType":"CE"},{"side":"+","quantity":100,"expiry":"18AUG2021","strike":35700,"price":168.93,"optType":"CE"},{"side":"-","quantity":50,"expiry":"18AUG2021","strike":35900,"price":89.67,"optType":"CE"},{"side":"-","quantity":75,"expiry":"18AUG2021","strike":36100,"price":109.14,"optType":"CE"}]}
  return (
      <>
        <div style={{ padding: 20 }}>
          <div style={{}}>
            <div>
              <label>DTE:</label> {data?.DTE}
            </div>
            <div>
              <label>PoP:</label> {getAppropriateStyledText(data?.POP)}
            </div>
            <div>
              <label>Breakeven: </label>
              {data?.breakevens}
            </div>
          </div>
          <div style={{}}>
            <div>
              <label>RR:</label> {data?.maxRR}
            </div>
            <div>
              <label>Loss(Max):</label> {getAppropriateStyledText(data?.maxloss)}
            </div>
            <div>
              <label>Profit(Max):</label>{' '}
              {getAppropriateStyledText(data?.maxprofit)}
            </div>
            <div>
              <label>Net Credit: </label>
              {data?.netcredit}
            </div>
            <div>
              <label>PnL: </label>
              {getAppropriateStyledText(data?.totalPNL)}
            </div>
            <div>
              <label>IV:</label> {data?.underlyingiv}
            </div>
            {/* <div>{JSON.stringify(data)}</div> */}
          </div>
          <div style={{}}>
            <div>
              <label>SPOT:</label> {data?.spotPrice}
            </div>
            <div>
              <label>PnL:</label> {getAppropriateStyledText(data?.totalPNL)}
            </div>
            <div>
              <label>IV:</label> {data?.underlyingiv}
            </div>
            {/* <div>{JSON.stringify(_datdataa)}</div> */}
          </div>
        </div>
      </>
  );
  // (<li className="bold">{data.?.side}{leg.quantity} of {leg.strike}{leg.optType}{leg.expiry} at {leg.price}</li>)
};