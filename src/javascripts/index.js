import React from 'react';
import { render } from 'react-dom';
import routes from './routes.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import { Router } from 'react-router';

const rootElement = document.getElementById('root');

render(<Router routes={routes}/>, rootElement);
