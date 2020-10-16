const mongoose = require('mongoose');


const chatSchema = new mongoose.Schema({
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }
});


const chatModel = mongoose.model('ChatRoom', chatSchema);


const findRoomByUsers = async(usrs) => {
    let room = await chatModel.findOne({users: {$all: usrs}});
    if(room)
        return room;
    room = await chatModel.create({users: usrs});
    return room;
}

const checkIfRoomExists = async (usrs) => {
    const room = await chatModel.findOne({users: {$all: usrs}});

    if(room)
        return { _id: room._id, exists: true};
    return { exists: false };
}
module.exports = { findRoomByUsers, checkIfRoomExists };