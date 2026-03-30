import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { loginThunk, fetchUserThunk, updateUserThunk, logoutThunk } from './authThunk';
import { User } from '../../../shared/models/user';

jest.mock('../../../shared/services/api-service');
jest.mock('../../../shared/services/token-service');
jest.mock('../../profile/services/profileDbService');

import { apiService } from '../../../shared/services/api-service';
import { saveToken, clearToken } from '../../../shared/services/token-service';
import { saveUserProfile, updateUserProfile, clearUserProfile } from '../../profile/services/profileDbService';

const mockApiService = apiService as jest.Mocked<typeof apiService>;
const mockSaveToken = saveToken as jest.MockedFunction<typeof saveToken>;
const mockClearToken = clearToken as jest.MockedFunction<typeof clearToken>;
const mockSaveUserProfile = saveUserProfile as jest.MockedFunction<typeof saveUserProfile>;
const mockUpdateUserProfile = updateUserProfile as jest.MockedFunction<typeof updateUserProfile>;
const mockClearUserProfile = clearUserProfile as jest.MockedFunction<typeof clearUserProfile>;

const mockUser: User = {
    username: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    age: 28,
    role: 'user',
};

const createStore = () => configureStore({ reducer: { auth: authReducer } });

beforeEach(() => {
    jest.clearAllMocks();
});

describe('loginThunk', () => {
    it('fulfilled: calls API, saveToken, saveUserProfile and returns user', async () => {
        mockApiService.login.mockResolvedValue({ data: { data: { user: mockUser, token: 'token123' } } } as any);
        mockSaveToken.mockResolvedValue();
        mockSaveUserProfile.mockResolvedValue();

        const store = createStore();
        const result = await store.dispatch(loginThunk({ username: 'johndoe', password: 'pass' }));

        expect(loginThunk.fulfilled.match(result)).toBe(true);
        expect(mockSaveToken).toHaveBeenCalledWith('token123');
        expect(mockSaveUserProfile).toHaveBeenCalledWith(mockUser);
        expect(store.getState().auth.user).toEqual(mockUser);
        expect(store.getState().auth.loading).toBe(false);
    });

    it('rejected: API failure returns error message', async () => {
        mockApiService.login.mockRejectedValue({
            response: { data: { error: { message: 'Invalid credentials' } } },
        });

        const store = createStore();
        const result = await store.dispatch(loginThunk({ username: 'bad', password: 'bad' }));

        expect(loginThunk.rejected.match(result)).toBe(true);
        expect(result.payload).toBe('Invalid credentials');
        expect(store.getState().auth.error).toBe('Invalid credentials');
        expect(mockSaveToken).not.toHaveBeenCalled();
        expect(mockSaveUserProfile).not.toHaveBeenCalled();
    });

    it('rejected: uses fallback message when no response available', async () => {
        mockApiService.login.mockRejectedValue(new Error('Network error'));

        const store = createStore();
        const result = await store.dispatch(loginThunk({ username: 'johndoe', password: 'pass' }));

        expect(result.payload).toBe('Login failed');
    });
});

describe('fetchUserThunk', () => {
    it('fulfilled: calls getUser, saveUserProfile and updates Redux', async () => {
        mockApiService.getUser.mockResolvedValue({ data: { data: mockUser } } as any);
        mockSaveUserProfile.mockResolvedValue();

        const store = createStore();
        const result = await store.dispatch(fetchUserThunk());

        expect(fetchUserThunk.fulfilled.match(result)).toBe(true);
        expect(mockSaveUserProfile).toHaveBeenCalledWith(mockUser);
        expect(store.getState().auth.user).toEqual(mockUser);
    });

    it('rejected: API failure returns error', async () => {
        mockApiService.getUser.mockRejectedValue({
            response: { data: { error: { message: 'Unauthorized' } } },
        });

        const store = createStore();
        const result = await store.dispatch(fetchUserThunk());

        expect(fetchUserThunk.rejected.match(result)).toBe(true);
        expect(result.payload).toBe('Unauthorized');
    });
});

describe('updateUserThunk', () => {
    it('fulfilled: calls updateUser API, updateUserProfile and updates Redux', async () => {
        const updatedUser: User = { ...mockUser, firstName: 'Jane', age: 30 };
        mockApiService.updateUser.mockResolvedValue({ data: { data: updatedUser } } as any);
        mockUpdateUserProfile.mockResolvedValue();

        const store = createStore();
        const result = await store.dispatch(updateUserThunk({ firstName: 'Jane', lastName: 'Doe', age: 30 }));

        expect(updateUserThunk.fulfilled.match(result)).toBe(true);
        expect(mockApiService.updateUser).toHaveBeenCalledWith({ firstName: 'Jane', lastName: 'Doe', age: 30 });
        expect(mockUpdateUserProfile).toHaveBeenCalledWith({ firstName: 'Jane', lastName: 'Doe', age: 30 });
        expect(store.getState().auth.user?.firstName).toBe('Jane');
        expect(store.getState().auth.updating).toBe(false);
    });

    it('rejected: API failure does not call updateUserProfile', async () => {
        mockApiService.updateUser.mockRejectedValue({
            response: { data: { error: { message: 'Update failed' } } },
        });

        const store = createStore();
        const result = await store.dispatch(updateUserThunk({ firstName: 'Jane', lastName: 'Doe', age: 30 }));

        expect(updateUserThunk.rejected.match(result)).toBe(true);
        expect(mockUpdateUserProfile).not.toHaveBeenCalled();
        expect(store.getState().auth.error).toBe('Update failed');
    });
});

describe('logoutThunk', () => {
    it('fulfilled: calls logout API, clearToken, clearUserProfile', async () => {
        mockApiService.logout.mockResolvedValue({} as any);
        mockClearToken.mockResolvedValue();
        mockClearUserProfile.mockResolvedValue();

        const store = createStore();
        const result = await store.dispatch(logoutThunk());

        expect(logoutThunk.fulfilled.match(result)).toBe(true);
        expect(mockClearToken).toHaveBeenCalled();
        expect(mockClearUserProfile).toHaveBeenCalled();
        expect(store.getState().auth.user).toBeNull();
    });

    it('rejected: API failure still calls clearToken and clearUserProfile', async () => {
        mockApiService.logout.mockRejectedValue(new Error('Server error'));
        mockClearToken.mockResolvedValue();
        mockClearUserProfile.mockResolvedValue();

        const store = createStore();
        const result = await store.dispatch(logoutThunk());

        expect(logoutThunk.rejected.match(result)).toBe(true);
        expect(mockClearToken).toHaveBeenCalled();
        expect(mockClearUserProfile).toHaveBeenCalled();
        expect(store.getState().auth.user).toBeNull();
    });
});
