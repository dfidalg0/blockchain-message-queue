const chain = require('./chain');
const app = require('./app');

void async function () {
    await chain.createChain();

    const node = chain.startNode();

    node.on('close', () => process.exit());

    // Repassando o sinal para o minerador da block chain
    process.on('SIGINT', () => node.kill('SIGINT'));

    node.stdout.on('data', d => process.stdout.write(d.toString('utf-8')));
    node.stderr.on('data', d => process.stdout.write(d.toString('utf-8')));

    const startHandler = d => {
        /**@type {string} */
        const str = d.toString('utf-8');

        if (str.includes('IPC endpoint opened')) {
            node.stderr.off('data', startHandler);

            app.start();
        }
    };

    node.stderr.on('data', startHandler);
}();
