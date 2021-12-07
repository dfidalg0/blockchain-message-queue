const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const { promisify } = require('util');

const exec = promisify(cp.exec);

/**@param {string} cmd */
const run = cmd => exec(cmd).then(r => r.stdout);

module.exports = {
    async createChain() {
        const ethPath = path.resolve(__dirname, '../.eth');

        if (fs.existsSync(ethPath)) return;

        await fs.promises.mkdir(ethPath);

        const [accounts, genesis] = await Promise.all([
            createAccounts(1)
                .then(accs => accs.map(acc => acc.replace('0x', ''))),
            fs.promises.readFile(path.resolve(__dirname, 'genesis.json'), 'utf-8')
                .then(JSON.parse)
        ]);


        genesis.alloc = accounts.reduce((alloc, acc) => ({
            ...alloc,
            [acc]: {
                balance: '99999999'
            }
        }), {});

        const genPath = path.resolve(ethPath, 'genesis.json');

        await fs.promises.writeFile(genPath, JSON.stringify(genesis));

        const datadir = path.resolve(ethPath, 'data');

        await run(`geth init --datadir "${datadir}" "${genPath}"`);
    },
    startNode() {
        const ethPath = path.resolve(__dirname, '../.eth/');

        const datadir = path.resolve(ethPath, 'data');

        const genPath = path.resolve(ethPath, 'genesis.json');

        const accounts = Object.keys(require(genPath).alloc);

        const args = [
            `--datadir "${datadir}"`,
            `--networkid 15`,
            `--ws`,
            `--ws.port 8485`,
            `--mine`,
            `--miner.threads=1`,
            `--miner.etherbase=0x${accounts[0]}`,
        ];

        return cp.spawn('geth', args, {
            stdio: 'pipe',
            shell: true
        });
    }
};

/**@param {number} n */
async function createAccounts(n) {
    const pwdPath = path.resolve(__dirname, 'password.txt');

    const promises = Array(n).fill()
        .map(() => run(`geth account new --password "${pwdPath}"`));

    return Promise.all(promises)
        .then(outs => outs.map(out => out.match(/0x.+/)?.[0] || null));
}
