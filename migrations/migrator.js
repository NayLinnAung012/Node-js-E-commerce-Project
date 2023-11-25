const fs = require('fs');
const Helper = require('../utils/helper');
const userDB = require('../models/user');

const migrate = async()=>{
    let data = fs.readFileSync('./migrations/users.json');
    let users = JSON.parse(data)
    users.forEach(async(user)=>{
        
        user.password = Helper.encode(user.password);
        const result = await new userDB(user).save();
        console.log(result);
    })
    
}
const backup = async()=>{
    const users = await userDB.find();
    console.log(users);
    fs.writeFileSync('D:/Programming learning/Node_js/Ecommerce/migrations/backups/users.json',JSON.stringify(users));
    console.log("Backed Users Successful");
}
module.exports = {
    migrate,
    backup
}