

import React, { useEffect, useState } from 'react';
import {
  Area, AreaChart, Legend, ReferenceLine,
  Tooltip, XAxis,
  YAxis
} from "recharts";
import { CustomLegInput } from './custom_leg';
import { CustomTooltip } from './tooltip';
import { showAlert } from '../helpers/browser';


  export const PayoffChart = ({
    data,
    positions,
    symbol,
    setPositions,
    setData,
    computeTradeGraph,
    payoffDate,
  }) => {
    const [adhocPosition, setAdhocPosition] = useState(positions?.adhocPosition);
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
      computeTradeGraph({symbol,positions, payoffDate, showAlert, setData});
    },[])
  
    const [opacity, setOpacity] = useState({
      uv: 1,
      pv: 1,
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
  
    return (
      <div>
        <AreaChart
          width={700}
          height={500}
          data={data?.chart || []}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          // handleTouchStart={handleTouchStart}
          // handleTouchEnd={handleTouchEnd}
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
                strike: parseInt(Math.floor(val / 100) * 100),
              });
            }}
          />
          <YAxis />
          <Legend
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <Tooltip content={<CustomTooltip spotPrice={data?.spotPrice} />} />
  
          {positions?.legs && positions.legs[symbol] &&
            positions.legs[symbol]?.map((leg, _idx) => (
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
            onClick={() => console.log}
            onDrag={() => {
              console.log(event);
            }}
            onDoubleClick={(w) => {
              w.preventDefault();
              console.log("event");
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
          symbol={symbol}
          setAdhocPosition={setAdhocPosition}
          adhocPosition={adhocPosition}
          setPositions={setPositions}
          positions={positions}
        />
      </div>
    );
  };