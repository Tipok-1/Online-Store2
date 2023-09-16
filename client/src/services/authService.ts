import { IUser } from "../models/IUser";
import { IAuthResponse } from "../models/response/AuthResponse";
import { userSlice } from "../store/reducers/UserSlice";
import { authApi, Api } from "./commonApi";
import { ThunkDispatch, AnyAction } from "@reduxjs/toolkit";

interface ILoginData{
    email:string,
    password:string,
    role:string
}

export const authApiUser= authApi.injectEndpoints({
    endpoints:(build)=>({
        registration: build.mutation<IAuthResponse, ILoginData>({
            query:(registrationData)=>({
                url:'/user/registration',
                method:'POST',
                body: registrationData
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const response= await queryFulfilled;
                    saveUser(response.data, dispatch);
                    
                } catch (e) {
                    console.error("Registration error " + e);
                }
            },
        }),

        login: build.mutation<IAuthResponse, Omit<ILoginData, "role">>({
            query:(loginData)=>({
                url:'/user/login',
                method:'POST',
                body:loginData
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const response= await queryFulfilled;
                    saveUser(response.data, dispatch);
                    
                } catch (e) {
                    console.error("Login error " + e);
                }
            },
        }),
        
        logout: build.mutation<void, void>({
            query:()=>({
                url:'/user/logout',
                method:'POST',            
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    localStorage.removeItem('token');
                    dispatch(userSlice.actions.setIsAuth(false));
                    dispatch(userSlice.actions.setUser({} as IUser));
                    
                } catch (e) {
                    console.error("Logout error " + e);
                }
            },
        }),

        sendActivationMessage: build.mutation<void, string>({
            query:(email)=>({
                url:'/user/send_message',
                method:'POST',
                body:{email: email}        
            }),
        }),

    })
});

function saveUser(response:IAuthResponse, dispatch:ThunkDispatch<any, any, AnyAction>){
    localStorage.setItem('token', response.accessToken);
    dispatch(userSlice.actions.setIsAuth(true));
    dispatch(userSlice.actions.setUser(response.user));
}

export const apiUser = Api.injectEndpoints({
    endpoints:(build)=>({
        checkAuth: build.query<IAuthResponse, unknown>({
            query:()=>({
                url:'/user/refresh',
                credentials:'include'
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const response= await queryFulfilled;
                    saveUser(response.data, dispatch);
                    
                } catch (e) {
                    console.error("Refresh error " + e);
                }
            },
        })

    })
})

