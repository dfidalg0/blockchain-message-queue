const chain = require('./chain');

const PORT = process.env.PORT || 5000;

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

        if (str.includes('WebSocket enabled')) {
            const p = PORT;

            require('./app').listen(PORT, () => {
                console.log('\u001b[32m');
                console.log('┌───────────────────────────────────────────────┐');
                console.log(`│          Server started on port ${p}          │`);
                console.log('└───────────────────────────────────────────────┘');
                console.log('\u001b[00m');
            });

            node.stderr.off('data', startHandler);
        }
    };

    node.stderr.on('data', startHandler);
}();
