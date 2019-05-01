const PromiseCustom = require('./PromiseCustom');

const testCustom = new PromiseCustom((resolve, reject)=>{
    setTimeout(resolve, 1000, 1)
})

testCustom.then(result =>{
    console.log('result from custom then', result)
    return 'to second custom';
}).then(result =>{
    console.log('result from custom second then', result)
})

testCustom.then(result =>{
    console.log('result from custom then second subscribe', result)
    return 'to second custom';
}).then(result =>{
    console.log('result from custom then second subscribe', result)
})


console.log(testCustom)


// console.log('+'.repeat(20))


// testNative.then(result =>{
//     console.log('result from native then', result)
//     return 'to second native';
// })
// .then(result =>{
//     console.log('result from native second then', result)
// })
// console.log(testNative)


// console.log('+'.repeat(20))

// simpleNative.then(result =>{
//     console.log('result from simple native', result)
// })
// console.log(simpleNative)