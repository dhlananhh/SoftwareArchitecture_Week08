const express = require('express');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
	res.send('Hello from Node.js application running in Docker!\n');
});

app.listen(PORT, HOST, () => {
	console.log(`The application is running on http://${HOST}:${PORT}`);
});
