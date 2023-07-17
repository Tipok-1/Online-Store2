import { authApi, Api } from "./commonApi";
import { IType } from "../models/IType&IBrand";

export const authTypeApi = authApi.injectEndpoints({
    endpoints:(build)=>({
        createType: build.mutation<IType, Omit<IType, "id">>({
            query:(type)=>({
                url:'/type',
                method:'POST',
                body: type
            }),
        }),
        deleteType: build.mutation<number, void>({
            query:(id)=>({
                url:'/type',
                method:'DELETE',
                body: {id}
            }),
        }),

        updeteType: build.mutation<{id:number, newName:string}, void>({
            query:(type)=>({
                url:'/type',
                method:'PUT',
                body: type
            }),
        }),


    })
})

export const typeApi = Api.injectEndpoints({
    endpoints:(build)=>({
       getTypes: build.query({
        query:()=>({
            url:'/type',
        })
    })})})
