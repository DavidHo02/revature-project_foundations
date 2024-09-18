const express = require('express');
const app = express();
const path = require('path');

const { logger } = require('./util/logger');
const userRoutes = require('./routes/users');

const PORT = 3000;

app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.send('get request handled');
});

app.post('/register', (req, res) => {
    res.send(req.url);
});

app.listen(PORT, () => {
    logger.info(`Server listening on port: ${PORT}`);
})