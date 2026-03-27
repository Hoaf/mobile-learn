import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    if (db) return db;
    db = await SQLite.openDatabase({ name: 'mobile_learn.db', location: 'default' });
    await createTables(db);
    return db;
};

const createTables = async (database: SQLite.SQLiteDatabase): Promise<void> => {
    await database.executeSql(`
        CREATE TABLE IF NOT EXISTS user_profile (
            username  TEXT PRIMARY KEY,
            email     TEXT,
            firstName TEXT,
            lastName  TEXT,
            age       INTEGER,
            role      TEXT,
            updatedAt TEXT
        )
    `);
};
