import axios from 'axios';
// var myCookies = getCookies();
// console.log(myCookies);

export const getZeroPositions = (token) => {
    const all_positions = {};
    return new Promise((resolve, reject) => {
      axios({
        url: "https://kite.zerodha.com/oms/portfolio/positions",
        method: "GET",
        headers: {
          authorization: `enctoken ${token}`,
        },
      })
        .then((response) => response?.data?.data)
        .then((response) => {
          console.log("**** zerodha positions ****");
          console.log(response?.net);
          response?.net?.map((_position) => {
            if (_position?.exchange === 'NFO' &&  _position?.average_price > 0) {
              const _position_match = _position.tradingsymbol.match(
                /([^\d]+)([\d]{2})([\w]{3})([\d]+)([CE|PE]+)/
              );
              let symbol,
                strike,
                year,
                expiry,
                optType,
                monthWeek = null;
              console.log("_position_match.length === 6");
              console.log(_position_match.length === 6);
              if (_position_match.length === 6) {
                symbol = _position_match[1];
                year = _position_match[2];
                year = `20${year}`;
                monthWeek = _position_match[3];
                // weekMonthId = monthWeek;
                strike = parseInt(_position_match[4]);
                optType = _position_match[5];
  
                if (isNaN(parseInt(_position_match[3]))) {
                  // all_positions[symbol] = all_positions[symbol] || [];
                  console.log(_position_match[3]);
                  const  monthlies = {
                    'JAN': 0,
                    'FEB': 1,
                    'MAR': 2,
                    'SEP': 8,
                  }
                  console.log(_position_match[3]);
                  let exp_date = new Date(
                    `${getLastThursday(monthlies[_position_match[3]])}/${monthWeek}/21`
                  ); // FIXME: month index hardcoded
                  expiry = `${("0" + exp_date.getDate()).slice(
                    -2
                  )}${monthWeek.toUpperCase()}${year}`;
                } else {
                  let exp_date = new Date(
                    `${monthWeek}`.toString().substring(0, 1) +
                      "/" +
                      `${monthWeek}`.toString().substring(1, 3) +
                      "" +
                      "/" +
                      "21"
                  );
                  expiry = `${("0" + exp_date.getDate()).slice(
                    -2
                  )}${exp_date
                    .toLocaleString("en-US", { month: "short" })
                    .toUpperCase()}${year}`;
                }
                console.log("expiry");
                console.log(expiry);
                // const positions = all_positions[symbol] || {};
                all_positions[symbol] = all_positions[symbol] || [];
                // all_positions[symbol].push({
                //   side: _position?.quantity  > 0 ? "+" : "",
                //   quantity: _position?.quantity,
                //   expiry, //"02SEP2021",
                //   strike,
                //   price: _position?.average_price,
                //   optType,
                // });
                all_positions[symbol].push({
                  side: _position?.quantity  > 0 ? "+" : "",
                  quantity: _position?.overnight_quantity + _position?.day_buy_quantity - _position?.day_sell_quantity,
                  expiry, //"02SEP2021",
                  strike,
                  price: (_position.overnight_quantity > 0 ) ? (-_position?.sell_value + _position?.buy_value)/ (_position?.overnight_quantity + _position?.day_buy_quantity - _position?.day_sell_quantity) : _position.average_price,
                  optType,
                });
              }
            }
          });
          console.log("** getZero");
          console.log(all_positions);
          resolve(all_positions);
        })
        .catch((err) => reject(err));
    });
  };
  
  
  export const getZeroPrice = (args) => {
    const all_positions = {};
    return new Promise((resolve, reject) => {
      axios({
        url: `https://tradepron.vercel.app/api/prices?s=BANKNIFTY&q=25&st=36000&ty=CE&ex=21902&si=BUY&ot=MARKET&p=NRML&v=regular`,
        method: "GET",
        headers: {
          "x-tok": `${'7iGisRqn+fKeSYcOI2frPUofZxDPXlSBStJZHFVuWkRwiZJI0qfgSF3B6eOxz9vDF/YT+ouh4SCcySHhRd1Zd3hgK6uPN8TQwVP8CG1Zr54NbqseYBwMlw=='}`,
          "content-type": "application/json",
        },
        data: "[{\"exchange\":\"NFO\",\"tradingsymbol\":\"BANKNIFTY2190235600PE\",\"transaction_type\":\"BUY\",\"variety\":\"regular\",\"product\":\"NRML\",\"order_type\":\"LIMIT\",\"quantity\":25,\"price\":345}]",
      })
        .then((response) => response?.data?.data)
        .then((response) => {
          console.log("**** zerodha pricing ****");
          console.log("** getZero");
          console.log(response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  };