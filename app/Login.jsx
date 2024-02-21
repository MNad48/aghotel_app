import React, {useContext, useState, useEffect} from 'react';
import {View, TextInput, Button, Alert, Keyboard, ToastAndroid} from 'react-native';
import {APIAddressContext,UserContext} from '../App'; // Adjust the path based on your project structure
import axios from 'axios';
const Login = ({navigation}) => {
  const {onLoginSuccess} = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassowrd] = useState('');
  const {apiAddress} = useContext(APIAddressContext);
  const handleLogin = () => {
    //isKeyboardOpen && Keyboard.dismiss();
    // Perform login logic and get user_id
    const requestData = {
      name: username,
      password: password,
    };
    axios
      .post(apiAddress + '/login', requestData)
      .then(response => {
        if (response.data.result == 'ok') {
          onLoginSuccess(response.data.auth_id);
          navigation.navigate('main');
        } else {
          Alert.alert('Invalid credentials... Plz try again');
        }
      })
      .catch(error => {
        console.log(apiAddress);
        if(error.response) {
          ToastAndroid.show("Some unhandled error recieved",ToastAndroid.SHORT);
        } else if(error.request) {
          ToastAndroid.show("check your wifi or wait few seconds",ToastAndroid.SHORT);
        }
      });
  };

  return (
    <View>
      {/* Your login UI components (TextInput, Button, etc.) */}
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
        onBlur={()=>Keyboard.dismiss()}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={text => setPassowrd(text)}
        onBlur={()=>Keyboard.dismiss()}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};
export default Login;
