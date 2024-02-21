import React from 'react';
import { View, TouchableOpacity,BackHandler, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation,useRoute } from '@react-navigation/native';
const SettingButton = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const handleSettingsPress = () => {
      navigation.navigate('settings');
    };
    const handleBackPress = ()=>{
      if(route.name==='main') {
        BackHandler.exitApp();
      } else {
        navigation.goBack();
      }
    }
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
        {/* Your App Name */}
        <TouchableOpacity onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        {/* Settings Icon */}
        <TouchableOpacity onPress={handleSettingsPress}>
          <Icon name="settings" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };
export default SettingButton;