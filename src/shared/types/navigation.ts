import { User } from '../models/user';
import { Product } from '../../features/products/models/product';

export type RootStackParamList = {
    Login: undefined;
    Products: { user: User };
    ProductDetail: { product: Product };
};
