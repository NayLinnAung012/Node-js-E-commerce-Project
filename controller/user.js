const userDB = require('../models/user');
const roleDB = require('../models/role');
const permitDB = require('../models/permit');
const Helper = require('../utils/helper');
const register = async (req, res, next) => {
    const userEmail = await userDB.findOne({ email: req.body.email });
    if (userEmail) {
        next(new Error("This email is already in used."));
        return;
    }
    const userPhone = await userDB.findOne({ phone: req.body.phone });
    if (userPhone) {
        next(new Error("This Phone number is already in used."));
        return;
    }
    req.body.password = Helper.encode(req.body.password);
    const result = await new userDB(req.body).save();
    Helper.fMsg(res, "User Register Successfully", result);
}
const login = async (req, res, next) => {
    const userDb = await userDB.findOne({ phone: req.body.phone }).populate('roles permits').select('-__v');
    if (userDb) {
        // const userPassword = await userDB.findOne({password:req.body.password});
        if (Helper.compare(req.body.password, userDb.password)) {
            let user = userDb.toObject();
            delete user.password;
            user.token = Helper.makeToken(user);
            Helper.set(user._id, user);
            Helper.fMsg(res, "Login Successfully", user);
        } else {
            next(new Error("Credential Error!"));
        }
    } else {
        next(new Error("Credential Error!"))
    }
}
const addRole = async (req, res, next) => {
    let dbUser = await userDB.findById(req.body.userId);
    let dbRole = await roleDB.findById(req.body.roleId);
    let foundRole = dbUser.roles.find(rid => rid.equals(dbRole._id));
    if (foundRole) {
        next(new Error("Role already exit"));
    } else {
        await userDB.findByIdAndUpdate(dbUser._id, { $push: { roles: dbRole._id } });
        let user = await userDB.findById(dbUser._id);
        Helper.fMsg(res, "Added Role to User", user);
    }

}
const removeRole = async (req, res, next) => {
    let dbUser = await userDB.findById(req.body.userId);
    let foundRole = dbUser.roles.find(rid => rid.equals(req.body.roleId));
    if (foundRole) {
        await userDB.findByIdAndUpdate(dbUser._id, { $pull: { roles: req.body.roleId } });
        Helper.fMsg(res, "Removed Role");
    } else {
        next(new Error("This role doesn't exit"));
    }
}
const addPermit = async (req, res, next) => {
    let dbUser = await userDB.findById(req.body.userId);
    let dbPermit = await permitDB.findById(req.body.permitId);
    let foundPermit = dbUser.permits.find(rid => rid.equals(dbPermit._id));
    if (foundPermit) {
        next(new Error("Permit already exit"));
    } else {
        await userDB.findByIdAndUpdate(dbUser._id, { $push: { permits: dbPermit._id } });
        let user = await userDB.findById(dbUser._id);
        Helper.fMsg(res, "Added permit to User", user);
    }

}
const removePermit = async (req, res, next) => {
    let dbUser = await userDB.findById(req.body.userId);
    let foundPermit = dbUser.permits.find(rid => rid.equals(req.body.permitId));
    if (foundPermit) {
        await userDB.findByIdAndUpdate(dbUser._id, { $pull: { permits: req.body.permitId } });
        Helper.fMsg(res, "Removed Permit");
    } else {
        next(new Error("This permit doesn't exit"));
    }
}

module.exports = {
    register,
    login,
    addRole,
    removeRole,
    addPermit,
    removePermit

}