const { Router } = require('express');
const solc = require('../solc');

const routes = Router();

routes.post('/topic', async (req, res) => {
    const { publishers, listeners } = req.body;

    if (
        !Array.isArray(publishers) ||
        !Array.isArray(listeners) ||
        ![...publishers, ...listeners].every(addr =>
            typeof addr === 'string' && addr.match(/^0x[a-fA-F0-9]{40}$/)
        )
    ) {
        return res.status(422).json({
            message: 'Formato Inválido'
        });
    }

    const addPublishers = publishers
        .map(addr => `addPublisher(address(${addr}));`)
        .join('');

    const addListeners = listeners
        .map(addr => `addListener(address(${addr}));`)
        .join('');

    const out = await solc.compile(`
        ${addPublishers}
        ${addListeners}
    `);

    return res.json(out);
});



module.exports = routes;
