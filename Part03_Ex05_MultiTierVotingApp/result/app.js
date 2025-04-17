const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 5001;

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

app.get('/results', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT option, count FROM votes');
    client.release();
    const results = {};
    result.rows.forEach(row => {
      results[row.option] = row.count;
    });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error ' + err);
  }
});

app.listen(port, () => {
  console.log(`Result app listening at http://localhost:${port}`);
});
