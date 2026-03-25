import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../shared/types/navigation';
import sampleImage from '../../../shared/assets/images/sample.png';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC<Props> = ({ route }) => {
    const { product } = route.params;

    return (
        <ScrollView style={styles.container}>
            <Image source={sampleImage} style={styles.image} resizeMode="cover" />
            <View style={styles.body}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>{product.price} {product.priceUnit}</Text>
                <Text style={styles.descriptionLabel}>Description</Text>
                <Text style={styles.description}>{product.description}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 300,
    },
    body: {
        padding: 16,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2ecc71',
        marginBottom: 16,
    },
    descriptionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
});

export default ProductDetailScreen;
