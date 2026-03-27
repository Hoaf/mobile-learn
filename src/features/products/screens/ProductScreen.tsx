import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { apiService } from '../../../shared/services/api-service';
import { Product } from '../models/product';
import { ProductStackParamList } from '../../../shared/types/navigation';
import { useAppSelector } from '../../../store/hooks';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All Items', 'Electronics', 'Fashion'];
const COLUMN_GAP = 12;

type ProductScreenProps = NativeStackScreenProps<ProductStackParamList, 'ProductList'>;

const ProductScreen: React.FC<ProductScreenProps> = ({ navigation }) => {
    const user = useAppSelector(state => state.auth.user);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Items');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiService.getProducts();
                setProducts(response.data.data);
            } catch {
                Alert.alert('Error', 'Could not get products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {user?.firstName} 👋</Text>
                    <Text style={styles.headerTitle}>Discover</Text>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products, brands..."
                    placeholderTextColor="#BDBDBD"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Category Chips */}
            <View style={styles.categoryRow}>
                {CATEGORIES.map(cat => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.chip, activeCategory === cat && styles.chipActive]}
                        onPress={() => setActiveCategory(cat)}
                    >
                        <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Product Grid */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#00BCD4" />
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <ProductCard
                            product={item}
                            onPress={product => navigation.navigate('ProductDetail', { product })}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>No products found</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#F5F5F5',
    },
    greeting: {
        fontSize: 13,
        color: '#9E9E9E',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1A1A1A',
    },
    categoryRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 8,
        marginBottom: 12,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    chipActive: {
        backgroundColor: '#00BCD4',
        borderColor: '#00BCD4',
    },
    chipText: {
        fontSize: 13,
        color: '#616161',
        fontWeight: '500',
    },
    chipTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: COLUMN_GAP,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#9E9E9E',
    },
});

export default ProductScreen;
