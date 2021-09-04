import React, { useEffect, useState } from "react";
import axios from "axios";

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

window.localStorage.setItem(
  "ORIGINAL",
  JSON.stringify({
    adhocPosition: {
      side: "+",
      strike: 36500,
      quantity: 50,
      price: 344.34,
      optType: "CE",
      expiry: "26AUG2021",
      payoffDate: "2021-08-26"
    },
    symbol: "BANKNIFTY",
    payoff_date: "2021-08-26",
    legs: [
      {
        side: "+",
        quantity: 75,
        expiry: "02SEP2021",
        strike: 35100,
        price: 483.78,
        optType: "CE"
      },
      {
        side: "-",
        quantity: 75,
        expiry: "26AUG2021",
        strike: 35800,
        price: 117.85,
        optType: "CE"
      }
    ]
  })
);

window.localStorage.setItem(
  "2408ADJUSTMENTIFBANKNIFTYFALLS",
  JSON.stringify({
    adhocPosition: {
      side: "+",
      strike: 36500,
      quantity: 50,
      price: 344.34,
      optType: "CE",
      expiry: "26AUG2021",
      payoffDate: "2021-08-26"
    },
    symbol: "BANKNIFTY",
    payoff_date: "2021-08-26",
    legs: [
      {
        side: "+",
        quantity: 75,
        expiry: "09SEP2021",
        strike: 35400,
        price: 624,
        optType: "CE"
      },
      {
        side: "-",
        quantity: 75,
        expiry: "26AUG2021",
        strike: 35400,
        price: 407,
        optType: "CE"
      }
    ]
  })
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
      expiry: "18AUG2021",
      payoffDate: "2021-08-18"
    },
    payoff_date: "2021-08-18",
    legs: [
      {
        side: "+",
        quantity: 225,
        expiry: "02SEP2021",
        strike: 35100,
        price: 684.15,
        optType: "CE"
      },
      {
        side: "-",
        quantity: 225,
        expiry: "18AUG2021",
        strike: 36100,
        price: 102.66,
        optType: "CE"
      }
    ]
  })
);

window.localStorage.setItem(
  "3",
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
        value={leg?.expiry || "18Aug2021"}
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
          positions.legs.map((_leg, idx) => {
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

export const NetSummary = ({ data, positions }) => {
  // {"payoff_date":"2021-08-18","legs":[{"side":"+","quantity":25,"expiry":"18AUG2021","strike":35600,"price":344.34,"optType":"CE"},{"side":"+","quantity":100,"expiry":"18AUG2021","strike":35700,"price":168.93,"optType":"CE"},{"side":"-","quantity":50,"expiry":"18AUG2021","strike":35900,"price":89.67,"optType":"CE"},{"side":"-","quantity":75,"expiry":"18AUG2021","strike":36100,"price":109.14,"optType":"CE"}]}

  return (
    <div className="row">
      {positions?.legs.map((leg, idx) => {
        // const isLoss = (data?.pnl && data?.pnl[idx]["P&L"] < 0) || false;
        return (
          <div className="col-6 col-sm-3">
            {data?.pnl && data?.pnl[idx] < 0
              ? getAppropriateStyledText(data?.pnl && data?.pnl[idx]["P&L"] < 0)
              : 0}
            <p className="padding-10">
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
      <div className="row justify-content-start">
        <div className="col-6 col-sm-4">
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
        <div className="col-12 col-sm-4">
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
        <div className="col-12 col-sm-4">
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

  TODO: separate echarts candlesticks widget where you can place option calls/puts using charts only (optionIQ like), also showing PnL go-along, payoff chart linked from a link there
*/

export const Container = ({ data, positions, setPositions, setData }) => {
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
    positions.legs.map((leg, index) => {
      if (index != 0) {
        c += `&`;
      }
      c += `${leg.side}${leg.quantity}x${leg.strike}${leg.optType}x${leg.expiry}x${leg.price}x0x0`;
    });
    c += `$${positions.payoff_date}$0$0$0`;

    if (positions.legs.length > 0) {
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
  }, [positions]);

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
      <div className="body">
        <div className={"container"}>
          <div className="row">
            <NetSummary positions={positions} data={data} />
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
          <Tooltip content={<CustomTooltip spotPrice={data?.spotPrice} />} />

          {positions?.legs.map((leg, _idx) => (
            <ReferenceLine
              key={_idx}
              x={leg.strike}
              stroke={leg.optType === "CE" ? "magenta" : "orange"}
              strokeDasharray="3 4 5 2"
              label={`${leg.side === "sell" ? "-" : ""}${leg.quantity} @ ${
                leg.price
              }`}
            />
          ))}
          <ReferenceLine
            x={data?.spotPrice?.toFixed() || 35500}
            stroke="black"
            label="S"
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
                formData={positions}
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
                  setPositions({ ...positions, ...formData });
                  console.log(positions);
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
        </div>
      </div>
    </div>
  );
};

export const App = () => {
  const [data, setData] = useState({
    legs: [],
    pnl: {},
    greeks: {},
    positions: []
  });
  const [positionId, setPositionId] = useState("ORIGINAL");
  const [positions, setPositions] = useState(
    JSON.parse(window.localStorage.getItem(positionId))
  );

  useEffect(() => {
    setPositions(JSON.parse(window.localStorage.getItem(positionId)));
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
      <Container
        setData={setData}
        data={data}
        positions={positions}
        setPositions={setPositions}
      />
    </>
  );
}
