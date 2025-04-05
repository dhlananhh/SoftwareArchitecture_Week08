const express = require('express');
const mysql = require('mysql2/promise'); 

// Constants
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// MySQL Connection Details từ biến môi trường (an toàn hơn)
// Hoặc bạn có thể hardcode ở đây nếu muốn đơn giản cho ví dụ này
const dbConfig = {
	host: process.env.MYSQL_HOST || 'mysql_connector_db', // Tên service MySQL trong Docker Compose
	user: process.env.MYSQL_USER || 'appuser',
	password: process.env.MYSQL_PASSWORD || 'apppassword',
	database: process.env.MYSQL_DATABASE || 'appdb',
	port: process.env.MYSQL_PORT || 3306,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
};

const app = express();
let dbPool; 

// Hàm khởi tạo kết nối database (async)
async function initializeDatabase() {
	try {
		dbPool = mysql.createPool(dbConfig);
		// Thử kết nối để kiểm tra
		const connection = await dbPool.getConnection();
		console.log('Connected to MySQL database successfully!');
		connection.release(); 
		return true;
	} catch (err) {
		console.error('DATABASE CONNECTION ERROR:', err.message);
		// Thử lại sau vài giây nếu kết nối thất bại lúc khởi động
		console.log('Try reconnecting after 5 seconds...');
		await new Promise(resolve => setTimeout(resolve, 5000));
		return initializeDatabase(); 
	}
}

// Endpoint chính
app.get('/', async (req, res) => {
	let dbStatus = 'Unable to connect to DB.';
	if (dbPool) {
		try {
			// Lấy kết nối từ pool và thực hiện một query đơn giản
			const connection = await dbPool.getConnection();
			const [rows] = await connection.query('SELECT 1 + 1 AS result');
			connection.release();
			dbStatus = `DB connection successful! Test Query Result: ${rows[0].result}`;
		} catch (err) {
			dbStatus = `Error when querying DB: ${err.message}`;
			console.error("Query error:", err);
		}
	}
	res.send(`<h1>Node.js Application</h1><p>Status: ${dbStatus}</p>`);
});

// Khởi động server sau khi đảm bảo có kết nối DB ban đầu
initializeDatabase().then((connected) => {
	if (connected) {
		app.listen(PORT, HOST, () => {
			console.log(`Node.js application is running on http://${HOST}:${PORT}`);
			console.log('DB connection information: ');
			console.log(`   Host: ${dbConfig.host}`);
			console.log(`   User: ${dbConfig.user}`);
			console.log(`   Database: ${dbConfig.database}`);
		});
	} else {
		console.error("Unable to start server due to failure to connect to DB after multiple attempts.");
		process.exit(1); 
	}
}).catch(err => {
	console.error("Unexpected error while initializing DB: ", err);
	process.exit(1);
});