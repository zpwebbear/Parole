const PromiseCustom = require('./PromiseCustom');
const PromiseCustomUpdated = require('./PromiseCustomUpdated');
const PromiseSecond = require('./PromiseSecond');


const testSecond = new PromiseSecond((resolve, reject) => {
    setTimeout(resolve, 1000, 1)
})


testSecond.then(result => {
    console.log('IN UPDATED THEN RESULT', result)
})

testSecond.then(result => {
    console.log('IN UPDATED SECOND THEN RESULT', result)
})