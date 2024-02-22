import {configureStore} from '@reduxjs/toolkit';
import settingReducer from './settingSlice';

const store = configureStore({
    reducer:{
        settings:settingReducer
    }
});

export default store;