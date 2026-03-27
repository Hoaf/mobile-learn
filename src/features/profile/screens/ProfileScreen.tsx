import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HomeTabParamList } from '../../../shared/types/navigation';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logoutThunk, fetchUserThunk, updateUserThunk } from '../../auth/store/authThunk';

type Props = BottomTabScreenProps<HomeTabParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth.user);
    const updating = useAppSelector(state => state.auth.updating);

    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');

    useEffect(() => {
        dispatch(fetchUserThunk());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setAge(String(user.age));
        }
    }, [user]);

    const handleEdit = useCallback(() => setIsEditing(true), []);

    const handleCancel = useCallback(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setAge(String(user.age));
        }
        setIsEditing(false);
    }, [user]);

    const handleSave = useCallback(async () => {
        const parsedAge = parseInt(age, 10);
        if (!firstName.trim() || !lastName.trim() || isNaN(parsedAge)) {
            Alert.alert('Error', 'Please fill in all fields correctly.');
            return;
        }
        const result = await dispatch(updateUserThunk({ firstName, lastName, age: parsedAge }));
        if (updateUserThunk.fulfilled.match(result)) {
            setIsEditing(false);
        } else {
            Alert.alert('Error', (result.payload as string) ?? 'Update failed');
        }
    }, [dispatch, firstName, lastName, age]);

    const handleLogout = useCallback(async () => {
        await dispatch(logoutThunk());
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }));
    }, [dispatch, navigation]);

    const initials = user
        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        : '?';

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Avatar Card */}
                <View style={styles.card}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
                    <Text style={styles.username}>@{user?.username}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{user?.role ?? 'Member'}</Text>
                    </View>
                </View>

                {/* Account Details */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Account Details</Text>
                        {isEditing ? (
                            <View style={styles.editActions}>
                                <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSave} style={styles.saveBtn} disabled={updating}>
                                    {updating
                                        ? <ActivityIndicator size="small" color="#fff" />
                                        : <Text style={styles.saveText}>Save</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={handleEdit} accessibilityRole="button">
                                <Text style={styles.editText}>Edit Details</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Email — always read-only */}
                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Email Address</Text>
                        <View style={[styles.fieldInput, styles.fieldInputReadOnly]}>
                            <Text style={styles.fieldValueMuted}>{user?.email}</Text>
                        </View>
                    </View>

                    {/* First Name */}
                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>First Name</Text>
                        {isEditing ? (
                            <TextInput
                                style={[styles.fieldInput, styles.fieldInputEditable]}
                                value={firstName}
                                onChangeText={setFirstName}
                                accessibilityLabel="First Name"
                            />
                        ) : (
                            <View style={styles.fieldInput}>
                                <Text style={styles.fieldValue}>{user?.firstName}</Text>
                            </View>
                        )}
                    </View>

                    {/* Last Name */}
                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Last Name</Text>
                        {isEditing ? (
                            <TextInput
                                style={[styles.fieldInput, styles.fieldInputEditable]}
                                value={lastName}
                                onChangeText={setLastName}
                                accessibilityLabel="Last Name"
                            />
                        ) : (
                            <View style={styles.fieldInput}>
                                <Text style={styles.fieldValue}>{user?.lastName}</Text>
                            </View>
                        )}
                    </View>

                    {/* Age */}
                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Age</Text>
                        {isEditing ? (
                            <TextInput
                                style={[styles.fieldInput, styles.fieldInputEditable]}
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                                accessibilityLabel="Age"
                            />
                        ) : (
                            <View style={styles.fieldInput}>
                                <Text style={styles.fieldValue}>{user?.age}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Actions */}
                <TouchableOpacity style={styles.actionButton} accessibilityRole="button">
                    <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                        <Text style={styles.actionIconText}>📦</Text>
                    </View>
                    <Text style={styles.actionText}>Order History</Text>
                    <Text style={styles.actionChevron}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.logoutButton]}
                    onPress={handleLogout}
                    accessibilityRole="button"
                    accessibilityLabel="Logout"
                >
                    <View style={[styles.actionIcon, { backgroundColor: '#FFEBEE' }]}>
                        <Text style={styles.actionIconText}>🚪</Text>
                    </View>
                    <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
                    <Text style={styles.actionChevron}>›</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 32 },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        alignItems: 'center',
    },
    avatarCircle: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: '#00BCD4',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 12,
    },
    avatarText: { fontSize: 26, fontWeight: '700', color: '#FFFFFF' },
    name: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
    username: { fontSize: 13, color: '#9E9E9E', marginBottom: 10 },
    badge: { backgroundColor: '#E0F7FA', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
    badgeText: { fontSize: 12, fontWeight: '600', color: '#00BCD4', textTransform: 'capitalize' },
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', alignSelf: 'stretch', marginBottom: 16,
    },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
    editText: { fontSize: 13, color: '#00BCD4', fontWeight: '500' },
    editActions: { flexDirection: 'row', gap: 8 },
    cancelBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0' },
    cancelText: { fontSize: 13, color: '#9E9E9E', fontWeight: '500' },
    saveBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: '#00BCD4', minWidth: 52, alignItems: 'center' },
    saveText: { fontSize: 13, color: '#fff', fontWeight: '600' },
    field: { alignSelf: 'stretch', marginBottom: 12 },
    fieldLabel: { fontSize: 12, fontWeight: '500', color: '#616161', marginBottom: 6 },
    fieldInput: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11 },
    fieldInputReadOnly: { backgroundColor: '#F5F5F5', borderColor: '#EEEEEE' },
    fieldInputEditable: { borderColor: '#00BCD4', color: '#1A1A1A', fontSize: 14 },
    fieldValue: { fontSize: 14, color: '#1A1A1A' },
    fieldValueMuted: { fontSize: 14, color: '#9E9E9E' },
    actionButton: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF', borderRadius: 12,
        padding: 14, marginBottom: 10,
        elevation: 1, shadowColor: '#000',
        shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
    },
    logoutButton: { marginBottom: 0 },
    actionIcon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    actionIconText: { fontSize: 18 },
    actionText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
    logoutText: { color: '#e74c3c' },
    actionChevron: { fontSize: 20, color: '#BDBDBD' },
});
