const C = require('./lib/constants');

/**
 * @class PromiseCustom
 * @param {Function} callback
 * @constructor
 */
class PromiseCustom {

    /**
     * 
     * @param {Function} callback 
     */
    constructor(callback) {
        this.callback = callback;

        this._state = C.PENDING;

        this._result = undefined;
        this._fulfilledJobs = [];
        this._rejectedJobs = [];
        this._jobs = [];

        if (typeof callback === 'function') {
            this._makePromise(this, callback)
        } else {
            throw 'PromiseCustom constructor argument must be a function'
        }
    }

    /**
     * 
     * @param {Function} onFullfilled 
     * @param {Function} onRejected 
     */
    then(onFullfilled, onRejected = this._throw) {
        const parent = this;
        const newPromise = new this.constructor((resolve, reject)=>{
            return (onFullfilled, onRejected) =>{
                setTimeout(()=>{

                })
            }
        })

        if (this._isNext) {
            newPromise._subscribe(onFullfilled, onRejected)
            newPromise.resolve.bind(this)
        } else {
            this._subscribe(onFullfilled, onRejected)
        }

        return newPromise
    }
    

    /**
     * 
     * @param {Function} onRejected 
     */
    catch(onRejected) {
        return this.then(null, onRejected);
    }

    /**
     * 
     * @param {*} err 
     */
    _throw(err) {
        console.error(err)
    }

    /**
     * 
     * @param {PromiseCustom} promise 
     * @param {Function} callback 
     */
    _makePromise(promise, callback) {
        this.callback.call(
            promise,
            this.resolve.bind(promise),
            this.reject.bind(promise)
        )
    }


    /**
     * 
     * @param {*} value 
     */
    resolve(value) {
        console.log('RESOLVE', value)
        if (this._state !== C.PENDING) {
            return;
        }

        this._result = value;
        this._state = C.FULFILLED;
        this._jobs = [...this._fulfilledJobs]
  
        this._schedule()
    }

    /**
     * 
     * @param {*} reason 
     */
    reject(reason) {
        if (this._state !== C.PENDING) {
            return;
        }

        this._result = reason;
        this._state = C.REJECTED;
        this._jobs = [...this._rejectedJobs]
        this._schedule();
    }

    _subscribe(onFullfilled, onRejected) {
        this._fulfilledJobs.push(onFullfilled)
    }

    _schedule() {
        this._jobs.forEach(this._hadleJob, this)
    }

    _hadleJob(job){
        if(job){
            setTimeout(job, 1, this._result)
        }
    }
}


module.exports = PromiseCustom;