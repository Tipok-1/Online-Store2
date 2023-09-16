import { authApi, Api } from "./commonApi";
import { IDevice, IDeviceInfo } from "../models/IDevice";

/*export const authTypeApi = authApi.injectEndpoints({
    endpoints:(build)=>({
        createDevice: build.mutation<IDevice, Omit<IDevice, "id">>({
            query:(type)=>({
                url:'/device',
                method:'POST',
                body: type
            }),
        }),
})})*/
export interface deviceParams {
    typeId?: number | null,
    brandId?: string | null,
    page?: number,
    limit?: number,
    minPrice?: number,
    maxPrice?: number
    search?: string,
    IDs?: string
}

export interface IDeviceResponce {
    count: number,
    rows: IDevice[],
    maxPrice: number,
    minPrice: number
}
export const deviceApi = Api.injectEndpoints({
    endpoints: (build) => ({
        getDevices: build.query<IDeviceResponce, deviceParams>({
            query: (params) => ({
                url: '/device',
                params
            }),
            providesTags: (result) =>
                (result && result.rows)
                    ? [...result?.rows.map(({ id }) => ({ type: 'Device' as const, id })), 'Device']
                    : ['Device'],
        }),
        getOneDevice: build.query<IDevice & { info: IDeviceInfo[] }, number>({
            query: (id) => ({
                url: '/device' + '/' + id,
            }),
            providesTags: (result) => result ? [{ type: 'Device' as const, id: result.id }, 'Device'] : ['Device'],
        }),
    })
})