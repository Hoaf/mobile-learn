import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Product } from '../models/product';
import sampleImage from '../../../shared/assets/images/sample.png';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 12;
const PADDING = 16;
export const CARD_WIDTH = (width - PADDING * 2 - COLUMN_GAP) / 2;

interface ProductCardProps {
    product: Product;
    onPress: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product)}>
        <Image source={sampleImage} style={styles.image} resizeMode="cover" />
        <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
            <Text style={styles.price}>{product.price} {product.priceUnit}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    image: {
        width: '100%',
        height: CARD_WIDTH,
    },
    info: {
        padding: 10,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#222',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2ecc71',
    },
});

export default ProductCard;
