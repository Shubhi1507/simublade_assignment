import {legacy_createStore as createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createTransform from 'redux-persist/es/createTransform';
import Flatted from 'flatted';
import RootReducer from '../reducer';

export const transformCircular = createTransform(
  (inboundState, key) => Flatted.stringify(inboundState),
  (outboundState, key) => Flatted.parse(outboundState),
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  transforms: [transformCircular],
};

const persistedReducer = persistReducer(persistConfig, RootReducer);

export default () => {
  //   const sagaMiddleware = createSagaMiddleware();

  const store = createStore(persistedReducer);

  let persistor = persistStore(store);
  //   sagaMiddleware.run(sagas);

  return {store, persistor};
};
