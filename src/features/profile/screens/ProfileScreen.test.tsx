import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setUser } from '../../auth/store/authSlice';
import { ProfileScreen } from './ProfileScreen';
import { User } from '../../../shared/models/user';

const mockUser: User = {
    username: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    age: 28,
    role: 'user',
};

const mockDispatchReset = jest.fn();
jest.mock('@react-navigation/native', () => ({
    CommonActions: { reset: jest.fn(() => 'RESET_ACTION') },
}));

jest.mock('../../auth/store/authThunk', () => ({
    loginThunk: Object.assign(
        jest.fn(),
        {
            pending:   { type: 'auth/login/pending',   match: (a: { type: string }) => a.type === 'auth/login/pending' },
            fulfilled: { type: 'auth/login/fulfilled', match: (a: { type: string }) => a.type === 'auth/login/fulfilled' },
            rejected:  { type: 'auth/login/rejected',  match: (a: { type: string }) => a.type === 'auth/login/rejected' },
        },
    ),
    fetchUserThunk: Object.assign(
        jest.fn(() => ({ type: 'auth/fetchUser/fulfilled', payload: mockUser })),
        { fulfilled: { type: 'auth/fetchUser/fulfilled', match: (a: { type: string }) => a.type === 'auth/fetchUser/fulfilled' } },
    ),
    updateUserThunk: Object.assign(
        jest.fn(() => ({ type: 'auth/updateUser/fulfilled', payload: mockUser })),
        {
            pending:   { type: 'auth/updateUser/pending',   match: (a: { type: string }) => a.type === 'auth/updateUser/pending' },
            fulfilled: { type: 'auth/updateUser/fulfilled', match: (a: { type: string }) => a.type === 'auth/updateUser/fulfilled' },
            rejected:  { type: 'auth/updateUser/rejected',  match: (a: { type: string }) => a.type === 'auth/updateUser/rejected' },
        },
    ),
    logoutThunk: Object.assign(
        jest.fn(() => ({ type: 'auth/logout/fulfilled' })),
        {
            fulfilled: { type: 'auth/logout/fulfilled', match: (a: { type: string }) => a.type === 'auth/logout/fulfilled' },
            rejected:  { type: 'auth/logout/rejected',  match: (a: { type: string }) => a.type === 'auth/logout/rejected' },
        },
    ),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

import { fetchUserThunk, updateUserThunk, logoutThunk } from '../../auth/store/authThunk';

const createStore = (user: User | null = mockUser) => {
    const store = configureStore({ reducer: { auth: authReducer } });
    if (user) store.dispatch(setUser(user));
    return store;
};

const renderScreen = (store = createStore()) =>
    render(
        <Provider store={store}>
            <ProfileScreen
                navigation={{ dispatch: mockDispatchReset } as any}
                route={{} as any}
            />
        </Provider>,
    );

beforeEach(() => jest.clearAllMocks());

describe('ProfileScreen', () => {
    it('displays user information', () => {
        const { getByText } = renderScreen();
        expect(getByText('John Doe')).toBeTruthy();
        expect(getByText('@johndoe')).toBeTruthy();
        expect(getByText('john@example.com')).toBeTruthy();
        expect(getByText('user')).toBeTruthy();
    });

    it('displays correct initials in avatar', () => {
        const { getByText } = renderScreen();
        expect(getByText('JD')).toBeTruthy();
    });

    it('dispatches fetchUserThunk on mount', () => {
        renderScreen();
        expect(fetchUserThunk).toHaveBeenCalled();
    });

    it('pressing Edit Details switches to edit mode with TextInputs', () => {
        const { getByText, getByLabelText } = renderScreen();
        fireEvent.press(getByText('Edit Details'));
        expect(getByLabelText('First Name')).toBeTruthy();
        expect(getByLabelText('Last Name')).toBeTruthy();
        expect(getByLabelText('Age')).toBeTruthy();
        expect(getByText('Save')).toBeTruthy();
        expect(getByText('Cancel')).toBeTruthy();
    });

    it('pressing Cancel reverts to view mode with original data', () => {
        const { getByText, queryByText } = renderScreen();
        fireEvent.press(getByText('Edit Details'));
        fireEvent.press(getByText('Cancel'));
        expect(queryByText('Save')).toBeNull();
        expect(getByText('Edit Details')).toBeTruthy();
    });

    it('pressing Save dispatches updateUserThunk with updated data', async () => {
        const { getByText, getByLabelText } = renderScreen();
        fireEvent.press(getByText('Edit Details'));
        fireEvent.changeText(getByLabelText('First Name'), 'Jane');
        fireEvent.changeText(getByLabelText('Last Name'), 'Smith');
        fireEvent.changeText(getByLabelText('Age'), '30');
        fireEvent.press(getByText('Save'));
        await waitFor(() =>
            expect(updateUserThunk).toHaveBeenCalledWith({ firstName: 'Jane', lastName: 'Smith', age: 30 }),
        );
    });

    it('Save with empty firstName does not dispatch', async () => {
        const { getByText, getByLabelText } = renderScreen();
        fireEvent.press(getByText('Edit Details'));
        fireEvent.changeText(getByLabelText('First Name'), '');
        fireEvent.press(getByText('Save'));
        await waitFor(() => expect(updateUserThunk).not.toHaveBeenCalled());
    });

    it('Save with non-numeric age does not dispatch', async () => {
        const { getByText, getByLabelText } = renderScreen();
        fireEvent.press(getByText('Edit Details'));
        fireEvent.changeText(getByLabelText('Age'), 'abc');
        fireEvent.press(getByText('Save'));
        await waitFor(() => expect(updateUserThunk).not.toHaveBeenCalled());
    });

    it('pressing Logout dispatches logoutThunk and navigates to Login', async () => {
        const { getByLabelText } = renderScreen();
        fireEvent.press(getByLabelText('Logout'));
        await waitFor(() => {
            expect(logoutThunk).toHaveBeenCalled();
            expect(mockDispatchReset).toHaveBeenCalled();
        });
    });
});
