const {
    parseArchive,
    convertToCsv,
} = require('./lib')

const pathHtml = './raw_data/Cindy Yuvia (@Cindvia_JKT48)   Twitter.html'
const username = 'Cindvia_JKT48'
const fileName = 'result.json'
const option = {
    save: true,
    continue: true, //if true will add data (continue adding)
    saveAs: 'json',
}

if(process.argv[2] == 'convert_to_csv') {
    convertToCsv({
        fileName
    })
} else {
    parseArchive({
        pathHtml,
        username,
        fileName,
        option,
    })
}
