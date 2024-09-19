const express = require('express');
const app = express();
const path = require('path');

const { logger } = require('./util/logger');

const { User } = require('./models/user');
const userRoutes = require('./routes/users');

app.use(express.json()) // for parsing application/json

const PORT = 3000;

app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.send('get request handled');
});

app.post('/register', (req, res) => {
    res.send(req.url);
});

app.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`);
})