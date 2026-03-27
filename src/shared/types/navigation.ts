import { User } from '../models/user';
import { Product } from '../../features/products/models/product';

export type RootStackParamList = {
    Login: undefined;
    HomeTabs: { user: User };
};

export type HomeTabParamList = {
    Products: { user: User };
    Profile: { user: User };
};

export type ProductStackParamList = {
    ProductList: { user: User };
    ProductDetail: { product: Product };
};
