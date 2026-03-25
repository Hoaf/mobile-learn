import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { apiService, clearAuthToken } from '../../../shared/services/api-service';
import { User } from '../../../shared/models/user';
import { Product } from '../models/product';
import ProductCard from '../components/ProductCard';

const COLUMN_GAP = 12;

interface ProductScreenProps {
    navigation: any;
    route: {
        params: {
            user: User;
        };
    };
}

const ProductScreen: React.FC<ProductScreenProps> = ({ route, navigation }) => {
    const { user } = route.params;

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        clearAuthToken();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => null,
            headerBackVisible: false,
            headerRight: () => (
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logoutButton}>Logout</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiService.getProducts();
                setProducts(response.data.data);
            } catch (error: any) {
                Alert.alert('Error', 'Could not get products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2ecc71" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Welcome, {user.firstName} {user.lastName}!</Text>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <ProductCard
                        product={item}
                        onPress={(product) => navigation.navigate('ProductDetail', { product })}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcome: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#222',
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: COLUMN_GAP,
    },
    logoutButton: {
        fontSize: 16,
        color: '#e74c3c',
        fontWeight: '600',
    },
});

export default ProductScreen;
