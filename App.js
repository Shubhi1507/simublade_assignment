/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 */

import React, {useCallback} from 'react';
import {
  LogBox,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';

import  Configurestore from './app/src/redux/store/store';
import {navigationRef} from './app/src/navigation/navigation.service';
import { AppNavigation } from './app/src/navigation/app.navigation';

const {store, persistor} = Configurestore();

const App = () => {
  return (
      <View style={styles.rootContainer}>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <SafeAreaView style={styles.safeAreaContainer}>
                <NavigationContainer ref={navigationRef}>
                  <AppNavigation />
                </NavigationContainer>
              </SafeAreaView>
            </PersistGate>
          </Provider>
      </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  safeAreaContainer: {
    flex: 1,
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    // backgroundColor: COLORS.backgroundColor,
  },
});

export default App;
