import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError 
   } from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
//import type { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { IAuthResponse } from '../models/response/AuthResponse'



const mutex = new Mutex()
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL + '/api',
    prepareHeaders: (headers, { getState }) => {
        //headers.set('Access-Control-Allow-Origin', '*')
        headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        return headers
    },
    credentials: "include"
});

const baseQueryWithReauth: BaseQueryFn<
string | FetchArgs,
unknown, //{ signal, dispatch, getState }
FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        //const refreshResult: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
        const refreshResult= await baseQuery(
          '/user/refresh',
          api,
          extraOptions
        )
          const data:IAuthResponse = refreshResult.data as IAuthResponse;
        
        if (refreshResult.data) {
          console.log('Всё норм')
          if(data.accessToken){
            localStorage.setItem('token', data.accessToken);
          }
          result = await baseQuery(args, api, extraOptions)
        } else {
          console.log('Пользователь не авторизован');

        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth,
    endpoints: _ => ({}),
})

export const Api = createApi({
    reducerPath: 'api',
    tagTypes: ['Device', 'Review'],
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_URL + '/api'}),
    endpoints: _ => ({}),
})