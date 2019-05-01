const C = require('./lib/constants');

// It necessary to implement native behaviour of promise
const defaultRejected = value => value;

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

    then(onFulfilled, onRejected = defaultRejected) {
        return new this.constructor((resolve, reject) => {
            const _onFulfilled = result => {
                try {
                    resolve(onFulfilled(result));
                } catch (err) {
                    reject(err);
                }
            };
            const _onRejected = error => {
                try {
                    reject(onRejected(error));
                } catch (_err) {
                    reject(_err);
                }
            };

            switch (this._state) {
                case C.FULFILLED:
                    onFulfilled(this._promiseResult);
                    break;
                case C.REJECTED:
                    onRejected(this._promiseResult);
                    break;
                default:
                    this._jobs.push({ onFulfilled: _onFulfilled, onRejected: _onRejected });
            }
        });
    }

    catch(onRejected){
        const self = this;
        self.then(undefined, onRejected);
    }

}

module.exports = PromiseSecond;