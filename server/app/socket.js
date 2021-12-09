const chain = require('../chain');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');

const randomBytes = promisify(crypto.randomBytes);

/**@typedef {import('socket.io').Socket} Socket*/

const sockets = {};

module.exports = {
    getSocket: addr => sockets[addr],
    async onConnect(/**@type {Socket}*/ socket) {
        const pswd = await randomBytes(6).then(b => b.toString('hex'));

        const web3 = chain.web3();

        const id = await web3.eth.personal.newAccount(pswd);

        const acc = chain.getAccs()[0];
        const addr = web3.utils.toChecksumAddress(id);

        await Promise.all([
            web3.eth.sendTransaction({
                from: acc,
                to: addr,
                value: '999999999999999999999999'
            }),
            web3.eth.personal.unlockAccount(id, pswd)
        ]);

        sockets[id.toLowerCase()] = socket;

        socket.emit('loaded', { id, pswd });

        socket.on('disconnect', async () => {
            const keystore = path.resolve(chain.ethPath, 'data/keystore');

            const files = await fs.readdir(keystore);

            const key = files
                .find(file => file.endsWith(id.slice(2).toLowerCase()));

            console.log('ESSA É A MINHA CHAVE: ' + key);

            await fs.unlink(path.resolve(chain.ethPath, 'data/keystore', key));

            delete sockets[id.toLowerCase()];
        });

        socket.on('message', async msg => {
            switch (msg.type) {
                case 'message': {
                    const { abi, address, payload } = msg;

                    const contract = new web3.eth.Contract(abi, address);

                    const Method = contract.methods.publish(addr, payload);

                    const gas = await Method.estimateGas();

                    const res = await Method.send({
                        from: addr,
                        gas: 2 * gas,
                        gasPrice: web3.utils.toWei('0.00000001', 'ether'),
                    });

                    socket.send({
                        type: 'response',
                        payload: res
                    });

                    break;
                }
            }
        });
    }
};
