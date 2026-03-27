import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../shared/models/user';
import { loginThunk, logoutThunk, fetchUserThunk, updateUserThunk } from './authThunk';

interface AuthState {
    user: User | null;
    loading: boolean;
    updating: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    updating: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            // login
            .addCase(loginThunk.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchUser
            .addCase(fetchUserThunk.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            // updateUser
            .addCase(updateUserThunk.pending, state => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateUserThunk.fulfilled, (state, action) => {
                state.updating = false;
                state.user = action.payload;
            })
            .addCase(updateUserThunk.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload as string;
            })
            // logout
            .addCase(logoutThunk.fulfilled, state => {
                state.user = null;
                state.error = null;
            })
            .addCase(logoutThunk.rejected, state => {
                state.user = null;
                state.error = null;
            });
    },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
