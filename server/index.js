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

        process.stdout.write(str);

        if (str.includes('WebSocket enabled')) {
            require('./app').listen(PORT, () => {
                console.log(`Server started at port ${PORT}`);
            });

            node.stderr.off('data', startHandler);
        }
    };

    node.stderr.on('data', startHandler);
}();
