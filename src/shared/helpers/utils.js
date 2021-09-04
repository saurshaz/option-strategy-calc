
import React from 'react';
import axios from 'axios';


export const getAppropriateStyledText = (numericVal, showRed) => {
  if (showRed)
    return (
      <label className={`${numericVal > 0 ? 'text-success' : 'text-danger'}`}>
        {numericVal}
      </label>
    );
  return (
    <label
      className={`center ${numericVal > 0 ? 'text-success' : 'text-danger'}`}
    >
      {numericVal}
    </label>
  );
};


export const computeTradeGraph = ({symbol,positions, payoffDate, showAlert, setData}) => {
  let c = symbol + '$';
  console.log(
    `positions.payoff_date is ${positions.payoff_date || payoffDate}`
  );
      
  if (!(positions?.legs && positions.legs[symbol])) {

    window.chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
      console.log('MANAGER');
      if (tab && tab[0]?.url) {
        window.chrome.scripting.executeScript({
          target: {tabId: tab[0].id},
          func: showAlert,
          args: ['NO SYMBOL SELECTED']
        });
      }
    });
  } else if (positions?.legs && positions.legs[symbol]) {
    positions.legs[symbol].map((leg, index) => {
      if (index != 0) {
        c += `&`;
      }
      c += `${leg.side || '+'}${leg.quantity}x${leg.strike}${leg.optType}x${leg.expiry}x${leg.price}x0x0`;
    });
    c += `$${positions.payoff_date || payoffDate}$0$0$0`;
    console.log(c);
    if (positions.legs[symbol].length > 0) {
      axios({
        // url:
        // "https://5000-maroon-guanaco-brwprwdd.ws-us14.gitpod.io/api/op?c=" + encodeURIComponent(document.location.search.replace('?c=','')),
        url: 'https://tradepron.vercel.app/api/op?c=' + encodeURIComponent(c),
          
        // url: "http://localhost:5000/api/op?c=" + encodeURIComponent(c),
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        console.log(res);
        setData(res.data);
      });
    }
  }
};