import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../../shared/services/api-service';
import { saveToken, clearToken } from '../../../shared/services/token-service';
import { saveUserProfile, updateUserProfile, clearUserProfile } from '../../profile/services/profileDbService';
import { User } from '../../../shared/models/user';

interface LoginPayload {
    user: User;
    token: string;
}

export const loginThunk = createAsyncThunk<LoginPayload, { username: string; password: string }>(
    'auth/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const response = await apiService.login(username, password);
            const { user, token } = response.data.data;
            await saveToken(token);
            await saveUserProfile(user);
            return { user, token };
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error?.message ?? 'Login failed');
        }
    }
);

export const fetchUserThunk = createAsyncThunk<User>(
    'auth/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiService.getUser();
            const user: User = response.data.data;
            await saveUserProfile(user);
            return user;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error?.message ?? 'Fetch user failed');
        }
    }
);

export const updateUserThunk = createAsyncThunk<User, Pick<User, 'firstName' | 'lastName' | 'age'>>(
    'auth/updateUser',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiService.updateUser(data);
            const user: User = response.data.data;
            await updateUserProfile(data);
            return user;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error?.message ?? 'Update failed');
        }
    }
);

export const logoutThunk = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await apiService.logout();
            await clearToken();
            await clearUserProfile();
        } catch (error: any) {
            await clearToken();
            await clearUserProfile();
            return rejectWithValue(error?.response?.data?.error?.message ?? 'Logout failed');
        }
    }
);
