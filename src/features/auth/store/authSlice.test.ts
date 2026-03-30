import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setUser, clearError } from './authSlice';
import { User } from '../../../shared/models/user';

jest.mock('./authThunk', () => ({
    loginThunk: Object.assign(
        jest.fn(),
        {
            pending:   { type: 'auth/login/pending',   match: (a: { type: string }) => a.type === 'auth/login/pending' },
            fulfilled: { type: 'auth/login/fulfilled', match: (a: { type: string }) => a.type === 'auth/login/fulfilled' },
            rejected:  { type: 'auth/login/rejected',  match: (a: { type: string }) => a.type === 'auth/login/rejected' },
        }
    ),
    logoutThunk: Object.assign(
        jest.fn(),
        {
            fulfilled: { type: 'auth/logout/fulfilled', match: (a: { type: string }) => a.type === 'auth/logout/fulfilled' },
            rejected:  { type: 'auth/logout/rejected',  match: (a: { type: string }) => a.type === 'auth/logout/rejected' },
        }
    ),
    fetchUserThunk: Object.assign(
        jest.fn(),
        {
            fulfilled: { type: 'auth/fetchUser/fulfilled', match: (a: { type: string }) => a.type === 'auth/fetchUser/fulfilled' },
        }
    ),
    updateUserThunk: Object.assign(
        jest.fn(),
        {
            pending:   { type: 'auth/updateUser/pending',   match: (a: { type: string }) => a.type === 'auth/updateUser/pending' },
            fulfilled: { type: 'auth/updateUser/fulfilled', match: (a: { type: string }) => a.type === 'auth/updateUser/fulfilled' },
            rejected:  { type: 'auth/updateUser/rejected',  match: (a: { type: string }) => a.type === 'auth/updateUser/rejected' },
        }
    ),
}));

const mockUser: User = {
    username: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    age: 28,
    role: 'user',
};
const createStore = () => configureStore({ reducer: { auth: authReducer } });

const dispatch = (store: ReturnType<typeof createStore>, type: string, payload?: unknown) =>
    store.dispatch({ type, payload });

describe('authSlice', () => {

    describe('initial state', () => {
        it('should have correct initial state', () => {
            const store = createStore();
            expect(store.getState().auth).toEqual({
                user: null,
                loading: false,
                updating: false,
                error: null,
            });
        });
    });

    describe('setUser', () => {
        it('should set user in state', () => {
            const store = createStore();
            store.dispatch(setUser(mockUser));
            expect(store.getState().auth.user).toEqual(mockUser);
        });
    });

    describe('clearError', () => {
        it('should clear error', () => {
            const store = createStore();
            dispatch(store, 'auth/login/rejected', 'Some error');
            expect(store.getState().auth.error).toBe('Some error');

            store.dispatch(clearError());
            expect(store.getState().auth.error).toBeNull();
        });
    });

    describe('loginThunk', () => {
        it('pending: sets loading=true and error=null', () => {
            const store = createStore();
            dispatch(store, 'auth/login/pending');
            const { loading, error } = store.getState().auth;
            expect(loading).toBe(true);
            expect(error).toBeNull();
        });

        it('fulfilled: sets user and loading=false', () => {
            const store = createStore();
            dispatch(store, 'auth/login/fulfilled', { user: mockUser, token: 'abc123' });
            const { user, loading } = store.getState().auth;
            expect(user).toEqual(mockUser);
            expect(loading).toBe(false);
        });

        it('rejected: sets error and loading=false', () => {
            const store = createStore();
            dispatch(store, 'auth/login/rejected', 'Invalid credentials');
            const { error, loading } = store.getState().auth;
            expect(error).toBe('Invalid credentials');
            expect(loading).toBe(false);
        });

        it('pending then fulfilled: resets loading to false', () => {
            const store = createStore();
            dispatch(store, 'auth/login/pending');
            expect(store.getState().auth.loading).toBe(true);
            dispatch(store, 'auth/login/fulfilled', { user: mockUser, token: 'abc' });
            expect(store.getState().auth.loading).toBe(false);
        });
    });

    describe('fetchUserThunk', () => {
        it('fulfilled: updates user with latest data', () => {
            const store = createStore();
            store.dispatch(setUser(mockUser));

            const updatedUser: User = { ...mockUser, firstName: 'Jane' };
            dispatch(store, 'auth/fetchUser/fulfilled', updatedUser);

            expect(store.getState().auth.user?.firstName).toBe('Jane');
        });
    });

    describe('updateUserThunk', () => {
        it('pending: sets updating=true and error=null', () => {
            const store = createStore();
            dispatch(store, 'auth/updateUser/pending');
            expect(store.getState().auth.updating).toBe(true);
            expect(store.getState().auth.error).toBeNull();
        });

        it('fulfilled: updates user and sets updating=false', () => {
            const store = createStore();
            store.dispatch(setUser(mockUser));
            const updatedUser: User = { ...mockUser, lastName: 'Smith', age: 30 };
            dispatch(store, 'auth/updateUser/fulfilled', updatedUser);
            const { user, updating } = store.getState().auth;
            expect(user?.lastName).toBe('Smith');
            expect(user?.age).toBe(30);
            expect(updating).toBe(false);
        });

        it('rejected: sets error, updating=false, user unchanged', () => {
            const store = createStore();
            store.dispatch(setUser(mockUser));
            dispatch(store, 'auth/updateUser/rejected', 'Update failed');
            const { error, updating, user } = store.getState().auth;
            expect(error).toBe('Update failed');
            expect(updating).toBe(false);
            expect(user).toEqual(mockUser);
        });
    });

    describe('logoutThunk', () => {
        it('fulfilled: clears user and error', () => {
            const store = createStore();
            store.dispatch(setUser(mockUser));
            dispatch(store, 'auth/logout/fulfilled');
            expect(store.getState().auth.user).toBeNull();
            expect(store.getState().auth.error).toBeNull();
        });

        it('rejected: still clears user even if API fails', () => {
            const store = createStore();
            store.dispatch(setUser(mockUser));
            dispatch(store, 'auth/logout/rejected');
            expect(store.getState().auth.user).toBeNull();
        });
    });
});
