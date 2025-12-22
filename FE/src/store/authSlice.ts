import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    user: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
        },
        updateAvatar: (state, action) => {
            if (state.user) {
                state.user.avatarUrl = action.payload;
            }
        },
    }
})

export const { loginSuccess, logout, updateAvatar } = authSlice.actions;
export default authSlice.reducer;