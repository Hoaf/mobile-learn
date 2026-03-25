import * as Keychain from 'react-native-keychain';

const TOKEN_USERNAME = 'auth_token';

export const saveToken = async (token: string): Promise<void> => {
    await Keychain.setGenericPassword(TOKEN_USERNAME, token);
};

export const getToken = async (): Promise<string | null> => {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
};

export const clearToken = async (): Promise<void> => {
    await Keychain.resetGenericPassword();
};
