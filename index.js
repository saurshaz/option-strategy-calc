import React from 'react';
import ReactDOM from 'react-dom';
// import '../content_scripts/bootstrap.css';
// import '../content_scripts/bootstrap.js';
// import * as browser from 'webextension-polyfill';
import './src/styles.css';
import { Popup } from './src/popup/Popup';

ReactDOM.render(<Popup text="Ext boilerplate" />, document.getElementById('root'));

