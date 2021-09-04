
import React, { useState } from 'react';
import { EditStrategyForm } from './edit_strategy_form';
import { NetPnl } from './net_pnl';
import { NetSummary } from './net_summary';
import { PayoffChart } from './payoff';
import { computeTradeGraph } from '../helpers/utils';
import { showAlert } from '../helpers/browser';
  
export const Container = ({
  data,
  positions,
  setPositions,
  setData,
  payoffDate,
  symbol,
  db,
}) => {
  const [positionSaveName, setPositionSaveName] = useState('<strategy-name>');
  // const [payoffDate, setPayoffDate] = useState(getLastThursday(new Date().month + 1));
  // const [trades, setTrades] = useState()
  
  console.log(positions);
  // WORKING VERSION
  // "BANKNIFTY$+50x32400CEx18AUG2021x480.55x0x0&-250x35700CEx18AUG2021x436.22x0x0&+125x36500PEx18AUG2021x603.1x0x0$2021-08-12$0$0$0"
  
  const schema = {
    type: 'object',
    properties: {
      // payoff_date: {
      //   type: "string",
      //   format: "date",
      //   title: "Payoff Date",
      // },
      legs: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            strike: {
              type: 'number',
              title: 'Strike Price',
              // minimum: 100,
              // maximum: 38000,
              // multipleOf: 100
            },
            expiry: {
              type: 'string',
              title: 'Expiry',
            },
            optType: {
              title: 'CE/PE',
              type: 'string',
              enum: ['CE', 'PE'],
              enumNames: ['CE', 'PE'],
            },
            price: {
              type: 'number',
              title: 'Price',
            },
            quantity: {
              title: 'Quantity',
              type: 'number',
              // minimum: 25,
              // maximum: 4950,
              // multipleOf: 25
            },
          },
        },
      },
    },
  };
  
  console.log((positions?.legs && positions?.legs[symbol] && positions?.legs[symbol]?.length > 0 ));
  return (
    <div className="container">
      <div className="black-label">
        <label>Payoff Date: </label>
        {/* <input
            title="PayoffDate"
            placeholder="Payoff Date:"
            className="form-field"
            type="text"
            value={payoffDate}
            onChange={() => setPayoffDate(window?.event?.target?.value)}
          /> */}
      </div>
      <input type="text" className="form-field" value={positionSaveName} onChange={() => {
        setPositionSaveName(window.event.target.value);
      }} placeholder="Name of position"/>
      <button
        className="btn-primary"
        type="button"
        onClick={() => {
          if (positionSaveName) {
            // setPositionId("1")
            db.set(positionSaveName, { positions, data, symbol, payoffDate });
            db.sync();
            //  against position name we save positions and ,data
          }
        }}
      >
          SAVE POSITION
      </button>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target=".collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
                Configure
            </button>
          </h2>
          <div
            className="collapseOne accordion-collapse collapse"
            aria-labelledby="headingOne"
            data-bs-parent=".accordionExample"
          >
            <EditStrategyForm schema={schema} positions={positions} symbol={symbol} setPositions={setPositions} payoffDate={payoffDate} setData={setData} />
          </div>
          { (positions?.legs && positions?.legs[symbol] && positions?.legs[symbol]?.length > 0)?
            <div className="accordion-item">
              <h2 className="accordion-header headingTwo">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target=".collapseTwo"
                  aria-expanded="true"
                  aria-controls="collapseTwo"
                >
                    Payoff Chart
                </button>
              </h2>
              <div
                className="collapseTwo accordion-collapse"
                aria-labelledby="headingTwo"
                data-bs-parent=".accordionExample"
              >
                <div className="accordion-body">
                  <div className={'container'}>
                    <div className="row">
                      <NetSummary
                        positions={positions}
                        data={data}
                        symbol={symbol}
                        payoffDate={payoffDate}
                      />
                    </div>
  
                    <div className="row">
                      <NetPnl data={data} />
                    </div>
                  </div>
                  <PayoffChart
                    positions={positions}
                    setPositions={setPositions}
                    data={data}
                    setData={setData}
                    symbol={symbol}
                    payoffDate={payoffDate}
                    computeTradeGraph={() => {
                      computeTradeGraph({symbol,positions, payoffDate, showAlert, setData});
                    }}
                  />
                </div>
              </div>
            </div>
            : null }  
        </div>
      </div>
    </div>
  );
};
  
  