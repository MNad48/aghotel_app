// App.js
import React, { useState, createContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Startup from './app/Startup';
import Main from './app/Main';
import Checkout from './app/Checkout';
import Login from './app/Login';
import Settings from './app/Settings';
import SettingButton from './app/SettingButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createStackNavigator();
// Create separate contexts for user and API address
export const UserContext = createContext();
export const APIAddressContext = createContext();
const App = () => {
  const [user_id, setUserId] = useState(null);
  const [apiAddress, setApiAddress] = useState(null);
  const [perHead, setPerHead] = useState(null);
  // Function to set the user_id when login is successful
  const onLoginSuccess = (userId) => {
    setUserId(userId);
  };
  const getApiAddress = async () => {
    try {
      const address = await AsyncStorage.getItem('apiAddress');
      const phead = await AsyncStorage.getItem('perHeadCharges');
      setApiAddress(address);
      setPerHead(phead)
    } catch (error) {
      console.error('Error retrieving API address:', error);
    }
  };
  // Call getApiAddress when the component mounts
  useEffect(() => {
    getApiAddress();
  }, []);
  return (
    <UserContext.Provider value={{ user_id, onLoginSuccess }}>
      <APIAddressContext.Provider value={{ apiAddress,perHead,setApiAddress,setPerHead }}>
        <NavigationContainer style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '80%' }}>
          <Stack.Navigator>
            <Stack.Screen name="startup" component={Startup} options={{ headerShown: false }} />
            <Stack.Screen name="login" component={Login} options={{ header: () => <SettingButton /> }} />
            <Stack.Screen name="main" component={Main} options={{ title: 'Order Food', header: () => <SettingButton />, headerLeft: null }} />
            <Stack.Screen name='checkout' component={Checkout} options={{ title: 'Checkout', header: () => <SettingButton /> }} />
            <Stack.Screen name='settings' component={Settings} options={{ title: 'Settings' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </APIAddressContext.Provider>
    </UserContext.Provider>
  );
};
export default App;
