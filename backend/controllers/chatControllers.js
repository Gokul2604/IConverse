const Chat = require('../Models/chatModel');
const asyncHandler = require("express-async-handler");
const User = require('../Models/userModel');

const accessChat = asyncHandler(async(req, res) => {
    const { userId } = req.body;

    if(!userId) {
        console.log("User Id not sent with the request body!");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat:false,
        $and: [
            // { users:{ $elemMatch:{ $eq:req.user._id } } },
            // { users:{ $elemMatch:{ $eq:userId } } },
            { users:{ $in:[req.user._id] } },
            { users:{ $in:[userId] } },
        ],
    }).populate("users", "-password").populate("latestMessage"); // populating the users array with all the info except the password
    // console.log(isChat);

    isChat = await User.populate(isChat, {
        path:'latestMessage.sender',
        select:'name email pic',
    });
    // console.log(isChat);

    if(isChat.length > 0) {
        res.send(isChat[0]);
        // console.log("1");
    } else {
        // console.log("0");
        var chatData = {
            chatName:'sender',
            isGroupChat:false,
            users:[req.user._id, userId],
        }

        try {
            const createdChat = await Chat.create(chatData);

            const fullChat = await Chat.findOne({ _id:createdChat._id }).populate("users", "-password");

            res.status(200).send(fullChat);
        } catch(err) {
            res.status(400);
            throw new Error(err.message);
        }
    }
});

const fetchChats = asyncHandler(async(req, res) => {
    try {
        Chat.find({ users:{ $elemMatch:{ $eq:req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt:-1 })
        .then(async(chats) => {
            chats = await User.populate(chats,  {
                path:'latestMessage.sender',
                select:'name email pic',
            });
            res.status(200).send(chats);
        });
    } catch(err) {
        res.status(400);
        throw new Error(err.message);
    }
});

const createGroup = asyncHandler(async(req, res) => {
    if(!req.body.users || !req.body.name) {
        return res.status(400).send({ message:'Please enter all the fields!' });
    }

    var users = JSON.parse(req.body.users);

    if(users.length < 2) {
        return res.status(400).send('More than 2 users are needed for a Group Chat');
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName:req.body.name,
            isGroupChat:true,
            users:users,
            groupAdmin:req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id:groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch(err) {
        res.status(400);
        throw new Error(err.message);
    }
});

const renameGroup = asyncHandler(async(req, res) => {
    const { chatId, newName } = req.body;

    const updatedGroup = await Chat.findByIdAndUpdate(
        chatId, {
            chatName:newName,
        }, {
            new:true,
        }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!updatedGroup) {
        res.status(404);
        throw new Error('Chat Not Found!');
    } else {
        res.json(updatedGroup);
    }
});

const removeFromGroup = asyncHandler(async(req, res) => {
    const {chatId, userId } = req.body;

    const updatedGroup = await Chat.findByIdAndUpdate(
        chatId, {
            $pull:{ users:userId },
        }, {
            new:true,
        }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!updatedGroup) {
        res.status(404);
        throw new Error('Group Not Found!');
    } else {
        res.json(updatedGroup);
    }
});

const addToGroup = asyncHandler(async(req, res) => {
    const { chatId, userId } = req.body;

    const updatedGroup = await Chat.findByIdAndUpdate(
        chatId, {
            $push:{ users:userId },
        }, {
            new:true,
        }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!updatedGroup) {
        res.status(404);
        throw new Error('Group Not Found!');
    } else {
        res.json(updatedGroup);
    }
});

module.exports = { accessChat, fetchChats, createGroup, renameGroup, removeFromGroup, addToGroup };