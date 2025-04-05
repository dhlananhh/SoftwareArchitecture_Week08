const express = require('express');

// Constants
const PORT = 3000; // Port bên trong container
const HOST = '0.0.0.0'; // Lắng nghe trên tất cả các network interface

// App
const app = express();
app.get('/', (req, res) => {
	res.send('Xin chào từ ứng dụng Node.js chạy trong Docker!\n');
});

app.listen(PORT, HOST, () => {
	console.log(`Ứng dụng đang chạy trên http://${HOST}:${PORT}`);
});