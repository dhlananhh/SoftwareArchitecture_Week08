const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json()); // Middleware để parse JSON body

const port = process.env.PORT || 3000;
const mongoHost = process.env.MONGO_HOST || 'mongodb'; // Tên service MongoDB
const mongoPort = process.env.MONGO_PORT || 27017;
const mongoDbName = process.env.MONGO_DB_NAME || 'mydatabase';
// Thêm user/pass nếu bạn cấu hình MongoDB yêu cầu xác thực
// const mongoUser = process.env.MONGO_USER;
// const mongoPass = process.env.MONGO_PASS;
// const mongoUri = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/${mongoDbName}?authSource=admin`;
const mongoUri = `mongodb://${mongoHost}:${mongoPort}/${mongoDbName}`;

//--- Kết nối MongoDB với retry ---
const connectWithRetry = () => {
	console.log('Attempting MongoDB connection...');
	mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverSelectionTimeoutMS: 5000 // Timeout ngắn để thử lại nhanh hơn nếu chưa sẵn sàng
	})
		.then(() => console.log('MongoDB connected successfully!'))
		.catch(err => {
			console.error('MongoDB connection error:', err.message);
			console.log('Retrying connection in 5 seconds...');
			setTimeout(connectWithRetry, 5000); // Thử kết nối lại sau 5 giây
		});
};

connectWithRetry(); // Bắt đầu kết nối

//--- Định nghĩa Schema và Model (Ví dụ) ---
const ItemSchema = new mongoose.Schema({
	name: String,
	quantity: Number,
	createdAt: { type: Date, default: Date.now }
});
const Item = mongoose.model('Item', ItemSchema);

//--- Routes API ---
app.get('/', (req, res) => {
	res.send('Node.js + MongoDB API is running!');
});

// Lấy tất cả items
app.get('/items', async (req, res) => {
	try {
		const items = await Item.find();
		res.json(items);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Tạo item mới
app.post('/items', async (req, res) => {
	const item = new Item({
		name: req.body.name,
		quantity: req.body.quantity
	});
	try {
		const newItem = await item.save();
		res.status(201).json(newItem);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

//--- Khởi động Server ---
const server = app.listen(port, '0.0.0.0', () => {
	console.log(`Node.js app listening at http://localhost:${port}`);
});

//--- Xử lý tắt ứng dụng ---
process.on('SIGINT', async () => {
	console.log("Received SIGINT. Closing MongoDB connection...");
	await mongoose.connection.close();
	console.log("MongoDB connection closed.");
	server.close(() => {
		console.log("HTTP server closed.");
		process.exit(0);
	});
});
