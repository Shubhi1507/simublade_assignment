import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {ROUTES} from './routes.constant';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import VerifyPhone from '../screens/VerifyPhone';
const AppStack = createStackNavigator();

export function AppNavigation() {
  return (
    <AppStack.Navigator initialRouteName={ROUTES.AUTH.LOGINSCREEN}>
      <AppStack.Screen
        name={ROUTES.AUTH.LOGINSCREEN}
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <AppStack.Screen
        name={ROUTES.AUTH.SIGNUPSCREEN}
        component={SignupScreen}
        options={{headerShown: false}}
      />
      <AppStack.Screen
        name={ROUTES.AUTH.DASHBOARDSCREEN}
        component={DashboardScreen}
        options={{headerShown: true}}
      />
      <AppStack.Screen
        name={ROUTES.AUTH.VERIFYPHONE}
        component={VerifyPhone}
        options={{headerShown: true}}
      />
    </AppStack.Navigator>
  );
}
