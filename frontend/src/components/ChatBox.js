import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ChatState } from '../context/ChatProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ClickOutsideDiv from './ClickOutsideDiv';
import UserBox from './UserBox';
import ScrollableChat from './ScrollableChat';

import io from 'socket.io-client';
import ScrollableFeed from 'react-scrollable-feed';

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [isDescVisible, setIsDescVisible] = useState(false);
  const [isRenameVisible, setIsRenameVisible] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [grpName, setGrpName] = useState("");
  const [newName, setnewName] = useState("");

  const { selectedChat, user, chats, notif, setNotif } = ChatState();

  const fetchChats = async() => {
    if(!selectedChat) return;

    try {
      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

      setAllMessages(data);

      socket.emit("joinChat", selectedChat._id)
    } catch(err) {
      alert("Error in retrieving messages!");
      return;
    }
  };

  useEffect(() => {
    setAllMessages([]);
    fetchChats();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => {setSocketConnected(true)})
  }, []);

  const sendMessage = async() => {
    if(!message) {
      alert("The message field is blank!");
      return;
    }

    try {
      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`,
          "Content-type":"Application/json",
        },
      };

      setMessage(""); // clears the message input field

      const { data } = await axios.post("/api/message", {
        content: message,
        chatId: selectedChat._id,
      }, config);

      // console.log(data);
      socket.emit("newMessage", data);
      setAllMessages([...allMessages, data]);
      // console.log(allMessages);
    } catch (err) {
      alert("Message cannot be sent!");
      return;
    }
  };

  useEffect(() => {
    socket.on("messageReceived", (newMessageReceived) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if(!notif.includes(newMessageReceived)) setNotif([newMessageReceived, ...notif]);
      } else{
        setAllMessages([...allMessages, newMessageReceived]);
      }
    });
  });

  const closeDesc = () => {
    if(isDescVisible) {
      setIsDescVisible(false);
      setIsRenameVisible(false);
      localStorage.setItem("firstClick", "0");
    } 
  };

  const toggleDesc = () => {
    setIsDescVisible(!isDescVisible);
  };

  const renameGroup = async() => {
    if(newName) {
      try {
        const config = {
          headers:{
            "Content-type": "Application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }

        const chatId = selectedChat._id;

        const { data } = await axios.put("/api/chat/rename", { chatId:chatId, newName:newName }, config);

        setGrpName("");
        setIsRenameVisible(false);
        setIsDescVisible(false);
        setnewName("");

        window.location.reload();
        // console.log(data);
      } catch(err) {
        alert("Failed to change name!");
        return;
      }
    } else {
      alert("The name field is blank!");
      return;
    }
  }

  // const sender = selectedChat.users.map((user1) => {if(user1._id !== user._id) return user1});

  if(selectedChat) {
    return (
      <div id='chat'>
        <div id='chat-nav'>
          <p className="chat-name">{selectedChat.isGroupChat ? selectedChat.chatName.toUpperCase() : selectedChat.users.map((user1) => {if(user1._id !== user._id) return user1.name.toUpperCase()})}</p>
          <button onClick={toggleDesc}><FontAwesomeIcon icon="fa-solid fa-info" /></button>
        </div>
        {
          selectedChat.isGroupChat ? 
            isDescVisible && 
            <ClickOutsideDiv onClickOutside={closeDesc}>   
              <div className="desc" style={{zIndex: "1"}}>
                <div className="desc-nav">
                  <button className='close-btn' onClick={toggleDesc}><FontAwesomeIcon icon="fa-solid fa-x" className='close-icon' /></button>
                  <h2>{selectedChat.isGroupChat ? selectedChat.chatName : selectedChat.users.map((user1) => {if(user1._id !== user._id) return user1.name})}</h2>
                </div>
                <hr></hr>
                <div id='group-desc-1'>Group Participants</div>
                <hr></hr>
                <div className='grp-participants'><ScrollableFeed className='grp-ppl'>{
                  selectedChat.users.map((user1) => {
                    if(user1._id !== user._id) {
                      return <UserBox key={user1._id} user={user1} />
                    }
                  })
                }</ScrollableFeed></div>
                {
                  selectedChat.isGroupChat && user._id === selectedChat.groupAdmin._id ? 
                    <footer className='admin-btns'>
                      <div><button onClick={() => {setIsRenameVisible(true); setGrpName(selectedChat.chatName)}}>Rename Group</button></div>
                      {
                        isRenameVisible ? <div>
                          <input defaultValue={grpName} onChange={(e) => {setnewName(e.target.value);}}></input>
                          <button onClick={renameGroup}>Rename</button>
                          <button onClick={() => {setIsRenameVisible(false); setnewName(""); setGrpName("")}}>Cancel</button>
                        </div> : null
                      }
                      {/* <div><button>Add Participant(s)</button></div>

                      <div><button>Remove Participant(s)</button></div> */}
                    </footer>
                  :
                    null
                }
              </div>
            </ClickOutsideDiv> : isDescVisible && 
            <ClickOutsideDiv onClickOutside={closeDesc}>   
              <div className="desc" style={{zIndex: "1"}}>
                <div className="desc-nav">
                  <button className='close-btn' onClick={toggleDesc}><FontAwesomeIcon icon="fa-solid fa-x" className='close-icon' /></button>
                </div>
                <img src={selectedChat.users.map((user1) => {if(user1._id !== user._id) return user1.pic})} id="profile-pic" alt={selectedChat.users.map((user1) => {if(user1._id !== user._id) return user1.pic})}></img>
                <div id='profile-desc'>
                  <div className='desc-div'>{selectedChat.users.map((user1) => {if(user1._id !== user._id) return user1.name})}</div>
                  <div className='desc-div'>{selectedChat.users.map((user1) => {if(user1._id !== user._id) return user1.email})}</div>
                </div>
              </div>
            </ClickOutsideDiv>
        }
        <div id='chat-win'>
          <ScrollableChat messages={allMessages} />
        </div>
        <div id='chat-ip'>
          <input value={message} placeholder='Type in your message here...' onChange={(e) => {setMessage(e.target.value)}}></input>
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    );
  } else { 
    return (<div id='chat-placeholder'>
      Click On A User To Start Chatting
      </div>
    );
  }
  
  // return (
  //   <div id='chat'>
  //     {
  //       selectedChat ? <div>
  //           ChatBox
  //         </div>
  //       : <div>
  //         Click On A User To Start Chatting
  //       </div>
  //     }
  //   </div>

    // <div className='chat'>ChatBox</div>
  // );
}

export default ChatBox;
