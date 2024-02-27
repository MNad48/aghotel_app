import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector,useDispatch} from 'react-redux';
import { saveSettings } from './lib/settingSlice';
const Settings = ({navigation}) => {
  const [settingsApiAddress, setSettingsApiAddress] = useState('');
  const [perHeadCharges, setPerHeadCharges] = useState('');
  const apiAddress = useSelector(state=>state.settings.apiAddress);
  const perHead = useSelector(state=>state.settings.perHead);
  const dispatch = useDispatch();
  useEffect(() => {
    setSettingsApiAddress(apiAddress);
    setPerHeadCharges(perHead.toString());
  }, [apiAddress,perHead]); // Empty dependency array ensures that this effect runs once when the component mounts

  const save = () => {
    dispatch(saveSettings({apiAddress:settingsApiAddress,perHead:perHeadCharges}));
    navigation.goBack();
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
      <TouchableOpacity style={styles.saveBtn} onPress={save}>
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
