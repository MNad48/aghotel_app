import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Startup from './app/Startup';
import Login from './app/Login'; // Import your LoginScreen component
import Main from './app/Main';
import Checkout from './app/Checkout';
import { Settings } from './app/Settings';
import {UserContext} from './App'; // Import your UserContext
const Drawer = createDrawerNavigator();
const AppNavigator = () => {
  const {user_id} = useContext(UserContext);
  return (
    <NavigationContainer>
      {user_id ? (
        // User is logged in, show the drawer navigator
        <Drawer.Navigator initialRouteName="startup">
          <Drawer.Screen
            name="startup"
            component={Startup}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="login"
            component={Login}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="main"
            component={Main}
            options={{title: 'Order Food', headerLeft: null}}
          />
          <Drawer.Screen
            name="checkout"
            component={Checkout}
            options={{title: 'Checkout'}}
          />
          <Drawer.Screen name="Settings" component={Settings} />
        </Drawer.Navigator>
      ) : (
        // User is not logged in, show the login screen
        <Drawer.Navigator>
          <Drawer.Screen name="Login" component={Login} />
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  );
};
export default AppNavigator;
