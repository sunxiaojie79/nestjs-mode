// test-mysql.ts
import * as mysql from 'mysql2/promise';

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'example',
      database: 'testdb',
    });
    const [rows] = await connection.query('SELECT 1');
    console.log('✅ MySQL connected successfully!', rows);
    connection.end();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
  }
})();
