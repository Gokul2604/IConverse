import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import UserChatBox from './UserChatBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ScrollableFeed from 'react-scrollable-feed';

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  // const [sender,  setSender] = useState();
  const [isNewGrpVisible, setIsNewGrpVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupUsers, setNewGroupUsers] = useState([]);

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  // getting all the current chats of the user
  // REMEMBER to reload stored chats whenever the window reloads or wheever a new chat/grp is added
  const fetchChats = async() => {
    try {
      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      // console.log(retrievedData.data);
      setChats(data);
    } catch(err) {
      alert("unable to retrieve your chats!");
      return;
    }
  };

  function groupUsers(chat) {
    // setSender(chat.users.map((user1) => {if(user._id !== user1._id) {return user1}}).filter(item => item !== null && item !== undefined)[0]);

    const userExistsInGroup = newGroupUsers.some(user1 => user1._id === chat.users.map((user1) => {if(user._id !== user1._id) {return user1}}).filter(item => item !== null && item !== undefined)[0]._id);
    // console.log(userExistsInGroup);

    if(userExistsInGroup) {
      const updatedUsers = newGroupUsers.filter(user1 => user1._id !== chat.users.map((user1) => {if(user._id !== user1._id) {return user1}}).filter(item => item !== null && item !== undefined)[0]._id);
      // console.log("1", updatedUsers);
      setNewGroupUsers(updatedUsers);
      // document.getElementById(chat._id).style.backgroundColor= "#caf0da";
    } else {
      // console.log(chat.users.map((user1) => {if(user._id !== user1._id) {return user1}}).filter(item => item !== null && item !== undefined)[0]);
      setNewGroupUsers([...newGroupUsers, chat.users.map((user1) => {if(user._id !== user1._id) {return user1._id}}).filter(item => item !== null && item !== undefined)[0]]);
      // document.getElementById(chat._id).style.backgroundColor= "#adefc8";
    }

    const chatElement = document.getElementById(chat._id);
    if (userExistsInGroup) {
      chatElement.style.backgroundColor = "#caf0da";
    } else {
      chatElement.style.backgroundColor = "#adefc8";
    }

    // console.log(newGroupUsers);
  }

  const createGroup = async() => {
    console.log(newGroupUsers, newGroupName);

    try {
      const config = {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const grpObj = {
        name: newGroupName,
        users: JSON.stringify(newGroupUsers)
      };

      await axios.post("/api/chat/group", grpObj, config);

      setIsNewGrpVisible(false);
      window.location.reload();
    } catch(err) {
      setIsNewGrpVisible(false);
      setNewGroupName("");
      setLoggedUser([]);
      alert("Failed to create group!");
      return;
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);

  return (
    <div id='my-chats'>
      <div id='my-chats-nav'>
        <p>My Chats</p>
        <button onClick={() => setIsNewGrpVisible(true)}>Create New Group <FontAwesomeIcon icon="fa-solid fa-plus" className='plus-icon' /></button>
      </div>
      {
        isNewGrpVisible ? 
          <div>
            <div>
              <input onChange={(e) => setNewGroupName(e.target.value)} placeholder="Group Name"></input>
            </div>
            <ScrollableFeed>
              {
                chats.map((chat) => {
                  return chat.isGroupChat ? null : 
                    // <div>{chat.users.map((user1) => {if(user1._id !== user._id) return user1.name})}</div>
                    <UserChatBox key={chat._id} chat={chat} userId={user._id} onClickFn={() => {groupUsers(chat)}}/>
                })
              }
            </ScrollableFeed>
            <div style={{
              justifyContent: "space-between",
              display: "flex",
              width: "90%",
              margin: "auto"
            }}>
              <button onClick={createGroup}>Create Group</button>
              <button onClick={() => {
                setIsNewGrpVisible(false);
                setNewGroupName("");
                setLoggedUser([]);
              }}>Cancel</button>
            </div>
          </div>
        :
          null
      }
      <div>
        {chats.map((chat) => {
          return <UserChatBox key={chat._id} chat={chat} userId={user._id} onClickFn={() => {setSelectedChat(chat)}} />
        })}
      </div>
    </div>
  );
}

export default MyChats;