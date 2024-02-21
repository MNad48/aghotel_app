import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {APIAddressContext} from '../App'; // Adjust the path based on your project structure
const Settings = ({navigation}) => {
  const [settingsApiAddress, setSettingsApiAddress] = useState('');
  const [perHeadCharges, setPerHeadCharges] = useState('');
  const {onAPIAddressChanged, onPHeadChanged} = useContext(APIAddressContext);
  useEffect(() => {
    // Load values from AsyncStorage when the component is initially loaded
    const loadSettings = async () => {
      try {
        const savedApiAddress = await AsyncStorage.getItem('apiAddress');
        const savedPerHeadCharges = await AsyncStorage.getItem(
          'perHeadCharges',
        );
        if (savedApiAddress !== null) {
          setSettingsApiAddress(savedApiAddress);
        }

        if (savedPerHeadCharges !== null) {
          setPerHeadCharges(savedPerHeadCharges);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []); // Empty dependency array ensures that this effect runs once when the component mounts

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('apiAddress', settingsApiAddress);
      await AsyncStorage.setItem('perHeadCharges', perHeadCharges);
      onAPIAddressChanged(settingsApiAddress);
      onPHeadChanged(perHeadCharges);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>Network Settings</Text>
        <Text style={styles.label}>API Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter API Address"
          value={settingsApiAddress}
          onChangeText={text => setSettingsApiAddress(text)}
          onBlur={() => Keyboard.dismiss()}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Application Settings</Text>
        <Text style={styles.label}>Per Head Charges</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Per Head Charges"
          value={perHeadCharges}
          onChangeText={text => setPerHeadCharges(text)}
          onBlur={() => Keyboard.dismiss()}
        />
      </View>
      <TouchableOpacity style={styles.saveBtn} onPress={saveSettings}>
        <Icon name="save" size={24} color="#fff" />
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 16,
  },
  section: {
    marginBottom: 16,
    width: '100%',
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 16,
    borderColor: '#ddd',
    borderRadius: 8,
    borderWidth: 1,
    paddingLeft: 10,
    marginTop: 4,
  },
  heading: {
    fontSize: 20,
    marginVertical: 8,
    color: '#333',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginVertical: 4,
    color: '#666',
  },
  saveBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#03f',
    height: 50,
    width: '100%',
    borderRadius: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
  },
});
export default Settings;
