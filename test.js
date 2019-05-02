
const Parole = require('./Parole');

const test = new Parole((resolve)=>{
    setTimeout(resolve, 1000, 1)
}).then(result =>{
    console.log('THEN', result)
    return new Parole((resolve)=>{
        setTimeout(resolve, 1000, 1 + result)
    })
}).then(result => {
    console.log('THIRD', result)
})
