import { IDevice } from '../../models/IDevice';
import { PayloadAction, createSlice, createSelector} from '@reduxjs/toolkit'
import { RootState } from '../store';

interface IDeviceInitialState{
    page?:number,
    typeId?:number | null,
    brandId?:number | null,
    limit?:number,
    count?:number
}
const initialState:IDeviceInitialState = {
    page:1,
    limit:6,
    count:5
}

export const deviceSlice = createSlice({
    name:'devices',
    initialState,
    reducers:{
        setPage(state, action:PayloadAction<number>) {
            state.page = action.payload
        },
        setLimit(state, action:PayloadAction<number>) {
            state.limit = action.payload
        },
        setSelectedType(state, action:PayloadAction<number | null>) {
            state.typeId = action.payload
        },
        setSelectedBrand(state, action:PayloadAction<number | null>) {
            state.brandId= action.payload
        },
        setCount(state, action:PayloadAction<number>) {
            state.count= action.payload
        }
        
    }
})

export const pageCountSelector = createSelector(
    (state:RootState):number|undefined=>state.DeviceReducer.count,
    (state:RootState):number|undefined=>state.DeviceReducer.limit,
    (allCount = 5, limit = 5)=>{
        return Math.ceil(allCount/limit)
    }
);


export default deviceSlice.reducer;
