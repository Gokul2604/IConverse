const asyncHandler = require("express-async-handler");
const Message = require('../Models/messageModel');
const User = require('../Models/userModel');
const Chat = require('../Models/chatModel');

const sendMessage = asyncHandler(async(req, res) => {
    const { content, chatId } = req.body;

    if(!content || !chatId) {
        console.log("Invalid data passed to the request");
        return res.sendStatus(400);
    }

    const newMessage = {
        sender:req.user._id,
        content:content,
        chat:chatId,
    }

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path:'chat.users',
            select:'name pic email',
        });
        console.log(message);

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

        res.json(message);
    } catch(err) {
        res.status(400);
        throw new Error(err.message);
    }
});

const getMessages = asyncHandler(async(req, res) => {
    try {
        const messages = await Message.find({chat:req.params.chatId})
            .populate("sender", "name pic email")
            .populate("chat");

        res.json(messages);
    } catch(err) {
        res.status(400);
        throw new Error(err.message);
    }
});

module.exports = { sendMessage, getMessages };