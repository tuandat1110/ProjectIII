import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type HomeIdentifier = string | number | null;

interface HouseState {
    selectedHomeId: HomeIdentifier;
    houseName: string | null; 
}

const initialState: HouseState = {
    selectedHomeId: null,
    houseName: null,
};

const houseSlice = createSlice({
    name: "house",
    initialState,
    reducers: {
        selectHome: (state, action: PayloadAction<HomeIdentifier>) => {
            state.selectedHomeId = action.payload;
        },
        setHouseName: (state, action: PayloadAction<string | null>) => {
            state.houseName = action.payload;
        },
        setHomeInfo: (
            state,
            action: PayloadAction<{ id: HomeIdentifier; name: string | null }>
        ) => {
            state.selectedHomeId = action.payload.id;
            state.houseName = action.payload.name;
        },
        clearHome: (state) => {
            state.selectedHomeId = null;
            state.houseName = null;
        }
    },
});

export const { selectHome, setHouseName, setHomeInfo, clearHome } =
    houseSlice.actions;

export default houseSlice.reducer;
