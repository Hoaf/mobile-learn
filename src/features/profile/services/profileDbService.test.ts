import { User } from '../../../shared/models/user';

const mockExecuteSql = jest.fn();
const mockDb = { executeSql: mockExecuteSql };

jest.mock('../../../shared/database/db', () => ({
    getDatabase: jest.fn(() => Promise.resolve(mockDb)),
}));

import { saveUserProfile, getUserProfile, updateUserProfile, clearUserProfile } from './profileDbService';

const mockUser: User = {
    username: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    age: 28,
    role: 'user',
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('saveUserProfile', () => {
    it('calls INSERT OR REPLACE with correct params', async () => {
        mockExecuteSql.mockResolvedValue([{}]);
        await saveUserProfile(mockUser);

        expect(mockExecuteSql).toHaveBeenCalledWith(
            expect.stringContaining('INSERT OR REPLACE'),
            expect.arrayContaining([
                mockUser.username,
                mockUser.email,
                mockUser.firstName,
                mockUser.lastName,
                mockUser.age,
                mockUser.role,
                expect.any(String),
            ]),
        );
    });
});

describe('getUserProfile', () => {
    it('returns User when data exists in DB', async () => {
        mockExecuteSql.mockResolvedValue([{
            rows: {
                length: 1,
                item: () => ({
                    username: mockUser.username,
                    email: mockUser.email,
                    firstName: mockUser.firstName,
                    lastName: mockUser.lastName,
                    age: mockUser.age,
                    role: mockUser.role,
                }),
            },
        }]);

        const result = await getUserProfile();

        expect(result).toEqual(mockUser);
    });

    it('returns null when table is empty', async () => {
        mockExecuteSql.mockResolvedValue([{ rows: { length: 0 } }]);

        const result = await getUserProfile();

        expect(result).toBeNull();
    });
});

describe('updateUserProfile', () => {
    it('calls UPDATE with correct fields', async () => {
        mockExecuteSql.mockResolvedValue([{}]);
        const data = { firstName: 'Jane', lastName: 'Smith', age: 30 };

        await updateUserProfile(data);

        expect(mockExecuteSql).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE user_profile'),
            expect.arrayContaining(['Jane', 'Smith', 30, expect.any(String)]),
        );
    });
});

describe('clearUserProfile', () => {
    it('calls DELETE FROM user_profile', async () => {
        mockExecuteSql.mockResolvedValue([{}]);

        await clearUserProfile();

        expect(mockExecuteSql).toHaveBeenCalledWith('DELETE FROM user_profile');
    });
});
