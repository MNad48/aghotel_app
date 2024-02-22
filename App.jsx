// App.js
import React, {useState, createContext, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Startup from './app/Startup';
import Main from './app/Main';
import Checkout from './app/Checkout';
import Settings from './app/Settings';
import SettingButton from './app/SettingButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createStackNavigator();
import {Provider} from 'react-redux';
import store from './app/lib/store';
// Create separate contexts for user and API address
export const APIAddressContext = createContext();
const App = () => {
  const [apiAddress, setApiAddress] = useState(null);
  const [perHead, setPerHead] = useState(null);
  const onAPIAddressChanged = address => {
    setApiAddress(address);
  };
  const onPHeadChanged = head => {
    setPerHead(head);
  };
  const getApiAddress = async () => {
    try {
      const address = await AsyncStorage.getItem('apiAddress');
      const phead = await AsyncStorage.getItem('perHeadCharges');
      setApiAddress(address);
      setPerHead(phead);
    } catch (error) {
      console.error('Error retrieving API address:', error);
    }
  };
  // Call getApiAddress when the component mounts
  useEffect(() => {
    getApiAddress();
  }, []);
  return (
    <Provider store={store}>
      <APIAddressContext.Provider
        value={{apiAddress, perHead, onAPIAddressChanged, onPHeadChanged}}>
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
      </APIAddressContext.Provider>
    </Provider>
  );
};
export default App;
