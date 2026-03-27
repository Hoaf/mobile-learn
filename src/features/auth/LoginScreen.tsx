import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../shared/types/navigation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginThunk } from './store/authThunk';
import { styles } from './LoginScreen.styles';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(state => state.auth);

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter your username and password');
            return;
        }

        const result = await dispatch(loginThunk({ username, password }));
        if (loginThunk.fulfilled.match(result)) {
            navigation.navigate('HomeTabs', { user: result.payload.user });
        } else {
            Alert.alert('Error', (result.payload as string) ?? 'Login failed');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.iconText}>🛍️</Text>
                    </View>
                </View>

                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Please enter your details</Text>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'login' && styles.tabActive]}
                        onPress={() => setActiveTab('login')}
                    >
                        <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>
                            Login
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'signup' && styles.tabActive]}
                        onPress={() => setActiveTab('signup')}
                    >
                        <Text style={[styles.tabText, activeTab === 'signup' && styles.tabTextActive]}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="johndoe123"
                        placeholderTextColor="#BDBDBD"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor="#BDBDBD"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.forgotContainer}>
                        <Text style={styles.forgotText}>Forget Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.signInButton, loading && styles.signInButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                        accessibilityRole="button"
                        accessibilityLabel="Sign In"
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.signInButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.biometricsButton} accessibilityRole="button">
                        <Text style={styles.biometricsText}>⚡ Sign in with Biometrics</Text>
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Or continue with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.socialContainer}>
                        <TouchableOpacity
                            style={styles.socialButton}
                            accessibilityRole="button"
                            accessibilityLabel="Continue with Google"
                        >
                            <Text style={styles.socialIcon}>G</Text>
                            <Text style={styles.socialText}>Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.socialButton}
                            accessibilityRole="button"
                            accessibilityLabel="Continue with Facebook"
                        >
                            <Text style={[styles.socialIcon, styles.facebookIcon]}>f</Text>
                            <Text style={styles.socialText}>Facebook</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.footerText}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.footerLink}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.footerLink}>Privacy Policy</Text>
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};


export default LoginScreen;
