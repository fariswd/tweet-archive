const fs = require('fs')

//return object
const loadJson = ({ fileName }) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
      if (err) {
        if (err.code == 'ENOENT') {
          saveAsJson({ content: [], fileName })
          .then(res => {
            resolve([])
          })
          .catch(err => {
            reject(err)
          })
        } else {
          reject(err)
        }
      } else {
        if (data) {
          const objectifyData = JSON.parse(data)
          resolve(objectifyData)
        } else {
          saveAsJson({ content: [], fileName })
          .then(res => {
            resolve([])
          })
          .catch(err => {
            reject(err)
          })
        }
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

const saveAsCsv = ({ content, fileName }) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, content, 'utf-8', (err) => {
      if (err) {
        reject(err)
      }
      else {
        resolve('success')
      }
    })
  })
}

const loadCsv = ({ fileName }) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
      if (err) {
        if (err.code == 'ENOENT') {
          saveAsCsv({ content: '', fileName })
            .then(res => {
              resolve('')
            })
            .catch(err => {
              reject(err)
            })
        } else {
          reject(err)
        }
      } else {
        if (data) {
          resolve(data)
        } else {
          saveAsCsv({ content: '', fileName })
          .then(res => {
            resolve('')
          })
          .catch(err => {
            reject(err)
          })
        }
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
    saveAsCsv,
    loadCsv,
}