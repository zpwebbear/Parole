const C = require('./lib/constants');

function defaultFn(value){
    return value
}

function Parole(initialCallback) {

    var _deferedCallbacks = [];

    // function callLater(chainFunction){
    //     return function(callback){
    //         return new Parole(function(resolve){
    //             _deferedCallbacks.push(resolve(chainFunction()(callback)))
    //         })
    //     }
    // }

    // function callLater(chainFunction){
    //     console.log('chainFunction', chainFunction)
    //     return 
    // }

    const callLater = getMember => {
        return callback => {
            return new Parole(resolve => {
                _deferedCallbacks.push(() => resolve(getMember()(callback)))
            });
        }
    }
    
    function _tryCall(callback){
        function innerCallback(){
            return callback(this._result)
        }
        return Parole.try(innerCallback.bind(this))
    }

    var tryCall = _tryCall.bind(this)
  
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
                    then: callLater(() => {
                        return this.then}
                        ),
                    catch: callLater(() => this.catch)
                }
                break;
        }

        Object.assign(this, newState);
    }

    var changeState = _changeState.bind(this)

    function _apply(state, value){
        if (this._state === C.PENDING){
            this._result = value;
            // console.log('PAROLE APLLY', this._result)
            changeState(state)
            // console.log('PAROLE APLLY CHANGE STATE', this)
            // console.log('PAROLE _deferedCallbacks', _deferedCallbacks)
            _deferedCallbacks.forEach(function(cb){
                if (cb){
                    console.dir(cb)
                    cb()
                }
            })
        }
    }
    

    function _makePromiseCallback(state){
        return function(value){
            // console.log('PAROLE  _makePromiseCallback', this, state, value)
            var apply = _apply.bind(this)
            if (value instanceof Parole && state === C.RESOLVED){
                // console.log('PAROLE _makePromiseCallback inner', this, state, value)
                value.then(function(value){
                    apply(C.RESOLVED, value)
                })
                value.catch(function(value){
                    apply(C.REJECTED, value)
                })
            }else if(value){
                apply(state, value)
            }
            // console.log('_makePromiseCallback after', this, state, value)
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