const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

const dbConfig = {
  host: process.env.MYSQL_HOST || 'db',
  user: process.env.MYSQL_USER || 'user',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'mydb',
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let connectionPool;

async function testDbConnection() {
  try {
    connectionPool = mysql.createPool(dbConfig);
    const connection = await connectionPool.getConnection();
    console.log('✅ Kết nối MySQL thành công!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Kết nối MySQL thất bại:', error.message);
    await new Promise(resolve => setTimeout(resolve, 5000));
    return testDbConnection();
  }
}

app.get('/', async (req, res) => {
  let dbStatus = 'Chưa kiểm tra';
  try {
    await connectionPool.query('SELECT 1');
    dbStatus = 'Kết nối OK';
  } catch (error) {
    dbStatus = `Lỗi kết nối: ${error.message}`;
    console.error('Lỗi khi ping DB:', error);
    await testDbConnection();
  }
  res.send(`
      <h1>Ứng dụng Node.js</h1>
      <p>Trạng thái kết nối MySQL: ${dbStatus}</p>
      <p>Hostname: ${process.env.HOSTNAME || require('os').hostname()}</p>
  `);
});

async function startServer() {
  console.log("Đang kiểm tra kết nối database...");
  await testDbConnection();
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server Node.js đang chạy trên http://${HOST}:${PORT}`);
    console.log(`Kết nối tới MySQL host: ${dbConfig.host}`);
  });
}

startServer();
