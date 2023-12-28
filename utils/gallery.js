const fs = require('fs');
let saveSingleFile = async (req, res, next) => {
    let fileName = req.files.file.name;
    fileName = new Date().valueOf() + "-" + fileName;
    req.files.file.mv(`./uploads/${fileName}`);
    req.body["image"] = fileName;
    next();
}

let saveMultipleFile = async (req, res, next) => {
    let fileNames = [];
    req.files.files.forEach(file => {
        let fileName = new Date().valueOf() + "-" + file.name;
        fileNames.push(fileName);
        file.mv(`./uploads/${fileName}`);
    });
    req.body["images"] = fileNames;
    next();
}

let deleteFile = async (fileName) => {
    let filePath = `./uploads/${fileName}`;
    await fs.unlinkSync(filePath);
}

let deleteMultipleFile = async (fileNames) => {
    fileNames.forEach(async fileName => {
        await deleteFile(fileName);
    });
}

module.exports = {
    saveSingleFile,
    saveMultipleFile,
    deleteFile,
    deleteMultipleFile
}
