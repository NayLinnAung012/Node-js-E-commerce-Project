const MessageDB = require('../models/message');
const UnreadDB = require('../models/unread');
const helper = require('./helper');
const liveUser = async (socketId, user) => {
    user["socketId"] = socketId;
    helper.set(socketId, user._id);
    helper.set(user._id, user);
}

let initialize = async (io, socket) => {
    socket["currentUserId"] = socket.userData._id;
    liveUser(socket.id, socket.userData);
    socket.on('message', data => incommingMessage(io, socket, data));
}
const incommingMessage = async (io, socket, data) => {
    // const jsonData = JSON.parse(data);
    let jsonData;
    if (typeof data === 'string') {
        try {
            jsonData = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            // Handle the error or return an appropriate response
            return;
        }
    } else {
        jsonData = data; // If it's already an object, use it as is
    }

    const dbMessage = await new MessageDB(jsonData).save();

    // const dbMessage = await new MessageDB(jsonData).save();
    const msgResult = await MessageDB.findById(dbMessage._id).populate('from to', 'name _id');
    const toUser = await helper.get(msgResult.to._id);

    if (toUser) {
        let toSocket = io.of('/chat').to(toUser.socketId);
        if (toSocket) {
            toSocket.emit('message', msgResult);
            // console.log(msgResult.to);
        } else {
            next(new Error("To Socket not found"));
        }
    } else {
        await new UnreadDB({ from: msgResult.from._id, to: msgResult.to._id }).save();
    }
    socket.emit('message', msgResult);
}


module.exports = {
    initialize
}