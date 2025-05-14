import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'; // Local storage for web
import rootReducer from './_root.reducer'; 

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage, // Use localStorage to persist state
  whitelist: ['recipe'], // Only persist needed data
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewareList = process.env.NODE_ENV === 'development' ? [logger] : [];

const store = createStore(
  persistedReducer,
  applyMiddleware(...middlewareList),
);

const persistor = persistStore(store)

export { store, persistor };