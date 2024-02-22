import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ToastAndroid } from 'react-native';
const API_ADDRESS = "@MyApp:apiAddress";
const PER_HEAD = "@MyApp:perHeadCharges";
export const loadSettings = ()=>async dispatch=> {
    try {
        const apiAddress = await AsyncStorage.getItem(API_ADDRESS);
        const perHead = await AsyncStorage.getItem(PER_HEAD);

        dispatch(setApiAddress(apiAddress));
        dispatch(setPerHead(parseInt(perHead) || 0));
    }catch(error) {
        ToastAndroid.showWithGravity("Error loading settings",ToastAndroid.SHORT,ToastAndroid.BOTTOM);
    }
}

export const saveSettings = ({apiAddress,perHead})=>async dispatch=> {
    console.log(apiAddress,perHead);
    try{
        await AsyncStorage.setItem(API_ADDRESS,apiAddress);
        await AsyncStorage.setItem(PER_HEAD,perHead.toString());
        dispatch(setApiAddress(apiAddress));
        dispatch(setPerHead(perHead));
    }catch(error) {
        console.log(error);
        ToastAndroid.showWithGravity("Error Saving settings",ToastAndroid.SHORT,ToastAndroid.BOTTOM);
    }
}
const settingSlice = createSlice({
    name:'setting',
    initialState:{
        apiAddress:'',
        perHead:0,
    },
    reducers: {
        setApiAddress(state,action){
            state.apiAddress=action.payload;
        },
        setPerHead(state,action){
            state.perHead=action.payload;
        },
    }
})

export const {setApiAddress,setPerHead} = settingSlice.actions;
export default settingSlice.reducer;