import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/store/store';
import { setUser } from './src/features/auth/store/authSlice';
import { getUserProfile } from './src/features/profile/services/profileDbService';
import { getToken } from './src/shared/services/token-service';
import LoginScreen from './src/features/auth/LoginScreen';
import { HomeTabsNavigator } from './src/features/home/navigation/HomeTabsNavigator';
import { RootStackParamList } from './src/shared/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    useEffect(() => {
        const restoreSession = async () => {
            const token = await getToken();
            if (!token) return;
            const user = await getUserProfile();
            if (user) {
                store.dispatch(setUser(user));
            }
        };
        restoreSession();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="HomeTabs"
                    component={HomeTabsNavigator}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const App = () => (
    <Provider store={store}>
        <AppNavigator />
    </Provider>
);

export default App;
