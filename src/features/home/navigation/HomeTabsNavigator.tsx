import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HomeTabParamList, RootStackParamList } from '../../../shared/types/navigation';
import { ProductStackNavigator } from '../../products/navigation/ProductStackNavigator';
import { ProfileScreen } from '../../profile/screens/ProfileScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeTabs'>;

const Tab = createBottomTabNavigator<HomeTabParamList>();

export const HomeTabsNavigator: React.FC<Props> = ({ route }) => {
    const { user } = route.params;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#00BCD4',
                tabBarInactiveTintColor: '#9E9E9E',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#F0F0F0',
                    backgroundColor: '#FFFFFF',
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen
                name="Products"
                component={ProductStackNavigator}
                initialParams={{ user }}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                initialParams={{ user }}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name={focused ? 'person' : 'person-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
