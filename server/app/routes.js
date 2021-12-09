const { Router } = require('express');
const solc = require('../solc');
const chain = require('../chain');

const routes = Router();

routes.post('/topic', async (req, res) => {
    const { publishers, listeners, addr, pswd } = req.body;

    if (
        !Array.isArray(publishers) ||
        !Array.isArray(listeners) ||
        ![...publishers, ...listeners].every(addr =>
            typeof addr === 'string' && addr.match(/^0x[a-fA-F0-9]{40}$/)
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

        return res.json({ address, abi });
    }
    catch (err) {
        return res.status(401).json({
            message: err.message,
        });
    }
});



module.exports = routes;
