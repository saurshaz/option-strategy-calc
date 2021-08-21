
import React, { useEffect, useState } from "react";
import axios from "axios";

import './Popup.css';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Line,
  ReferenceLine,
  Tooltip
} from "recharts";

import Form from "react-jsonschema-form";
import resolve from "resolve";



window.localStorage.setItem(
  "11", "{}"
);

window.localStorage.setItem(
  "1",
  JSON.stringify({
    symbol: "BANKNIFTY",
    adhocPosition: {
      side: "+",
      strike: 36500,
      quantity: 50,
      price: 344.34,
      optType: "CE",
      expiry: "26AUG2021",
      payoffDate: "2021-08-26"
    },
    payoff_date: "2021-08-26",
    legs: {
      "BANKNIFTY": [
          {
              "side": "+",
              "quantity": 175,
              "expiry": "02SEP2021",
              "strike": 35100,
              "price": 483.78333333333336,
              "optType": "CE"
          },
          {
              "side": "+",
              "quantity": 125,
              "expiry": "26AUG2021",
              "strike": 35800,
              "price": 122.8625,
              "optType": "CE"
          }
      ]
    }
  })
);

window.localStorage.setItem(
  "222",
  JSON.stringify({
    symbol: "BANKNIFTY",
    adhocPosition: {
      side: "+",
      strike: 35600,
      quantity: 100,
      price: 181.44,
      optType: "CE",
      expiry: "18AUG2021",
      payoffDate: "2021-08-18"
    },
    payoff_date: "2021-08-18",
    legs: [
      {
        side: "+",
        strike: 35600,
        quantity: 100,
        price: 181.44,
        expiry: "18AUG2021",
        optType: "CE"
      },
      {
        side: "+",
        quantity: 25,
        strike: 35700,
        price: 129.15,
        expiry: "18AUG2021",
        optType: "CE"
      },
      {
        side: "-",
        quantity: 25,
        strike: 35800,
        price: 30.2,
        expiry: "18AUG2021",
        optType: "CE"
      },
      {
        side: "-",
        quantity: 75,
        strike: 36000,
        price: 18.95,
        expiry: "18AUG2021",
        optType: "CE"
      },
      {
        side: "+",
        quantity: 25,
        strike: 35600,
        price: 684.14,
        expiry: "02SEP2021",
        optType: "CE"
      },
      {
        side: "-",
        quantity: 25,
        strike: 35800,
        price: 550.3,
        expiry: "02SEP2021",
        optType: "CE"
      }
    ]
  })
);
function getLastThursday(month) {
  var d = new Date(`01-${month}-${2021}`),
  thursdays = [];
  d.setDate(1);
  
      d.setMonth(month)


  // Get the first thursdays in the month
  while (d.getDay() !== 4) {
      d.setDate(d.getDate() + 1);
  }

  // Get all the other thursdays in the month
  while (d.getMonth() === month) {
      thursdays.push(new Date(d.getTime()));
      d.setDate(d.getDate() + 7);
  }

  return (thursdays[4] || thursdays[3]).getDate();
}

console.log(getLastThursday(8))

    
const getZeroPositions = () => {
  const all_positions = {};
  return new Promise((resolve, reject) => {
    
    axios({
      url: "https://kite.zerodha.com/oms/portfolio/positions",
      "method": "GET",
      "headers": {
        "authorization": "enctoken CrcVbOw/in4PMjRR8i7mek8xc/jUYw3ayastLVHazTQe6qMyyLPAq6dTNrKY42CCdWF6FNMPZV+gnQMK5clxj/PAS6ZefUj4MVthD3M1q334QCjj60QVLQ=="
      }
    })
    .then(response => response?.data?.data)
    .then(response => {
      console.log("**** zerodha positions ****")
      console.log(response?.net);
      response?.net?.map((_position) => {
        if (_position?.average_price > 0) {
          
          const _position_match = _position.tradingsymbol.match(/([^\d]+)([\d]{2})([\w]{3})([\d]+)([CE|PE]+)/);
          let symbol, strike, year, expiry, optType, monthWeek = null;
          console.log('_position_match.length === 6');
          console.log(_position_match.length === 6);
          if(_position_match.length === 6){
            symbol = _position_match[1];
            year = _position_match[2];
            year = `20${year}`;
            monthWeek =_position_match[3];
            // weekMonthId = monthWeek;
            strike = parseInt(_position_match[4]);
            optType = _position_match[5];
            
            if(isNaN(parseInt(_position_match[3]))){
              // all_positions[symbol] = all_positions[symbol] || [];
              console.log(_position_match[3])
              let exp_date = new Date(`${getLastThursday(7)}/${monthWeek}/21`)// FIXME: month index hardcoded
              expiry =  `${("0"+exp_date.getDate()).slice(-2)}${monthWeek.toUpperCase()}${year}`
            } else {
              let exp_date = new Date(`${monthWeek}`.toString().substring(0,1)  +"/" +`${monthWeek}`.toString().substring(1,3)+""+ "/" +"21")
              expiry =  `${("0"+exp_date.getDate()).slice(-2)}${exp_date.toLocaleString("en-US", { month: "short" }).toUpperCase()}${year}`
            }
            console.log('expiry')
            console.log(expiry)
            // const positions = all_positions[symbol] || {};
            all_positions[symbol] = all_positions[symbol] || [];
            all_positions[symbol].push( {
                side: _position?.buy_quantity ? "+": "-",
                quantity: _position?.buy_quantity || _position?.sell_quantity,
                expiry,//"02SEP2021",
                strike,
                price: _position?.average_price,
                optType,
              });
            }
          }
        });
        console.log('** getZero');
        console.log(all_positions);
        resolve(all_positions)
    })
    .catch((err) => reject(err))
  })
  }

  const CustomTooltip = ({ active, payload, label, spotPrice }) => {
    // console.log(payload)
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            fontSize: 12,
            backgroundColor: payload[0].value > 0 ? "lightgreen" : "red",
            padding: 10,
            borderRadius: 14
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
  
  export const CustomLegInput = ({
    setAdhocPosition,
    adhocPosition,
    setPositions,
    positions
  }) => {
    // console.log(adhocPosition)
    const leg = adhocPosition;
  
    const adjust = () => {
      if (adhocPosition?.strike) {
        positions.legs = positions?.legs?.concat([
          {
            ...adhocPosition,
            strike: parseInt(adhocPosition.strike)
          }
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
          placeholder={"sell/buy"}
          onChange={() => {
            console.log(window.event.target.value);
            setAdhocPosition({ ...leg, side: window.event.target.value });
          }}
        />
        <input
          type="text"
          placeholder={"strike"}
          value={leg?.strike}
          onChange={() => {
            console.log(window.event.target.value);
            setAdhocPosition({ ...leg, strike: window.event.target.value });
          }}
        />
        <input
          type="text"
          placeholder={"price"}
          value={leg?.price}
          onChange={() => {
            console.log(window.event.target.value);
            setAdhocPosition({ ...leg, price: window.event.target.value });
          }}
        />
        <input
          type="text"
          placeholder={"quantity"}
          value={leg?.quantity || 25}
          onChange={() => {
            console.log(window.event.target.value);
            setAdhocPosition({ ...leg, quantity: window.event.target.value });
          }}
        />
        <input
          type="text"
          placeholder={"CE/PE"}
          value={leg?.optType || "CE"}
          onChange={() => {
            console.log(window.event.target.value);
            setAdhocPosition({ ...leg, optType: window.event.target.value });
          }}
        />
        <input
          type="text"
          placeholder={"expiry"}
          value={leg?.expiry || "26Aug2021"}
          onChange={() => {
            console.log(window.event.target.value);
            setAdhocPosition({ ...leg, expiry: window.event.target.value });
          }}
        />
        <input
          type="text"
          placeholder={"payoff date"}
          value={leg?.payoffDate}
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
          onClick={() => {
            positions.legs[symbol].map((_leg, idx) => {
              if (leg.strike === _leg.strike) {
                positions.legs.splice(idx, 1);
                setPositions({ ...positions, legs: positions.legs });
              }
            });
          }}
        >
          delete
        </button>
      </span>
    );
  };
  
  const getAppropriateStyledText = (numericVal, showRed) => {
    if (showRed)
      return (
        <label className={`${numericVal > 0 ? "text-success" : "text-danger"}`}>
          {numericVal}
        </label>
      );
    return (
      <label
        className={`center ${numericVal > 0 ? "text-success" : "text-danger"}`}
      >
        {numericVal}
      </label>
    );
  };
  
  export const NetSummary = ({ data, positions, symbol, payoffDate }) => {
    console.log('Netsummary data');
    console.log(data);
    // {"payoff_date":"2021-08-18","legs":[{"side":"+","quantity":25,"expiry":"18AUG2021","strike":35600,"price":344.34,"optType":"CE"},{"side":"+","quantity":100,"expiry":"18AUG2021","strike":35700,"price":168.93,"optType":"CE"},{"side":"-","quantity":50,"expiry":"18AUG2021","strike":35900,"price":89.67,"optType":"CE"},{"side":"-","quantity":75,"expiry":"18AUG2021","strike":36100,"price":109.14,"optType":"CE"}]}
  
    return (
      <div className="row">
        {positions?.legs[symbol].map((leg, idx) => {
          // const isLoss = (data?.pnl && data?.pnl[idx]["P&L"] < 0) || false;
          return (
            <div style={{"padding": 10}}>
              {data?.pnl && data?.pnl[idx]
              ? getAppropriateStyledText(parseInt(data?.pnl && data?.pnl[idx] && data?.pnl[idx]["P&L"]))
              : 0}
              <p style={{"padding": 20}}>
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
  
  export const NetPnl = ({ data }) => {
    // {"payoff_date":"2021-08-18","legs":[{"side":"+","quantity":25,"expiry":"18AUG2021","strike":35600,"price":344.34,"optType":"CE"},{"side":"+","quantity":100,"expiry":"18AUG2021","strike":35700,"price":168.93,"optType":"CE"},{"side":"-","quantity":50,"expiry":"18AUG2021","strike":35900,"price":89.67,"optType":"CE"},{"side":"-","quantity":75,"expiry":"18AUG2021","strike":36100,"price":109.14,"optType":"CE"}]}
    return (
      <>
        <div style={{"padding": 20}}>
          <div style={{}}>
            <div>
              <label>DTE:</label> {data.DTE}
            </div>
            <div>
              <label>PoP:</label> {getAppropriateStyledText(data?.POP)}
            </div>
            <div>
              <label>Breakeven: </label>
              {data.breakevens}
            </div>
          </div>
          <div style={{}}>
            <div>
              <label>RR:</label> {data.maxRR}
            </div>
            <div>
              <label>Loss(Max):</label> {getAppropriateStyledText(data.maxloss)}
            </div>
            <div>
              <label>Profit(Max):</label>{" "}
              {getAppropriateStyledText(data.maxprofit)}
            </div>
            <div>
              <label>Net Credit: </label>
              {data.netcredit}
            </div>
            <div>
              <label>PnL: </label>
              {getAppropriateStyledText(data.totalPNL)}
            </div>
            <div>
              <label>IV:</label> {data.underlyingiv}
            </div>
            {/* <div>{JSON.stringify(data)}</div> */}
          </div>
          <div style={{}}>
            <div>
              <label>SPOT:</label> {data.spotPrice}
            </div>
            <div>
              <label>PnL:</label> {getAppropriateStyledText(data.totalPNL)}
            </div>
            <div>
              <label>IV:</label> {data.underlyingiv}
            </div>
            {/* <div>{JSON.stringify(_datdataa)}</div> */}
          </div>
        </div>
      </>
    );
    // (<li className="bold">{data.?.side}{leg.quantity} of {leg.strike}{leg.optType}{leg.expiry} at {leg.price}</li>)
  };

/*
WIP: Have an extension which can use browser cookies and work on zerodha app via chrome and firefox extension
WIP: get sell, buy possible from click on x-axis of the chart
WIP: ability to save multiple strategy details in Firebase/localstorage
TODO: ability to save multiple strategies along with chart and computed PnL, have a dashboard present the same. User shall be able to view a position and then save it along with some notes and an alert. 
TODO: display placed trades in this strategy
TODO: Display overall greek status somewhere (not too much)
TODO: Replace opstra logic
TODO: Get prices accurately (not realtime), a fetch button (on-demand pricing data to be fetched)
TODO: Get the  dashboard grid in with all vital stats for selected symbol
TODO: add strategy samples
TODO: add ability to bookmark saved strategy and show performance
TODO: click on CE/PE Referenceline and load the placed option in adhoc form, be able to make a change and see the effect, or reset without resubmit

*/

export const Container = ({ data, positions, setPositions, setData, payoffDate }) => {
  const [symbol, setSymbol] = useState(positions?.symbol);
    // const [trades, setTrades] = useState()
    const [adhocPosition, setAdhocPosition] = useState(positions?.adhocPosition);
  
    console.log(positions);
    // WORKING VERSION
    // "BANKNIFTY$+50x32400CEx18AUG2021x480.55x0x0&-250x35700CEx18AUG2021x436.22x0x0&+125x36500PEx18AUG2021x603.1x0x0$2021-08-12$0$0$0"
  
    const gradientOffset = () => {
      const dataMax = data?.chart
        ? Math.max(...data?.chart?.map((i) => i?.Final))
        : 0;
      const dataMin = data?.chart
        ? Math.min(...data?.chart?.map((i) => i?.Final))
        : 0;
  
      if (dataMax <= 0) {
        return 0;
      }
      if (dataMin >= 0) {
        return 1;
      }
  
      return dataMax / (dataMax - dataMin);
    };
  
    const off = gradientOffset();
  
    useEffect(() => {
      let c = symbol + "$";
      console.log(`positions.payoff_date is ${positions.payoff_date || payoffDate}`);
      positions.legs[symbol].map((leg, index) => {
        if (index != 0) {
          c += `&`;
        }
        c += `${leg.side}${leg.quantity}x${leg.strike}${leg.optType}x${leg.expiry}x${leg.price}x0x0`;
      });
      c += `$${positions.payoff_date || payoffDate}$0$0$0`;
  
      if (positions.legs[symbol].length > 0) {
        // console.log('https://3000-maroon-guanaco-brwprwdd.ws-us14.gitpod.io/api/op?c='+ (encodeURIComponent(c)))
        axios({
          // url:
          // "https://5000-maroon-guanaco-brwprwdd.ws-us14.gitpod.io/api/op?c=" + encodeURIComponent(document.location.search.replace('?c=','')),
          url:
            // "https://5000-maroon-guanaco-brwprwdd.ws-us14.gitpod.io/api/op?c=" +
            "https://tradepron.vercel.app/api/op?c=" + encodeURIComponent(c),
          method: "get",
          headers: {
            "Content-Type": "application/json"
          }
        }).then((res) => {
          console.log(res);
          setData(res.data);
        });
      }
    }, [positions, payoffDate, data]);
  
    const [opacity, setOpacity] = useState({
      uv: 1,
      pv: 1
    });
  
    const handleMouseEnter = (o) => {
      const { dataKey } = o;
      setOpacity({ [dataKey]: 0.5 });
    };
  
    const handleMouseLeave = (o) => {
      const { dataKey } = o;
      setOpacity({ [dataKey]: 1 });
    };
  
    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, false);
  
    // var xDown = null;
    // var yDown = null;
  
    function getTouches(evt) {
      return (
        evt.touches || evt.originalEvent.touches // browser API
      ); // jQuery
    }
  
    function handleTouchStart(evt) {
      const firstTouch = getTouches(evt)[0];
      // xDown = firstTouch.clientX;
      // yDown = firstTouch.clientY;
      console.log(evt);
    }
  
    function handleTouchEnd(evt) {
      const firstTouch = getTouches(evt)[0];
      // xDown = firstTouch.clientX;
      // yDown = firstTouch.clientY;
      console.log(evt);
    }
  
    function handleTouchMove(evt) {
      if (!xDown || !yDown) {
        return;
      }
  
      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;
  
      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;
  
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /*most significant*/
        if (xDiff > 0) {
          /* right swipe */
        } else {
          /* left swipe */
        }
      } else {
        if (yDiff > 0) {
          /* down swipe */
        } else {
          /* up swipe */
        }
      }
      /* reset values */
      xDown = null;
      yDown = null;
    }
  
    const schema = {
      type: "object",
      properties: {
        payoff_date: {
          type: "string",
          format: "date",
          title: "Payoff Date"
        },
        legs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              strike: {
                type: "number",
                title: "Strike Price"
                // minimum: 100,
                // maximum: 38000,
                // multipleOf: 100
              },
              expiry: {
                type: "string",
                title: "Expiry"
              },
              optType: {
                title: "CE/PE",
                type: "string",
                enum: ["CE", "PE"],
                enumNames: ["CE", "PE"]
              },
              price: {
                type: "number",
                title: "Price"
              },
              quantity: {
                title: "Quantity",
                type: "number"
                // minimum: 25,
                // maximum: 4950,
                // multipleOf: 25
              },
              side: {
                title: "side",
                type: "string",
                enum: ["-", "+"],
                enumNames: ["sell", "buy"]
              }
            }
          }
        }
      }
    };
  
    const log = (type) => console.log.bind(console, type);
  
    return (
      <div className="container">
        <div className="black-label">
          Symbol:{" "}
          <input
            title="Symbol"
            placeholder="symbol"
            className="input"
            type="text"
            value={symbol}
            onChange={() => setSymbol(window.event.target.value)}
          />
        </div>
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
              className="collapseOne accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent=".accordionExample"
            >
              <div className="accordion-body">
                <Form
                  schema={schema}
                  formData={{ legs: positions?.legs[symbol], payoff_date: payoffDate}}
                  UISchema={{
                    quantity: {
                      "ui:widget": "updown"
                    },
                    strike: {
                      "ui:widget": "range"
                    }
                  }}
                  onChange={log("changed")}
                  onSubmit={({ formData }, e) => {
                    console.log(formData);
                    log("submitted");
                    setPositions({ legs: {[symbol]: formData.legs }});
                    // console.log(positions);
                  }}
                  onError={log("errors")}
                />
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header headingTwo">
              <button
                className="accordion-button collapsed"
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
              className="collapseTwo accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent=".accordionExample"
            >
              <div className="accordion-body">
                <div className={"container"}>
                  <div className="row">
                  <NetSummary positions={positions} data={data} symbol={symbol} payoffDate={payoffDate} />
                </div>
  
                  <div className="row">
                    <NetPnl data={data} />
                  </div>
                </div>
                <AreaChart
                  width={700}
                  height={500}
                  data={data?.chart || []}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0
                  }}
                  handleTouchStart={handleTouchStart}
                  handleTouchEnd={handleTouchEnd}
                >
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis
                    dataKey="StockPrice"
                    onClick={() => {
                      const val = window.event?.target?.innerHTML;
                      console.log("xaxis clicked ");
                      console.log(adhocPosition);
                      setAdhocPosition({
                        ...adhocPosition,
                        strike: parseInt(Math.floor(val / 100) * 100)
                      });
                    }}
                  />
                  <YAxis />
                  <Legend
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  />
                  <Tooltip
                    content={<CustomTooltip spotPrice={data?.spotPrice} />}
                  />
  
                {positions?.legs && positions.legs[symbol]?.map((leg, _idx) => (
                  <ReferenceLine
                      key={_idx}
                      x={leg.strike}
                      stroke={leg.optType === "CE" ? "magenta" : "orange"}
                      strokeDasharray="3 4 5 2"
                      label={`${leg.side === "sell" ? "-" : ""}${
                        leg.quantity
                      } @ ${leg.price}`}
                    />
                  ))}
                  <ReferenceLine
                    x={data?.spotPrice?.toFixed() || 35500}
                    stroke="black"
                    label="S"onClick
                  onDrag={() => {
                    console.log(event)
                  }}
                  onDoubleClick={(w) => {
                    w.preventDefault()
                    console.log('event')
                  }}
                  />
  
                  <defs>
                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset={off} stopColor="green" stopOpacity={1} />
                      <stop offset={off} stopColor="red" stopOpacity={1} />
                    </linearGradient>
                  </defs>
  
                  <Area
                    offset={off}
                    type="monotone"
                    dataKey="Final"
                    fill="url(#splitColor)"
                  />
                  <Area
                    fillOpacity={-1}
                    offset={off}
                    type="monotone"
                    fill="url(#splitColor)"
                    dataKey="Today"
                  />
                  <Area
                    offset={off}
                    type="monotone"
                    dataKey="Change"
                    fill="blue"
                    fillOpacity={opacity["Change"]}
                  />
                  {/* <Line type="monotone" dataKey="Final" strokeOpacity={opacity.Final} stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Change" strokeOpacity={opacity.Change} stroke="blue" activeDot={{ r: 8 }} /> */}
                </AreaChart>
  
                <CustomLegInput
                  setAdhocPosition={setAdhocPosition}
                  adhocPosition={adhocPosition}
                  setPositions={setPositions}
                  positions={positions}
                />
  
                {/* {positions?.legs?.map((leg, idx) => (
                    <span key={idx}>
                      <CustomLegInput
                        positions={positions}
                        leg={leg}
                        setPositions={setPositions}
                      />{" "}
                      <br />
                    </span>
                  ))} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  
function ZeroTradeApp({legs, symbol, payoffDate}) {
  const [data, setData] = useState({
    legs,
    pnl: {},
    greeks: {},
    positions: []
  });
  const [positionId, setPositionId] = useState("1");
  const [positions, setPositions] = useState({
    ...JSON.parse(window.localStorage.getItem(positionId)), 
    ...legs
  });


    useEffect(() => {
      // setPositions(JSON.parse(window.localStorage.getItem(positionId)));
    }, [positionId]);
  
    return (
      <>
        <button
          className="btn-primary"
          type="button"
          onClick={() => setPositionId("1")}
        >
          Position # 1
        </button>
        <button
          className="btn-primary"
          type="button"
          onClick={() => setPositionId("2")}
        >
          Position # 2
        </button>

      <button
        className="btn-primary"
        type="button"
        onClick={() => {
          getZeroPositions()
          .then((all_positions) => {
            setPositions({ legs: all_positions, symbol });
          })
        }}
      >
        Zerodha Positions
      </button>
        <Container
          setData={setData}
          data={data}
          positions={positions}
          payoffDate={payoffDate}
          setPositions={setPositions}
        />
      </>
    );
  }
  


const Popup = () => {
  const [zero_data, setZeroData] = useState({});
  const [symbol, setSymbol] = useState('BANKNIFTY');//FIXME: fix hardcoding
  useEffect(() => {
  }, [])
  return zero_data ? (
    <div className="popup">
      {/* FIXME: fix hardcoding below */}
      <ZeroTradeApp legs={zero_data || []} symbol={symbol} payoffDate={'2021-08-26'} />
      {localStorage.getItem('__storejs_kite_user/user_name')}
      {/* <p className="popup-greet">Thanks for using <span className="brand">Zerodha</span></p> */}
      {/* <p className="stack-head">Made using :</p> */}
      {/* <TechStackLogos /> */}
      {/* <p className="contrib-msg">We would love some of your help in making this boilerplate even better. <br /><a href="https://www.github.com/kryptokinght/react-extension-boilerplate" target="_blank">React Extension Boilerplate</a></p> */}
    </div>
  ): (<>void</>);
};


export default Popup;
