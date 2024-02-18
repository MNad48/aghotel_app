// Startup.js
import React, {useEffect, useContext} from 'react';
import {Animated, StyleSheet, ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {APIAddressContext, UserContext} from '../App';
const Startup = ({navigation}) => {
  const opacity = new Animated.Value(0);
  const {apiAddress} = useContext(APIAddressContext);
  const {user_id} = useContext(UserContext);
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true,
    }).start(() => {
      // Navigate to the main screen or login screen based on conditions
      if (user_id) {
        navigation.navigate('main');
      } else {
        navigation.navigate('login');
      }
    });
  }, [opacity, navigation, user_id]);
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
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
export default Startup;
