const fs = require('fs');
const Helper = require('../utils/helper');
const userDB = require('../models/user');
const roleDB = require('../models/role');
const permitDB = require('../models/permit');

const migrate = async () => {
    let data = fs.readFileSync('./migrations/users.json');
    let users = JSON.parse(data)
    users.forEach(async (user) => {

        user.password = Helper.encode(user.password);
        const result = await new userDB(user).save();
        console.log(result);
    })

}
const rpMigrate = async()=>{
    let data = fs.readFileSync('D:/Programming learning/Node_js/Ecommerce/migrations/rolePermit.json');
    let rp = JSON.parse(data);
    rp.roles.forEach(async role=>{
        let result = await new roleDB(role).save();
        console.log(result);
    });
    rp.permits.forEach(async permit=>{
        let result = await new permitDB(permit).save();
        console.log(result);
    })
}
const addOwnerRole = async()=>{
    const dbOwner = await userDB.findOne({phone:"09100100100"});
    const ownerRole = await roleDB.findOne({name:"Owner"});
    await userDB.findByIdAndUpdate(dbOwner._id,{$push:{roles:ownerRole._id}});
}
const backup = async () => {
    const users = await userDB.find();
    fs.writeFileSync('D:/Programming learning/Node_js/Ecommerce/migrations/backups/users.json', JSON.stringify(users));
    console.log("Backed Users Successful");
}
module.exports = {
    migrate,
    backup,
    rpMigrate,
    addOwnerRole
}