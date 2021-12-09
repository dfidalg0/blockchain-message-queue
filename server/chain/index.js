const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const net = require('net');
/**@type {typeof import('web3').default} */
const Web3 = require('web3');
const { promisify } = require('util');

const exec = promisify(cp.exec);

const ethPath = path.resolve(__dirname, '../.eth');

/**@param {string} cmd */
const run = cmd => exec(cmd, { cwd: ethPath }).then(r => r.stdout);

let accounts = [];

let web3 = null;

function getWeb3() {
    if (!web3) {
        const p = path.resolve(ethPath, 'data/geth.ipc');
        const provider = new Web3.providers.IpcProvider(p, net);
        web3 = new Web3(provider);
    }

    return web3;
}

module.exports = {
    run,
    ethPath,
    getAccs: () => accounts,
    /**@type {() => import('web3').default} */
    web3: getWeb3,
    async createChain() {
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
                balance: '999999999999999999999999999999'
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

        accounts = Object.keys(require(genPath).alloc);

        const args = [
            `--datadir "${datadir}"`,
            `--networkid 15`,
            `--mine`,
            `--miner.threads=1`,
            `--miner.etherbase=0x${accounts[0]}`,
            `--allow-insecure-unlock`,
            '--rpc.txfeecap 0'
        ];

        const proc = cp.spawn('geth', args, {
            stdio: 'pipe',
            shell: true
        });

        return proc;
    }
};

/**@param {number} n */
async function createAccounts(n) {
    const pwdPath = path.resolve(__dirname, 'password.txt');

    const promises = Array(n).fill()
        .map(() => run(`geth account new --password "${pwdPath}" --datadir data`));

    return Promise.all(promises)
        .then(outs => outs.map(out => out.match(/0x.+/)?.[0] || null));
}
