import React, { useEffect } from 'react';
import { ChatState } from '../context/ChatProvider';

const UserChatBox = ({ chat, userId, onClickFn }) => {
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    // console.log(chat);
    // console.log(chat.users.map((user) => {if(user._id === userId) {return null} else {return user.pic}}).filter(element => {return element !== undefined && element !== null;}));

    return (
        <div id={chat._id} className='user-chat-box' onClick={onClickFn} style={selectedChat && chat._id === selectedChat._id ? {backgroundColor: "#8ceab3"} : null}>
            {chat.isGroupChat ? null : (<img src={chat.users.map((user) => {if(user._id === userId) {return null} else {return user.pic}}).filter(element => {return element !== undefined && element !== null;})[0]} className="ucb-pic" />)}
            <p className="ucb-name">{chat.isGroupChat ? chat.chatName : chat.users.map((user) => {if(user._id !== userId) return user.name})}</p>
        </div>
    );
}

export default UserChatBox;