const C = require('./lib/constants');

function defaultFn(value){
    return value
}

function Parole(initialCallback) {
    function _tryCall(callback){
        function innerCallback(){
            return callback(this._result)
        }
        return Parole.try(innerCallback.bind(this))
    }

  
    function _changeState(state){
        var newState = {}

        switch (state){
            case C.RESOLVED:
                newState =  {
                    _state: C.RESOLVED,
                    then: _tryCall,
                    catch: defaultFn
                }
                break;
            case C.REJECTED:
                newState = {
                    _state: C.RESOLVED,
                    then: defaultFn,
                    catch: _tryCall,
                }
                break;
            default:
                newState = {
                    _state: C.PENDING,
                }
                break;
        }

        Object.assign(this, newState);
    }

    var changeState = _changeState.bind(this)

    function _makePromiseCallback(state){
        return function(value){
            this._result = value;
            changeState(state)
        }
    }
   

    var _resolve = _makePromiseCallback(C.RESOLVED);

    var _reject = _makePromiseCallback(C.REJECTED);

    var resolve = _resolve.bind(this)

    var reject = _reject.bind(this)

    changeState(C.PENDING);

    try{
        initialCallback(resolve, reject)
    } catch (error){
        _reject(error)
    }
}


Parole.resolve = function(value) {
    return new Parole(function(resolve){
        resolve(value)
    })
}

Parole.reject = function(value) {
    return new Parole(function(undefined, reject){
        reject(value)
    })
}

Parole.try = function(callback){
    return new Parole(function(resolve){
        resolve(callback())
    })
}


module.exports = Parole;