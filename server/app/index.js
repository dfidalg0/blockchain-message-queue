const express = require('express');
const morgan = require('morgan');
const solc = require('../solc');

const app = express();

app.use(morgan('dev'));

app.post('/contract', async (_, res) => {
    const out = await solc.compile('contract C { function f() public {} }');

    res.json(out);
});

app.get('/', (_, res) => {
    res.send('Hello, World!');
});

module.exports = app;
