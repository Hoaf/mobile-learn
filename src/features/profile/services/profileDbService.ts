import { getDatabase } from '../../../shared/database/db';
import { User } from '../../../shared/models/user';

export const saveUserProfile = async (user: User): Promise<void> => {
    const db = await getDatabase();
    await db.executeSql(
        `INSERT OR REPLACE INTO user_profile (username, email, firstName, lastName, age, role, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user.username, user.email, user.firstName, user.lastName, user.age, user.role, new Date().toISOString()],
    );
};

export const getUserProfile = async (): Promise<User | null> => {
    const db = await getDatabase();
    const [result] = await db.executeSql('SELECT * FROM user_profile LIMIT 1');
    if (result.rows.length === 0) return null;
    const row = result.rows.item(0);
    return {
        username: row.username,
        email: row.email,
        firstName: row.firstName,
        lastName: row.lastName,
        age: row.age,
        role: row.role,
    };
};

export const updateUserProfile = async (data: Pick<User, 'firstName' | 'lastName' | 'age'>): Promise<void> => {
    const db = await getDatabase();
    await db.executeSql(
        `UPDATE user_profile SET firstName = ?, lastName = ?, age = ?, updatedAt = ?`,
        [data.firstName, data.lastName, data.age, new Date().toISOString()],
    );
};

export const clearUserProfile = async (): Promise<void> => {
    const db = await getDatabase();
    await db.executeSql('DELETE FROM user_profile');
};
