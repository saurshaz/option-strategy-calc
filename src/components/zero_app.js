
import React, { useState } from 'react';
import { Container } from '../components/container';
import { getZeroPositions } from '../helpers/api';

export const ZeroTradeApp = ({ db, legs, token }) => {
  console.log('hello from TradeStation ', db);
  const [strategyId, setStrategyId] = useState(strategyId || 'AAA');
  const strategy = db.get(strategyId) ||  {
    legs,
    pnl: {},
    greeks: {},
    positions: [],
    symbol: 'NIFTY',
    payoffDate: '2021-09-09',
    data: {},
  };
  
  console.log(`payoff date is ${strategy.payoffDate}`);
    
  const [symbol, setSymbol] = useState(strategy.symbol);
  const [positions, setPositions] = useState(strategy.positions);
  const [data, setData] = useState(strategy.data);
  const [payoffDate, setPayoffDate] = useState(strategy.payoffDate);
  
  return (
      <>
  
        <label className="form-field">SYMBOL: </label>
        <select
          className="form-control"
          onChange={() => {
            setSymbol(window.event.target.value);
          }}
          value={symbol}>
          {db.symbols.map((symbol) => {
            return (<option key={symbol} value={symbol}>{symbol}</option>);
          })}
          <option value={'BANKNIFTY'}>BANKNIFTY</option>
          <option value={'NIFTY'}>NIFTY</option>
        </select>
        <input
          className="form-control"
          type="text"
          value={payoffDate}
          onChange={() => {
            setPayoffDate(window.event?.target?.value);
          }}
        ></input>
  
        <select onChange={() => {
          let activeStrategy = db.get(window.event.target.value);
          console.log(`activeStrategy `, activeStrategy);
          setPositions(activeStrategy.positions);
          setData(activeStrategy.data);
          setSymbol(activeStrategy.symbol);
          setPayoffDate(activeStrategy.payoffDate );
        }}>
          {db.historyStrategies.map((stratName, idx) => {
            return (<option key={idx} value={stratName}>{stratName}</option>);
          })}
        </select>
        {/* <button
          className="btn-primary"
          type="button"
          onClick={() => setPositionId("2")}
        >
          Position # 2
        </button> */}
  
        <button
          className="btn-primary"
          type="button"
          onClick={() => {
            getZeroPositions(token).then((all_positions) => {
              setPositions({ legs: all_positions, symbol });
              setSymbol(symbol);
              document.querySelector('[type="submit"]').click();
            });
          }}
        >
          Zerodha Positions
        </button>
        <Container
          setData={setData}
          db={db}
          data={data}
          symbol={symbol}
          positions={positions}
          payoffDate={payoffDate}
          setPositions={setPositions}
        />
      </>
  );
};
  