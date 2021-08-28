import React from 'react';
import ReactDOM from 'react-dom';
// import * as browser from 'webextension-polyfill';
import './index.css';
import {Popup} from './Popup';
import '../content_scripts/bootstrap.js';
import '../content_scripts/bootstrap.css';

ReactDOM.render(<Popup text="Ext boilerplate" />, document.getElementById('root'));

