'use strict';

import { createStore } from 'redux';
import reducers        from './reducers';

let store = createStore(reducers.app);

export default store;