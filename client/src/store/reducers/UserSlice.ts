import { IUser } from "../../models/IUser"
import { createSlice } from '@reduxjs/toolkit'

interface UserState{
    isAuth:boolean,
    user:IUser
}

const initialState:UserState = {
    isAuth:false,
    user:{
        id:1,
        email:"email",
        role:"USER",
        isActivated:false
    }
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{

    }
})

export default userSlice.reducer;