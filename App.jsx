// App.js
import React, {useState, createContext, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Startup from './app/Startup';
import Main from './app/Main';
import Checkout from './app/Checkout';
import Settings from './app/Settings';
import SettingButton from './app/SettingButton';
const Stack = createStackNavigator();
import {Provider} from 'react-redux';
import store from './app/lib/store';
import { loadSettings } from './app/lib/settingSlice';
const App = () => {
  useEffect(()=>{
    store.dispatch(loadSettings());
  },[]);
  return (
    <Provider store={store}>
        <NavigationContainer
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%',
          }}>
          <Stack.Navigator>
            <Stack.Screen
              name="startup"
              component={Startup}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="main"
              component={Main}
              options={{title: 'Order Food', header: () => <SettingButton />}}
            />
            <Stack.Screen
              name="checkout"
              component={Checkout}
              options={{title: 'Checkout', header: () => <SettingButton />}}
            />
            <Stack.Screen
              name="settings"
              component={Settings}
              options={{title: 'Settings'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
    </Provider>
  );
};
export default App;
