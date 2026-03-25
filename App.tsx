import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/features/auth/LoginScreen';
import ProductScreen from './src/features/products/screens/ProductScreen';
import ProductDetailScreen from './src/features/products/screens/ProductDetailScreen';
import { RootStackParamList } from './src/shared/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Products"
                    component={ProductScreen}
                    options={{ title: 'Products' }}
                />
                <Stack.Screen
                    name="ProductDetail"
                    component={ProductDetailScreen}
                    options={{ title: 'Product Detail' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
