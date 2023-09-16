import { PayloadAction, createSlice, createSelector} from '@reduxjs/toolkit'
import { RootState } from '../store';

export interface IDeviceInitialState{
    page?:number,
    typeId?:number | null,
    brandId?:number[] | null,
    limit?:number,
    count?:number,
    maxPrice:number,//Текущее максимальное значение
    minPrice:number,//Текущее минимальное значение
    selectedMaxPrice?:number | null,//Выбранное максимальное значение
    selectedMinPrice?:number | null,//Выбранное минимальное значение
    search?:string
}
const initialState:IDeviceInitialState = {
    page:1,
    limit:6,
    count:5,
    brandId:[],
    maxPrice:0,
    minPrice:0,
    search:''
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
        setSelectedBrands(state, action:PayloadAction<number[] | null>) {
            state.brandId = action.payload;
        },
        addSelectedBrand(state, action:PayloadAction<number | null>) {
            if(action.payload)
                state.brandId?.push(action.payload);
        },
        removeSelectedBrand(state, action:PayloadAction<number>) {
            state.brandId = state.brandId?.filter(el=>el!==action.payload);
        },
        setCount(state, action:PayloadAction<number>) {
            state.count= action.payload
        },
        setMinPrice(state, action:PayloadAction<number>) {
            state.minPrice= action.payload
        },
        setMaxPrice(state, action:PayloadAction<number>) {
            state.maxPrice= action.payload
        },
        setSelectedMinPrice(state, action:PayloadAction<number | null>) {
            state.selectedMinPrice= action.payload
        },
        setSelectedMaxPrice(state, action:PayloadAction< number| null>) {
            state.selectedMaxPrice= action.payload
        },
        setSearch(state, action:PayloadAction<string>){
            state.search = action.payload;
        },
        categorySelected(state) {
            state.page = 1;
            state.minPrice = 0;
            state.maxPrice = 0;
            state.selectedMaxPrice = null;
            state.selectedMinPrice = null;
        },
        reset(state){
            state.page = 1
            state.limit = 6
            state.count = 5
            state.brandId = []
            state.typeId = null
            state.maxPrice = 0
            state.minPrice = 0
            state.selectedMaxPrice = null;
            state.selectedMinPrice = null;
            state.search = ''
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
