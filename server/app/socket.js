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

        const exec = 'geth attach data/geth.ipc --exec';

        const id = await chain.run(
            `${exec} "personal.newAccount('${pswd}')"`
        ).then(r => r.slice(1, -2));

        await chain.run(`${exec} "personal.unlockAccount('${id}', '${pswd}')"`);

        socket.emit('loaded', { id, pswd });

        socket.on('disconnect', async () => {
            const keystore = path.resolve(chain.ethPath, 'data/keystore');

            const files = await fs.readdir(keystore);

            const key = files.find(file => file.endsWith(id.slice(2)));

            await fs.unlink(path.resolve(chain.ethPath, 'data/keystore', key));
        });
    }
};
