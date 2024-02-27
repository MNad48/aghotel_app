import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';

const Startup = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to the 'Main' screen after 3 seconds
      navigation.replace('main');
    }, 3000); // Adjust the delay time as needed
    // Clean up the timer
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('./res/aghotel.png')}
        style={styles.bgImage}
      />
    </View>
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
    resizeMode: 'cover',
  },
});

export default Startup;
