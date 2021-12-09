const { Router } = require('express');
const solc = require('../solc');
const chain = require('../chain');
const { getSocket } = require('./socket');

const routes = Router();

routes.post('/topic', async (req, res) => {
    const { publishers, listeners, addr, pswd } = req.body;

    if (
        !Array.isArray(publishers) ||
        !Array.isArray(listeners) ||
        ![...publishers, ...listeners].every(addr =>
            getSocket(addr.toLowerCase())
        ) ||
        typeof addr !== 'string' ||
        typeof pswd !== 'string'
    ) {
        return res.status(422).json({
            message: 'Formato Inválido'
        });
    }

    const web3 = chain.web3();

    try {
        await web3.eth.personal.unlockAccount(addr, pswd);
    }
    catch (err) {
        return res.status(401).json({
            message: err.message
        });
    }

    const addPublishers = publishers
        .map(addr => web3.utils.toChecksumAddress(addr))
        .map(addr => `addPublisher(${addr});`)
        .join('');

    const addListeners = listeners
        .map(addr => web3.utils.toChecksumAddress(addr))
        .map(addr => `addListener(${addr});`)
        .join('');

    const out = await solc.compile(`
        owner = ${web3.utils.toChecksumAddress(addr)};
        ${addPublishers}
        ${addListeners}
    `);

    const transaction = new web3.eth.Contract(out.abi).deploy({
        data: '0x' + out.evm.bytecode.object,
    });

    try {
        const gas = await transaction.estimateGas();

        const contract = await transaction.send({
            from: web3.utils.toChecksumAddress(addr),
            gas: 2 * gas,
            gasPrice: web3.utils.toWei('0.00000001', 'ether'),
        });

        const { address, jsonInterface: abi } = contract.options;

        const topic = { address, abi };

        for (const publisher of publishers) {
            const id = publisher.toLowerCase();

            if (id === addr.toLowerCase()) continue;

            const socket = getSocket(id);

            socket.send({
                type: 'topic',
                payload: topic
            });
        }

        for (const listener of listeners) {
            const Event = contract.events.Publish();

            const handler = e => {
                const id = listener.toLowerCase();

                const socket = getSocket(id);

                if (!socket) {
                    Event.off('data', handler);
                    return;
                }

                socket.send({
                    type: 'publish',
                    payload: {
                        id: e.returnValues.id,
                        topic: contract.options.address
                    }
                });
            };

            Event.on('data', handler);
        }

        return res.json(topic);
    }
    catch (err) {
        return res.status(401).json({
            message: err.message,
        });
    }
});



module.exports = routes;
