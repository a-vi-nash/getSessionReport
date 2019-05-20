const fs = require('fs'),
    path = require('path');


//get time difference in seconds
module.exports.getTimeDiff = (stDate, endDate) => {
    let diff = new Date(endDate) - new Date(stDate);
    return diff / 1000;
}


//read json file into memory
module.exports.readfileToMemory = (filename) => {
    return require(`../files/${filename}`);
};



module.exports.writeToFile = (data,fileName) => {
    fs.writeFileSync(path.join(__dirname, "../files/",fileName), data)
};

