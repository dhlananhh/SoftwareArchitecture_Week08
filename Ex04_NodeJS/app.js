const express = require('express');

// Constants
const PORT = 3000; // Port bên trong container
const HOST = '0.0.0.0'; // Lắng nghe trên tất cả các network interface

// App
const app = express();
app.get('/', (req, res) => {
	res.send('Hello from Node.js application running in Docker!\n');
});

app.listen(PORT, HOST, () => {
	console.log(`The application is running on http://${HOST}:${PORT}`);
});