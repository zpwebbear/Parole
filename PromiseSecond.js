const C = require('./lib/constants');

class PromiseSecond {

    constructor(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Promise constructor argument must be a function');
        }

        this._state = C.PENDING;
        this._jobs = [];

        const resolve = result => {
            if (this._state !== C.PENDING) {
                return;
            }

            this._state = 'FULFILLED';
            this._promiseResult = result;

            for (const { onFulfilled } of this._jobs) {
                onFulfilled(result);
            }
        };

        const reject = error => {
            if (this._state !== C.PENDING) {
                return;
            }
            this._state = C.REJECTED;
            this._promiseResult = error;

            for (const { onRejected } of this._jobs) {
                onRejected(error);
            }
        };

        try {
            callback(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        switch (this._state) {
            case C.FULFILLED:
                onFulfilled(this._promiseResult);
                break;
            case C.REJECTED:
                onRejected(this._promiseResult);
                break;
            default:
                this._jobs.push({ onFulfilled, onRejected });
        }
    }
}

module.exports = PromiseSecond;