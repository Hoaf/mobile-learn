import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/authSlice';
import LoginScreen from './LoginScreen';
import { loginThunk } from './store/authThunk';

jest.mock('./store/authThunk', () => ({
    loginThunk: Object.assign(
        jest.fn(() => () => Promise.resolve({ type: 'auth/login/fulfilled', payload: { user: mockUser, token: 'token' } })),
        {
            pending:   { type: 'auth/login/pending',   match: (a: { type: string }) => a.type === 'auth/login/pending' },
            fulfilled: { type: 'auth/login/fulfilled', match: (a: { type: string }) => a.type === 'auth/login/fulfilled' },
            rejected:  { type: 'auth/login/rejected',  match: (a: { type: string }) => a.type === 'auth/login/rejected' },
        },
    ),
    fetchUserThunk: Object.assign(jest.fn(), {
        fulfilled: { type: 'auth/fetchUser/fulfilled', match: (a: { type: string }) => a.type === 'auth/fetchUser/fulfilled' },
    }),
    updateUserThunk: Object.assign(jest.fn(), {
        pending:   { type: 'auth/updateUser/pending',   match: (a: { type: string }) => a.type === 'auth/updateUser/pending' },
        fulfilled: { type: 'auth/updateUser/fulfilled', match: (a: { type: string }) => a.type === 'auth/updateUser/fulfilled' },
        rejected:  { type: 'auth/updateUser/rejected',  match: (a: { type: string }) => a.type === 'auth/updateUser/rejected' },
    }),
    logoutThunk: Object.assign(jest.fn(), {
        fulfilled: { type: 'auth/logout/fulfilled', match: (a: { type: string }) => a.type === 'auth/logout/fulfilled' },
        rejected:  { type: 'auth/logout/rejected',  match: (a: { type: string }) => a.type === 'auth/logout/rejected' },
    }),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: jest.fn(),
}));

const mockUser = {
    username: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    age: 28,
    role: 'user',
};

const createStore = () => configureStore({ reducer: { auth: authReducer } });

const renderScreen = (store = createStore()) =>
    render(
        <Provider store={store}>
            <LoginScreen
                navigation={{ navigate: mockNavigate } as any}
                route={{} as any}
            />
        </Provider>,
    );

beforeEach(() => jest.clearAllMocks());

describe('LoginScreen', () => {
    it('renders main elements correctly', () => {
        const { getByText, getByPlaceholderText } = renderScreen();
        expect(getByText('Welcome Back')).toBeTruthy();
        expect(getByPlaceholderText('johndoe123')).toBeTruthy();
        expect(getByText('Sign In')).toBeTruthy();
    });

    it('password field has secureTextEntry enabled', () => {
        const { getByPlaceholderText } = renderScreen();
        const passwordInput = getByPlaceholderText('••••••••');
        expect(passwordInput.props.secureTextEntry).toBe(true);
    });

    it('does not dispatch when username is empty', async () => {
        const { getByText, getByPlaceholderText } = renderScreen();
        fireEvent.changeText(getByPlaceholderText('••••••••'), 'password');
        fireEvent.press(getByText('Sign In'));
        expect(loginThunk).not.toHaveBeenCalled();
    });

    it('does not dispatch when password is empty', async () => {
        const { getByText, getByPlaceholderText } = renderScreen();
        fireEvent.changeText(getByPlaceholderText('johndoe123'), 'johndoe');
        fireEvent.press(getByText('Sign In'));
        expect(loginThunk).not.toHaveBeenCalled();
    });

    it('dispatches loginThunk when username and password are provided', async () => {
        const { getByText, getByPlaceholderText } = renderScreen();
        fireEvent.changeText(getByPlaceholderText('johndoe123'), 'johndoe');
        fireEvent.changeText(getByPlaceholderText('••••••••'), 'password');
        fireEvent.press(getByText('Sign In'));
        await waitFor(() => expect(loginThunk).toHaveBeenCalledWith({ username: 'johndoe', password: 'password' }));
    });

    it('navigates to HomeTabs on successful login', async () => {
        const { getByText, getByPlaceholderText } = renderScreen();
        fireEvent.changeText(getByPlaceholderText('johndoe123'), 'johndoe');
        fireEvent.changeText(getByPlaceholderText('••••••••'), 'password');
        fireEvent.press(getByText('Sign In'));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('HomeTabs', { user: mockUser }));
    });

    it('shows loading indicator when state.auth.loading is true', () => {
        const store = createStore();
        store.dispatch({ type: 'auth/login/pending' });
        const { queryByText } = render(
            <Provider store={store}>
                <LoginScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
            </Provider>,
        );
        expect(queryByText('Sign In')).toBeNull();
    });
});
