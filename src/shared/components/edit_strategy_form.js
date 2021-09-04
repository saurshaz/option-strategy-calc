
import React from 'react';
import Form from 'react-jsonschema-form';
import { computeTradeGraph } from '../helpers/utils';
import { showAlert } from '../helpers/browser';

export const EditStrategyForm = ({schema, positions, symbol, setPositions, payoffDate, setData}) => {
  // debugger;
  return (
    <div className="accordion-body">
      <Form
        schema={schema}
        formData={{
          legs: positions?.legs && positions?.legs[symbol],
          // payoff_date: payoffDate,
        }}
        UISchema={{
          quantity: {
            'ui:widget': 'updown',
          },
          strike: {
            'ui:widget': 'range',
          },
        }}
        onChange={(event) => {
          // console.log(event)
          setPositions({ legs: { [symbol]: event?.formData.legs } });
        }}
        onSubmit={({ formData }, e) => {
          console.log(formData);
          setPositions({ legs: { [symbol]: formData.legs } });
          computeTradeGraph({symbol,positions, payoffDate, showAlert, setData});
          // console.log(positions);
        }}
        onError={console.log('errors')}
      />
    </div>
  );
};