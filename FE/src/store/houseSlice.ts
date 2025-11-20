import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type HomeIdentifier = string | number | null;

interface HouseState {
    selectedHomeId: HomeIdentifier;
    macAddress: string | null; 
}

const initialState: HouseState = {
    selectedHomeId: null,
    macAddress: null,
};

const houseSlice = createSlice({
    name: "house",
    initialState,
    reducers: {
        selectHome: (state, action: PayloadAction<HomeIdentifier>) => {
            state.selectedHomeId = action.payload;
        },
        setMacAddress: (state, action: PayloadAction<string | null>) => {
            state.macAddress = action.payload;
        },
        setHomeInfo: (
            state,
            action: PayloadAction<{ id: HomeIdentifier; mac: string | null }>
        ) => {
            state.selectedHomeId = action.payload.id;
            state.macAddress = action.payload.mac;
        },
        clearHome: (state) => {
            state.selectedHomeId = null;
            state.macAddress = null;
        }
    },
});

export const { selectHome, setMacAddress, setHomeInfo, clearHome } =
    houseSlice.actions;

export default houseSlice.reducer;
