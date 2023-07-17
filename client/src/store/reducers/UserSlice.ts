import { IUser } from "../../models/IUser"
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface UserState{
    isAuth:boolean,
    user:IUser
}

const initialState:UserState = {
    isAuth:true,
    user:{
        id:1,
        email:"tima.chaburko@mail.ru",
        role:"USER",
        isActivated:false
    }
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setIsAuth(state, action:PayloadAction<boolean>){
            state.isAuth = action.payload;
        },
        setUser(state,action:PayloadAction<IUser>) {
            state.user = action.payload;
        }
    }
})

export default userSlice.reducer;