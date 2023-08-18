import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { redirect } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notif, setNotif] = useState([]);
    
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log(userInfo);
        setUser(userInfo);

        if(!userInfo) {
            redirect("/");
        }
    }, []);

    return <ChatContext.Provider value={ { user, setUser, selectedChat, setSelectedChat, chats, setChats, notif, setNotif } }>{children}</ChatContext.Provider>
};

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;