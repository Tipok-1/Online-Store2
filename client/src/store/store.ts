import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './reducers/UserSlice';
import DeviceReducer from "./reducers/DeviceSlice";
import { authApi, Api} from "../services/commonApi";

const rootReducer = combineReducers({
    userReducer,
    DeviceReducer,
    [authApi.reducerPath]:authApi.reducer,
    [Api.reducerPath]:Api.reducer
});

export const setupStore = ()=>{
    return configureStore({
        reducer:rootReducer,
        middleware:getDefaultMiddleware => getDefaultMiddleware().concat(authApi.middleware, Api.middleware),
    })
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];