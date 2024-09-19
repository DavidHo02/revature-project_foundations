const express = require('express');
// const bodyParser = require('body-parser');
const app = express();
const path = require('path');

const { logger } = require('./util/logger');

const { User } = require('./models/user');
const userRoutes = require('./controller/users');
const ticketRoutes = require('./controller/tickets');

const PORT = 3000;

// Body parser middleware
// Lets you parse incoming and outgoing json requests
app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded()); // lets you parse URL-encoded form data

app.use((req, res, next) => {
    logger.info(`Incoming ${req.method} request to ${req.url}`);
    next();
});

app.use('/', userRoutes);
app.use('/', ticketRoutes);

app.get('/', (req, res) => {
    res.send('get request handled');
});

app.post('/register', (req, res) => {
    res.send(req.url);
});

app.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`);
})