import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type HomeIdentifier = string | number | null; 

interface HouseState {
    selectedHomeId: HomeIdentifier; 
}

const initialState: HouseState = {
    selectedHomeId: null, 
}

const houseSlice = createSlice({
    name: 'house',
    initialState,
    reducers: {
        selectHome: (state, action: PayloadAction<HomeIdentifier>) => {
            state.selectedHomeId = action.payload;
        },
    }
})

export const { selectHome } = houseSlice.actions;
export default houseSlice.reducer;