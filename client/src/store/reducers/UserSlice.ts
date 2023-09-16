import { IUser } from "../../models/IUser"
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface UserState{
    isAuth:boolean,
    user:IUser
    sentEmailConfirmation:boolean
}

const initialState:UserState = {
    isAuth:false,
    sentEmailConfirmation:false,
    user:{
        id:2,
        email:"chaburko.tima@mail.ru",
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
        },
        setSentEmailConfirmation(state, action:PayloadAction<boolean>){
            state.sentEmailConfirmation = action.payload;
        }
    }
})

export default userSlice.reducer;