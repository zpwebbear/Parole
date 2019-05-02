/**
 * Object of constants to describe Parole state
 * 
 * @type {Object}
 */
const C = {
    PENDING: 'Pending',
    RESOLVED: 'Resolved',
    REJECTED: 'Rejected'
}

/**
 * Stub function to implement native behaviour of promise
 * 
 * @param {*} value 
 */
function defaultFn(value){
    return value
}

/**
 * "Class" Parole with basic Promise functionality
 * 
 * @param {*} initialCallback 
 */
function Parole(initialCallback) {

    /**
     * @type {Array}
     */
    var _deferredCallbacks = [];

    /**
     * Push deferred callbacks in stack to call them after promise resolving
     * Such nesting is necessary to catch permanent state of "then" method and Parole own state
     * 
     * @param {Function} chainFunction 
     */
    function callLater(chainFunction){
        return function(callback){
            return new Parole(function(resolve){
                _deferredCallbacks.push(function(){
                    resolve(chainFunction()(callback))
                })
            })
        }
    }

    /**
     * Closure for then method
     */
    function _thenLater(){
        return this.then
    }

    /**
     * Closure for cathc method
     */
    function _catchLater(){
        return this.catch
    }


    /**
     * Implements behaviour of proposal https://github.com/tc39/proposal-promise-try/blob/master/polyfill.js#L12
     * 
     * @param {Function} callback 
     */  
    function _tryCall(callback){
        function innerCallback(){
            return callback(this._result)
        }
        return Parole.try(innerCallback.bind(this))
    }

    /**
     * @type {Function}
     */
    var tryCall = _tryCall.bind(this)
    
    /**
     * Change state of Parole instance
     *  
     * @param {string} state 
     */
    function _changeState(state){
        var newState = {}

        switch (state){
            case C.RESOLVED:
                newState =  {
                    _state: C.RESOLVED,
                    then: tryCall,
                    catch: defaultFn
                }
                break;
            case C.REJECTED:
                newState = {
                    _state: C.RESOLVED,
                    then: defaultFn,
                    catch: tryCall,
                }
                break;
            default:
                newState = {
                    _state: C.PENDING,
                    then: callLater(_thenLater.bind(this)),
                    catch: callLater(_catchLater.bind(this))
                }
                break;
        }

        Object.assign(this, newState);
    }

    /**
     * Closure for _changeState function
     * 
     * @type {Function}
     */
    var changeState = _changeState.bind(this)

    /**
     * Apply state and value of resolved promise
     * 
     * @param {string} state 
     * @param {*} value 
     */
    function _apply(state, value){
        if (this._state === C.PENDING){
            this._result = value;
            changeState(state)

            _deferredCallbacks.forEach(function(deferredCallback){
                if (deferredCallback){
                    deferredCallback()
                }
            })
        }
    }
    
    /**
     * Closure that initialize resolve and reject methods
     * 
     * @param {string} state
     * 
     * @returns {Function}
     */
    function _makePromiseCallback(state){
        return function(value){
            var apply = _apply.bind(this)
            if (value instanceof Parole && state === C.RESOLVED){
                value.then(function(value){
                    apply(C.RESOLVED, value)
                })
                value.catch(function(value){
                    apply(C.REJECTED, value)
                })
            }else if(value){
                apply(state, value)
            }
         }
    }
   
    /**
     * Closure 
     * 
     * @type {Function}
     */
    var _resolve = _makePromiseCallback(C.RESOLVED);

    /**
     * Closure 
     * 
     * @type {Function}
     */
    var _reject = _makePromiseCallback(C.REJECTED);

    /**
     * Closure 
     * 
     * @type {Function}
     */
    var resolve = _resolve.bind(this)

    /**
     * Closure 
     * 
     * @type {Function}
     */
    var reject = _reject.bind(this)

    changeState(C.PENDING);

    try{
        initialCallback(resolve, reject)
    } catch (error){
        _reject(error)
    }
}

/**
 * "Static" Parole method
 */
Parole.resolve = function(value) {
    return new Parole(function(resolve){
        resolve(value)
    })
}

/**
 * "Static" Parole method
 */
Parole.reject = function(value) {
    return new Parole(function(undefined, reject){
        reject(value)
    })
}

/**
 * "Static" Parole method
 */
Parole.try = function(callback){
    return new Parole(function(resolve){
        resolve(callback())
    })
}


module.exports = Parole;