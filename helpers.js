const fs = require('fs')

//return object
const loadJson = ({ fileName }) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                const objectifyData = JSON.parse(data)
                resolve(objectifyData)
            }
        })
    })
}

//require content object
const saveAsJson = ({ content, fileName }) => {
    const stringifyContent = JSON.stringify(content, null, 4)
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, stringifyContent, 'utf-8', (err) => {
            if (err) {
                reject(err)
            }
            else {
                resolve('success')
            }
        })
    })

}

const isEmpty = (obj) => {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


module.exports = {
    isEmpty,
    saveAsJson,
    loadJson,
}