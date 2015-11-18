import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import routes from './routes.js';

const rootElement = document.getElementById('root');

render(routes, rootElement);
