import React from 'react';

export const CustomTooltip = ({ active, payload, label, spotPrice }) => {
  // console.log(payload)
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          fontSize: 12,
          backgroundColor: payload[0].value > 0 ? 'lightgreen' : 'red',
          padding: 10,
          borderRadius: 14,
        }}
      >
        <span style={{ fontSize: 12 }}>
            Price: {payload[1]?.payload?.StockPrice}
        </span>
        <br />
        <span>PnL: {payload[1]?.payload?.Final}</span>
        <br />
        <span>PnL(Now): {payload[1]?.payload?.Today}</span>
        <br />
        <span>Change %: {payload[1]?.payload?.Change}</span>
      </div>
    );
  }
  
  return null;
};
  
  