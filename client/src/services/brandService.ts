import { authApi, Api } from "./commonApi";
import { IBrand } from "../models/IType&IBrand";

export const authBrandApi = authApi.injectEndpoints({
    endpoints:(build)=>({
        createBrand: build.mutation<IBrand, Omit<IBrand, "id">>({
            query:(brand)=>({
                url:'/brand',
                method:'POST',
                body: brand
            }),
        }),
        deleteBrand: build.mutation<number, void>({
            query:(id)=>({
                url:'/brand',
                method:'DELETE',
                body: {id}
            }),
        }),

        updeteBrand: build.mutation<{id:number, newName:string}, void>({
            query:(brand)=>({
                url:'/brand',
                method:'PUT',
                body: brand
            }),
        }),


    })
})

export const brandApi = Api.injectEndpoints({
    endpoints:(build)=>({
       getBrands: build.query({
        query:()=>({
            url:'/brand',
        })
})})})