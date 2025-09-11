const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.get('/api/v1/socialnet', (req, res)=> {
    res.send('OK');
});

module.exports = app;

