
const PromiseCustom = require('./PromiseCustom');


const testSecond = new PromiseCustom((resolve, reject) => {
    setTimeout(resolve, 1000, 1)
})


testSecond.then(result => {
    console.log('IN UPDATED THEN RESULT', result);
    // return 2
    return new PromiseCustom((resolve, reject)=>{
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


const testNative = new Promise((resolve, reject) => {
    setTimeout(resolve, 1000, 1)
})


testNative.then(result => {
    console.log('IN UPDATED THEN RESULT', result);
    // return 2
    return new Promise((resolve, reject)=>{
        setTimeout(resolve, 2000, '!!!!!!!')
    });
}).then(result =>{
    console.log('IN UPDATED THEN FIRST CHAIN RESULT',result)
}).catch(error => {
    console.error('IN UPDATED CATCH', error)
})

testNative.then(result => {
    console.log('IN UPDATED SECOND THEN RESULT', result)
})

testNative.catch(result => {
    console.error('IN UPDATED SECOND CATCH RESULT', result)
})
