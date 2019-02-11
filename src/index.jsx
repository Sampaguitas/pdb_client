import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './_helpers';
import { App } from './app/app.jsx';

render(
    <Provider store={store}>
	    <App />
    </Provider>,
    document.getElementById('app')
);
