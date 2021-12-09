const chain = require('../chain');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');

const randomBytes = promisify(crypto.randomBytes);

/**@typedef {import('socket.io').Socket} Socket*/

module.exports = {
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

        socket.emit('loaded', { id, pswd });

        socket.on('disconnect', async () => {
            const keystore = path.resolve(chain.ethPath, 'data/keystore');

            const files = await fs.readdir(keystore);

            const key = files.find(file => file.endsWith(id.slice(2)));

            await fs.unlink(path.resolve(chain.ethPath, 'data/keystore', key));
        });
    }
};
