const PromiseCustom = require('./PromiseCustom');
const PromiseCustomUpdated = require('./PromiseCustomUpdated');
const PromiseSecond = require('./PromiseSecond');


const testSecond = new PromiseSecond((resolve, reject) => {
    setTimeout(resolve, 1000, 1)
})


testSecond.then(result => {
    console.log('IN UPDATED THEN RESULT', result);
    
    return new PromiseSecond((resolve, reject)=>{
        setTimeout(resolve, 2000, '!!!!!!!')
    });
}).then(result =>{
    console.log('IN UPDATED THEN FIRST CHAIN RESULT',result)
}).catch(error => {
    console.error('IN UPDATED CATCH', error)
})

testSecond.then(result => {
    console.log('IN UPDATED SECOND THEN RESULT', result)
})

testSecond.catch(result => {
    console.error('IN UPDATED SECOND CATCH RESULT', result)
})