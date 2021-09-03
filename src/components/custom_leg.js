import React from 'react';

export const CustomLegInput = ({
  setAdhocPosition,
  adhocPosition,
  setPositions,
  positions,
  symbol,
}) => {
  // console.log(adhocPosition)
  const leg = adhocPosition;
  
  const adjust = () => {
    if (adhocPosition?.strike) {
      positions.legs = positions[symbol]?.legs?.concat([
        {
          ...adhocPosition,
          strike: parseInt(adhocPosition.strike),
        },
      ]);
      setPositions(positions);
      // FIXME: SEE IF BELOW IS NEEDED, below does not work, find an alternative
      // document.querySelector('.btn-info').click();
    }
  };
  
  return (
    <span>
      <input
        type="text"
        value={leg?.side}
        className="form-control"
        placeholder={'sell/buy'}
        onChange={() => {
          console.log(window.event.target.value);
          setAdhocPosition({ ...leg, side: window.event.target.value });
        }}
      />
      <input
        type="text"
        placeholder={'strike'}
        value={leg?.strike}
        className="form-control"
        onChange={() => {
          console.log(window.event.target.value);
          setAdhocPosition({ ...leg, strike: window.event.target.value });
        }}
      />
      <input
        type="text"
        placeholder={'price'}
        value={leg?.price}
        className="form-control"
        onChange={() => {
          console.log(window.event.target.value);
          setAdhocPosition({ ...leg, price: window.event.target.value });
        }}
      />
      <input
        type="text"
        placeholder={'quantity'}
        className="form-control"
        value={leg?.quantity || 25}
        onChange={() => {
          console.log(window.event.target.value);
          setAdhocPosition({ ...leg, quantity: window.event.target.value });
        }}
      />
      <input
        type="text"
        placeholder={'CE/PE'}
        className="form-control"
        value={leg?.optType || 'CE'}
        onChange={() => {
          console.log(window.event.target.value);
          setAdhocPosition({ ...leg, optType: window.event.target.value });
        }}
      />
      <input
        type="text"
        className="form-control"
        placeholder={'expiry'}
        value={leg?.expiry || '26Aug2021'}
        onChange={() => {
          console.log(window.event.target.value);
          setAdhocPosition({ ...leg, expiry: window.event.target.value });
        }}
      />
      <input
        type="text"
        placeholder={'payoff date'}
        value={leg?.payoffDate}
        className="btn"
        onChange={() => {
          setAdhocPosition({ ...leg, payoffDate: window.event.target.value });
        }}
      />
      <button
        onClick={() => {
          adjust();
        }}
      >
          change
      </button>
      <button
        className="btn"
        onClick={() => {
          if(positions?.legs && positions.legs[symbol]){
            // // The async IIFE is necessary because Chrome <89 does not support top level await.
          } else {
            positions.legs[symbol].map((_leg, idx) => {
              if (leg.strike === _leg.strike) {
                positions.legs.splice(idx, 1);
                setPositions({ ...positions, legs: positions.legs });
              }
            });
          }
        }}
      >
          delete
      </button>
    </span>
  );
};
  
  
  