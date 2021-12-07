const { Worker } = require('worker_threads');
const path = require('path');

const workerPath = path.resolve(__dirname, 'solc.worker.js');

const worker = new Worker(workerPath);

let counter = 0;

module.exports = {
    /**@param {string} code */
    compile(code) {
        let id = ++counter;

        return new Promise((resolve, reject) => {
            worker.postMessage({ id, code });

            const handler = ({ id: msgId, err, output }) => {
                if (msgId !== id) return;

                worker.off('message', handler);

                if (err) {
                    reject(err);
                }
                else {
                    resolve(output);
                }
            };

            worker.on('message', handler);
        });
    }
};
