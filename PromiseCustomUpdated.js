const C = require('./lib/constants');

class PromiseCustomUpdated {
    constructor(callback) {
        this._state = C.PENDING;
        this._jobs = [];
        this._promiseStart(callback, this.resolve, this.reject)
    }

    then(onFulfilled, onRejected) {
        const parent = this;
        return new this.constructor( (resolve, reject) => {
            return parent.done((result) => {
                if (typeof onFulfilled === 'function') {
                    try {
                        return resolve(onFulfilled(result))
                    } catch (ex) {
                        return reject(ex)
                    }
                } else {
                    resolve(result)
                }
            }, function (error) {
                if (typeof onRejected === 'function') {
                    try {
                        return resolve(onRejected(error))
                    } catch (ex) {
                        return reject(ex)
                    }
                } else {
                    return reject(error)
                }
            })
        })
    }

    handle(handler) {
        if (this._state === C.PENDING) {
            this._jobs.push(handler)
        } else {
            if (this._state === C.FULFILLED &&
                typeof handler.onFulfilled === 'function') {
                handler.onFulfilled(this._result)
            }
            if (this._state === C.REJECTED &&
                typeof handler.onRejected === 'function') {
                handler.onRejected(this._result)
            }
        }
    }

    done(onFulfilled, onRejected){
        setTimeout(() => {
            this.handle({
                onFulfilled: onFulfilled,
                onRejected: onRejected
            })
        })
    }

    catch(onRejected) {
        const parent = this;
        parent.then(undefined, onRejected)
    }

    _fulfill(value){
        if (this._state !== C.PENDING) {
            return;
        }

        this._result = value;
        this._state = C.FULFILLED;
    }

    resolve(value) {
        if (value instanceof PromiseCustomUpdated){
            const then = result.then;
            this._promiseStart(then.bind(value), this.resolve, this.reject)
            return;
        }
        console.log('RESOLVE', this)
        this._fulfill(value)
        this._jobs.forEach(this.handle)
        this._jobs = null
    }

    reject(reason) {
        if (this._state !== C.PENDING) {
            return;
        }

        this._result = reason;
        this._state = C.REJECTED;
        this._jobs.forEach(this.handle)
        this._jobs = null
    }

    _promiseStart(callback, onFulfilled, onRejected){
        callback(onFulfilled, onRejected)
    }
}

module.exports = PromiseCustomUpdated;