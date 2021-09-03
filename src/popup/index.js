import React from 'react';
import ReactDOM from 'react-dom';
import '../content_scripts/bootstrap.css';
import '../content_scripts/bootstrap.js';
// import * as browser from 'webextension-polyfill';
import './index.css';
import { Popup } from './Popup';

ReactDOM.render(<Popup text="Ext boilerplate" />, document.getElementById('root'));

