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
        const fulfilledResult = onFullfilled(this._result);
        let nextResult;

        if(fulfilledResult instanceof PromiseCustom || fulfilledResult instanceof Promise){
            nextResult = fulfilledResult._result;
        }else{
            nextResult = fulfilledResult;
        }

        const nextPromise = new this.constructor(function(){});

        nextPromise._result = nextResult;

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
    }


}


module.exports = PromiseCustom;