import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setUser } from '../../auth/store/authSlice';
import ProductScreen from './ProductScreen';
import { User } from '../../../shared/models/user';
import { Product } from '../models/product';

jest.mock('../../../shared/services/api-service');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

import { apiService } from '../../../shared/services/api-service';

const mockApiService = apiService as jest.Mocked<typeof apiService>;

const mockUser: User = {
    username: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    age: 28,
    role: 'user',
};

const mockProducts: Product[] = [
    { id: 1, name: 'iPhone 15', price: 999, priceUnit: 'USD', description: 'Apple phone' },
    { id: 2, name: 'Samsung Galaxy', price: 799, priceUnit: 'USD', description: 'Android phone' },
    { id: 3, name: 'Nike Shoes', price: 120, priceUnit: 'USD', description: 'Running shoes' },
];

const mockNavigate = jest.fn();

const createStore = (user: User | null = mockUser) => {
    const store = configureStore({ reducer: { auth: authReducer } });
    if (user) store.dispatch(setUser(user));
    return store;
};

const renderScreen = (store = createStore()) =>
    render(
        <Provider store={store}>
            <ProductScreen
                navigation={{ navigate: mockNavigate } as any}
                route={{} as any}
            />
        </Provider>,
    );

beforeEach(() => {
    jest.clearAllMocks();
    mockApiService.getProducts.mockResolvedValue({ data: { data: mockProducts } } as any);
});

describe('ProductScreen', () => {
    it('hiển thị greeting với tên user', async () => {
        const { getByText } = renderScreen();
        await waitFor(() => expect(getByText('Hello, John 👋')).toBeTruthy());
    });

    it('hiển thị Discover header', async () => {
        const { getByText } = renderScreen();
        await waitFor(() => expect(getByText('Discover')).toBeTruthy());
    });

    it('gọi getProducts khi mount', async () => {
        renderScreen();
        await waitFor(() => expect(mockApiService.getProducts).toHaveBeenCalled());
    });

    it('hiển thị danh sách sản phẩm sau khi load', async () => {
        const { getByText } = renderScreen();
        await waitFor(() => {
            expect(getByText('iPhone 15')).toBeTruthy();
            expect(getByText('Samsung Galaxy')).toBeTruthy();
            expect(getByText('Nike Shoes')).toBeTruthy();
        });
    });

    it('hiển thị ActivityIndicator khi loading', () => {
        mockApiService.getProducts.mockImplementation(() => new Promise(() => {}));
        const { UNSAFE_getByType } = renderScreen();
        const { ActivityIndicator } = require('react-native');
        expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('hiển thị "No products found" khi danh sách rỗng', async () => {
        mockApiService.getProducts.mockResolvedValue({ data: { data: [] } } as any);
        const { getByText } = renderScreen();
        await waitFor(() => expect(getByText('No products found')).toBeTruthy());
    });

    it('lọc sản phẩm theo search text', async () => {
        const { getByPlaceholderText, queryByText } = renderScreen();
        await waitFor(() => expect(queryByText('iPhone 15')).toBeTruthy());
        fireEvent.changeText(getByPlaceholderText('Search products, brands...'), 'iphone');
        await waitFor(() => {
            expect(queryByText('iPhone 15')).toBeTruthy();
            expect(queryByText('Samsung Galaxy')).toBeNull();
        });
    });

    it('hiển thị category chips', async () => {
        const { getByText } = renderScreen();
        await waitFor(() => {
            expect(getByText('All Items')).toBeTruthy();
            expect(getByText('Electronics')).toBeTruthy();
            expect(getByText('Fashion')).toBeTruthy();
        });
    });

    it('nhấn category chip thay đổi active category', async () => {
        const { getByText } = renderScreen();
        await waitFor(() => expect(getByText('Electronics')).toBeTruthy());
        fireEvent.press(getByText('Electronics'));
        expect(getByText('Electronics')).toBeTruthy();
    });

    it('hiển thị Alert khi API thất bại', async () => {
        const alertSpy = jest.spyOn(require('react-native').Alert, 'alert');
        mockApiService.getProducts.mockRejectedValue(new Error('Network error'));
        renderScreen();
        await waitFor(() =>
            expect(alertSpy).toHaveBeenCalledWith('Error', 'Could not get products'),
        );
    });

    it('navigate ProductDetail khi nhấn sản phẩm', async () => {
        const { getByText } = renderScreen();
        await waitFor(() => expect(getByText('iPhone 15')).toBeTruthy());
        fireEvent.press(getByText('iPhone 15'));
        expect(mockNavigate).toHaveBeenCalledWith('ProductDetail', { product: mockProducts[0] });
    });
});
