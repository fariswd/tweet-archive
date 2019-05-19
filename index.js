const parseArchive = require('./lib')

const pathHtml = './raw_data/Cindy Yuvia (@Cindvia_JKT48)   Twitter.html'
const username = 'Cindvia_JKT48'
const fileName = 'result.json'
const option = {
    save: true,
    continue: false, //if true will add data (continue adding)
    saveAs: 'json',
}

parseArchive({
    pathHtml,
    username,
    fileName,
    option,
})
