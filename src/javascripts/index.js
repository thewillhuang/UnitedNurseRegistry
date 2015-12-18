import React from 'react';
import { render } from 'react-dom';
import routes from './routes.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router } from 'react-router';
// import createBrowserHistory from 'history/lib/createBrowserHistory';
const rootElement = document.getElementById('root');
// window.Raygun.init('UgAzJsDSFIE5iozXGjsGqQ==').attach();
// window.Raygun('apiKey', 'UgAzJsDSFIE5iozXGjsGqQ==');
// window.Raygun('enableCrashReporting', true);
// window.Raygun('enablePulse', true);
injectTapEventPlugin();

// render(<Router history={createBrowserHistory()} routes={routes}/>, rootElement);
render(<Router routes={routes}/>, rootElement);
