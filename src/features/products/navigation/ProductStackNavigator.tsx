import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HomeTabParamList, ProductStackParamList } from '../../../shared/types/navigation';
import ProductScreen from '../screens/ProductScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

type Props = BottomTabScreenProps<HomeTabParamList, 'Products'>;

const Stack = createNativeStackNavigator<ProductStackParamList>();

export const ProductStackNavigator: React.FC<Props> = ({ route }) => {
    const { user } = route.params;

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ProductList"
                component={ProductScreen}
                initialParams={{ user }}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={{ title: 'Product Detail' }}
            />
        </Stack.Navigator>
    );
};
