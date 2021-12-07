const solc = require('solc');
const { parentPort } = require('worker_threads');

parentPort.on('message', ({ id, code }) => {
    try {
        const input = JSON.stringify({
            language: 'Solidity',
            sources: {
                'input.sol': {
                    content: code
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*']
                    }
                }
            }
        });

        const output = JSON.parse(solc.compile(input)).contracts['input.sol'];
        parentPort.postMessage({ id, output });
    }
    catch (err) {
        parentPort.postMessage({ id, err });
    }
});
