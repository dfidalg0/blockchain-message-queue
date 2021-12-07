const { parentPort } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const solc = require('solc');

const templatePath = path.resolve(__dirname, 'input.sol');

const template = fs.readFileSync(templatePath, 'utf-8');

parentPort.on('message', ({ id, code }) => {
    try {
        const input = JSON.stringify({
            language: 'Solidity',
            sources: {
                'input.sol': {
                    content: template.replace('//->INJECT', code)
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

        const compiled = JSON.parse(solc.compile(input));
        const output = compiled.contracts['input.sol'].Topic;
        parentPort.postMessage({ id, output });
    }
    catch (err) {
        parentPort.postMessage({ id, err });
    }
});
