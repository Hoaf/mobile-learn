import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    iconContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 16,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 28,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 13,
        color: '#9E9E9E',
        textAlign: 'center',
        marginBottom: 24,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 4,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    tabActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9E9E9E',
    },
    tabTextActive: {
        color: '#1A1A1A',
        fontWeight: '600',
    },
    form: {
        flex: 1,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: '#424242',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: '#1A1A1A',
        backgroundColor: '#FAFAFA',
        marginBottom: 16,
    },
    forgotContainer: {
        alignItems: 'flex-end',
        marginBottom: 20,
        marginTop: -8,
    },
    forgotText: {
        fontSize: 13,
        color: '#9E9E9E',
    },
    signInButton: {
        backgroundColor: '#00BCD4',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 14,
    },
    signInButtonDisabled: {
        opacity: 0.6,
    },
    signInButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    biometricsButton: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        paddingVertical: 13,
        alignItems: 'center',
        marginBottom: 24,
    },
    biometricsText: {
        fontSize: 13,
        color: '#616161',
        fontWeight: '500',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        fontSize: 12,
        color: '#9E9E9E',
        marginHorizontal: 10,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 28,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        paddingVertical: 12,
        gap: 8,
    },
    socialIcon: {
        fontSize: 16,
        fontWeight: '700',
        color: '#DB4437',
    },
    facebookIcon: {
        color: '#1877F2',
    },
    socialText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#424242',
    },
    footerText: {
        fontSize: 11,
        color: '#9E9E9E',
        textAlign: 'center',
        lineHeight: 18,
    },
    footerLink: {
        color: '#00BCD4',
        fontWeight: '500',
    },
});
