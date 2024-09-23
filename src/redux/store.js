import { createStore, applyMiddleware } from 'redux';
// import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import rootReducer from './_root.reducer';

const logger = createLogger()

const middlewareList = process.env.NODE_ENV === 'development' ? [logger] : [];

const store = createStore(
  rootReducer,
  applyMiddleware(...middlewareList)
);

export default store;