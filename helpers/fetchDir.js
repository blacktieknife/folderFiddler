const fs = require('fs');
const promisify = require('util').promisify;
const readDirAsync = promisify(fs.readdir);

module.exports = async (path) => {
    const dirResults = await readDirAsync(path);
    return dirResults;
};
