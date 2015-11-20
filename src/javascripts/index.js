import React from 'react';
import { render } from 'react-dom';
import routes from './routes.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router } from 'react-router';
const rootElement = document.getElementById('root');

injectTapEventPlugin();

render(<Router routes={routes}/>, rootElement);
