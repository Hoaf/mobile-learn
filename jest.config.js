module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@reduxjs/toolkit|immer|redux|react-redux|react-native-vector-icons)/)',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/shared/services/api-service.ts',
    'src/shared/services/token-service.ts',
    'src/shared/database/db.ts',
  ],
};
