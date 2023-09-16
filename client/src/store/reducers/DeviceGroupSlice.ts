import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface IDeviceGroupInitialState {
    favoritesDevicesID: number[],
    comparedDevicesID: number[],
    recentlyViewedID: number[],
    inBasketDevicesID: number[]
}

const initialState: IDeviceGroupInitialState = {
    favoritesDevicesID: [],
    comparedDevicesID: [],
    recentlyViewedID: [],
    inBasketDevicesID: []
}

export const deviceGroupSlice = createSlice({
    name: 'devicesGroup',
    initialState,
    reducers: {
        setFavoritesDevicesID(state, action: PayloadAction<number[]>) {
            state.favoritesDevicesID = action.payload;
        },
        setComparedDevicesID(state, action: PayloadAction<number[]>) {
            state.comparedDevicesID = action.payload;
        },
        setRecentlyViewedID(state, action: PayloadAction<number[]>) {
            state.recentlyViewedID = action.payload;
        },
        setInBasketDevicesID(state, action: PayloadAction<number[]>) {
            state.inBasketDevicesID = action.payload
        },

        addFavoritesDeviceID(state, action: PayloadAction<number>) {
            state.favoritesDevicesID.push(action.payload)
        },
        deleteFavoritesDeviceID(state, action: PayloadAction<number>) {
            state.favoritesDevicesID = state.favoritesDevicesID.filter(el => el !== action.payload);
        },

        addComparedDevicesID(state, action: PayloadAction<number>) {
            state.comparedDevicesID.push(action.payload)
        },
        deleteComparedDevicesID(state, action: PayloadAction<number>) {
            state.comparedDevicesID = state.comparedDevicesID.filter(el => el !== action.payload);
        },

        addInBasketDevicesID(state, action: PayloadAction<number>) {
            state.inBasketDevicesID.push(action.payload)
        },
        deleteInBasketDevicesID(state, action: PayloadAction<number>) {
            state.inBasketDevicesID = state.inBasketDevicesID.filter(el => el !== action.payload);
        },

        addRecentlyViewedID(state, action: PayloadAction<number>) {
            if (!state.recentlyViewedID.find(el => el === action.payload)) {
                if (state.recentlyViewedID.length >= 15) {
                    const arr= state.recentlyViewedID.filter((_, i)=> i !== 0)
                    arr.push(action.payload)
                    state.recentlyViewedID = arr;
                } else {
                    state.recentlyViewedID.push(action.payload)
                }
            }
        },
        saveGroups(state) {
            localStorage.setItem('favoritesDevicesID', JSON.stringify(state.favoritesDevicesID));
            localStorage.setItem('comparedDevicesID', JSON.stringify(state.comparedDevicesID));
            localStorage.setItem('recentlyViewedID', JSON.stringify(state.recentlyViewedID));
            localStorage.setItem('inBasketDevicesID', JSON.stringify(state.inBasketDevicesID));
        }
    }
})

export default deviceGroupSlice.reducer;