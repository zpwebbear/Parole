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
        
        if (typeof callback === 'function'){
            this._makePromise(this, callback)
        }else{
            throw 'PromiseCustom constructor argument must be a function'
        }
    }

    /**
     * 
     * @param {Function} onFullfilled 
     * @param {Function} onRejected 
     */
    then(onFullfilled, onRejected = this._throw) {

        const nextPromise = new this.constructor(function(){});

        this._subscribe(onFullfilled, onRejected, this._result)      

        return nextPromise
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
        throw err;
    }

    /**
     * 
     * @param {PromiseCustom} promise 
     * @param {Function} callback 
     */
    _makePromise(promise, callback){
        this.callback.call(
            promise,
            this._resolve.bind(promise), 
            this._reject.bind(promise)
            )
    }

    _setPromise(promise){
        promise._state = C.PENDING;
        promise._result = undefined;
        promise._fulfilledJobs = [];
    }
    
    /**
     * 
     * @param {*} value 
     */
    _resolve(value){
        if (this._state !== C.PENDING){
            return;
        }

        this._result = value;
        this._state  = C.FULFILLED;
        this._jobs = [...this._fulfilledJobs]
        this._schedule();
    }

    _fulfill(value){

    }

    /**
     * 
     * @param {*} reason 
     */
    _reject(reason){
        if (this._state !== C.PENDING){
            return;
        }

        this._result = reason;
        this._state  = C.REJECTED;
        this._jobs = [...this._rejectedJobs]
        this._schedule();
    }

    _subscribe(onFullfilled, onRejected, param){
        this._fulfilledJobs.push({
            callback: onFullfilled,
            param
        })

        this._rejectedJobs.push({
            callback: onRejected,
            param
        })
    }

    _schedule(){
        this._jobs.forEach(job =>{
            if(job.callback){
                setTimeout(job.callback, 1, this._result)
            }
        })
    }
}


module.exports = PromiseCustom;