import React from "react";
import { render } from "react-dom";
import { WrappedApp as App } from '../shared/containers/wrapped_app';
console.log('hello from App');
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    console.log(document.querySelector("#root"));
    render(<App />, document.querySelector("#root"));
});

