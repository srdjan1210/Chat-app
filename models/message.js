const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: String,
    date: {
        type: mongoose.Schema.Types.Date,
        default: Date.now()
    },
    image: String
});

const messageModel = mongoose.model('message', messageSchema);

const loadMessages = async (roomId, n) => {
    const messages = await messageModel.find({chatId: roomId}).populate('author', 'img _id').sort({ $natural: -1 }).skip(n).limit(15);
    for(let message of messages)
        if(message.image != null)
            message = await messageModel.populate(message, 'author');
    return messages;
}

const saveMessages = async ( messages, usersIds, sender, receiver ) => {
    for(let message in messages){
        messageModel.insert({
            usersIds,
            sender, 
            receiver,
            content: message.content,
        });
    }
}

const saveMessage = async (data, userIds, room) => {
    const message = new messageModel({ chatId: room._id, content: data.message, author: data.ownerId});
    await message.save();
    let populatedMessage = await messageModel.populate(message, 'author');

    if(populatedMessage)
        return populatedMessage;
    return null;  
}

const savePicture = async (userIds, image, room) => {
    const newMessage = new messageModel({chatId: room._id, image, author: userIds[0]});
    const saved = await newMessage.save();
    let populatedImageMessage = await messageModel.populate(newMessage, 'author');
    if(populatedImageMessage)
        return populatedImageMessage;
    return null;
};


module.exports = { saveMessages, saveMessage, loadMessages, savePicture };