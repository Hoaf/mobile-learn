import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProductStackParamList } from '../../../shared/types/navigation';

const productImages = [
    require('../../../shared/assets/images/sample1.png'),
    require('../../../shared/assets/images/sample2.png'),
    require('../../../shared/assets/images/sample3.png'),
    require('../../../shared/assets/images/sample4.png'),
    require('../../../shared/assets/images/sample5.png'),
];

const FEATURES = [
    { icon: '🔋', label: 'Battery', value: '48 Hours' },
    { icon: '📶', label: 'Sync', value: 'Bluetooth 5.2' },
    { icon: '💧', label: 'Water', value: '5ATM Resist' },
    { icon: '✅', label: 'Warranty', value: '12 Months' },
];

const REVIEWS = [
    { name: 'Jane Doe', time: '2 days ago', rating: 4, text: 'Absolutely love this watch! The battery life is impressive and the sleep tracking is very accurate.' },
    { name: 'Mark Smith', time: '1 week ago', rating: 5, text: "The best smartwatch I've owned so far. Highly recommended for the price." },
];

type Props = NativeStackScreenProps<ProductStackParamList, 'ProductDetail'>;

const Stars: React.FC<{ count: number }> = ({ count }) => (
    <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(i => (
            <Text key={i} style={i <= count ? styles.starFilled : styles.starEmpty}>★</Text>
        ))}
    </View>
);

const ProductDetailScreen: React.FC<Props> = ({ route }) => {
    const { product } = route.params;
    const [expanded, setExpanded] = useState(false);
    const image = productImages[product.id % productImages.length];
    const originalPrice = Math.round(product.price * 1.17);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Image */}
                <View style={styles.imageContainer}>
                    <Image source={image} style={styles.image} resizeMode="cover" />
                    <View style={styles.dots}>
                        {[0, 1, 2].map(i => (
                            <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
                        ))}
                    </View>
                </View>

                {/* Product Info */}
                <View style={styles.body}>
                    <View style={styles.infoRow}>
                        <View style={styles.flex1}>
                            <Text style={styles.inStock}>IN STOCK</Text>
                            <Text style={styles.name}>{product.name}</Text>
                            <View style={styles.ratingRow}>
                                <Stars count={4} />
                                <Text style={styles.reviews}>(128 Reviews)</Text>
                            </View>
                            <View style={styles.priceRow}>
                                <Text style={styles.price}>${product.price}.00</Text>
                                <Text style={styles.originalPrice}>${originalPrice}.00</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.heartBtn}>
                            <Text style={styles.heartIcon}>♡</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Key Features */}
                    <Text style={styles.sectionTitle}>Key Features</Text>
                    <View style={styles.featuresGrid}>
                        {FEATURES.map(f => (
                            <View key={f.label} style={styles.featureCard}>
                                <Text style={styles.featureIcon}>{f.icon}</Text>
                                <Text style={styles.featureLabel}>{f.label}</Text>
                                <Text style={styles.featureValue}>{f.value}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Product Description */}
                    <Text style={styles.sectionTitle}>Product Description</Text>
                    <Text style={styles.description} numberOfLines={expanded ? undefined : 4}>
                        {product.description}
                    </Text>
                    <TouchableOpacity onPress={() => setExpanded(v => !v)}>
                        <Text style={styles.readMore}>{expanded ? 'Show less...' : 'Read more...'}</Text>
                    </TouchableOpacity>

                    {/* User Reviews */}
                    <View style={styles.reviewsHeader}>
                        <Text style={styles.sectionTitle}>User Reviews</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    {REVIEWS.map(r => (
                        <View key={r.name} style={styles.reviewCard}>
                            <View style={styles.reviewAvatar}>
                                <Text style={styles.reviewAvatarText}>{r.name[0]}</Text>
                            </View>
                            <View style={styles.flex1}>
                                <View style={styles.reviewTopRow}>
                                    <Text style={styles.reviewName}>{r.name}</Text>
                                    <Text style={styles.reviewTime}>{r.time}</Text>
                                </View>
                                <Stars count={r.rating} />
                                <Text style={styles.reviewText}>{r.text}</Text>
                            </View>
                        </View>
                    ))}

                    <View style={styles.bottomSpacer} />
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.addToCartBtn}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyNowBtn}>
                    <Text style={styles.buyNowText}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1 },
    imageContainer: { backgroundColor: '#1A1A2E' },
    image: { width: '100%', height: 280 },
    dots: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, gap: 6 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
    dotActive: { backgroundColor: '#00BCD4', width: 20 },
    body: { padding: 16 },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
    flex1: { flex: 1 },
    inStock: { fontSize: 11, fontWeight: '700', color: '#00BCD4', letterSpacing: 1, marginBottom: 4 },
    name: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginBottom: 6, lineHeight: 28 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    starsRow: { flexDirection: 'row', marginRight: 6 },
    starFilled: { fontSize: 14, color: '#FFC107' },
    starEmpty: { fontSize: 14, color: '#E0E0E0' },
    reviews: { fontSize: 12, color: '#9E9E9E' },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    price: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
    originalPrice: { fontSize: 16, color: '#BDBDBD', textDecorationLine: 'line-through' },
    heartBtn: { padding: 4 },
    heartIcon: { fontSize: 24, color: '#9E9E9E' },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
    featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    featureCard: {
        width: '47%', backgroundColor: '#F5FEFF', borderRadius: 12,
        padding: 12, borderWidth: 1, borderColor: '#E0F7FA',
    },
    featureIcon: { fontSize: 20, marginBottom: 4 },
    featureLabel: { fontSize: 11, color: '#9E9E9E', marginBottom: 2 },
    featureValue: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
    description: { fontSize: 14, color: '#616161', lineHeight: 22, marginBottom: 6 },
    readMore: { fontSize: 13, color: '#00BCD4', fontWeight: '600', marginBottom: 20 },
    reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    seeAll: { fontSize: 13, color: '#00BCD4', fontWeight: '600' },
    reviewCard: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    reviewAvatar: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#E0F7FA', alignItems: 'center', justifyContent: 'center',
    },
    reviewAvatarText: { fontSize: 16, fontWeight: '700', color: '#00BCD4' },
    reviewTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    reviewName: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
    reviewTime: { fontSize: 12, color: '#BDBDBD' },
    reviewText: { fontSize: 13, color: '#616161', lineHeight: 20, marginTop: 4 },
    bottomSpacer: { height: 16 },
    bottomBar: {
        flexDirection: 'row', gap: 12, padding: 16,
        borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: '#fff',
    },
    addToCartBtn: {
        flex: 1, paddingVertical: 14, borderRadius: 12,
        borderWidth: 1.5, borderColor: '#00BCD4', alignItems: 'center',
    },
    addToCartText: { fontSize: 15, fontWeight: '700', color: '#00BCD4' },
    buyNowBtn: {
        flex: 1, paddingVertical: 14, borderRadius: 12,
        backgroundColor: '#00BCD4', alignItems: 'center',
    },
    buyNowText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

export default ProductDetailScreen;
