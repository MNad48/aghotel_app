// Startup.js
import React, {useEffect, useContext} from 'react';
import {Animated, StyleSheet, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {APIAddressContext} from '../App';
const Startup = ({navigation}) => {
  const opacity = new Animated.Value(0);
  const {onAPIAddressChanged} = useContext(APIAddressContext);

  const apiAddress = async () => {
    const address = await AsyncStorage.getItem('apiAddress');
    return address;
  };
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true,
    }).start(async () => {
      // Navigate to the main screen or login screen based on condition
      const address = await apiAddress();
      onAPIAddressChanged(address);
      navigation.navigate('main');
    });
  }, [opacity, navigation]);
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{opacity}}>
        <ImageBackground
          source={require('./res/aghotel.png')}
          style={styles.bgImage}
        />
      </Animated.View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Adjust the background color as needed
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bgImage: {
    flex: 1,
    resizeMode: 'contain',
  },
});
export default Startup;
