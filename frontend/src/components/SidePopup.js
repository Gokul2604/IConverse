import React, { useState } from 'react';
import axios from 'axios';
import UserBox from './UserBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChatState } from '../context/ChatProvider';
import ClickOutsideDiv from './ClickOutsideDiv';
import ScrollableFeed from 'react-scrollable-feed';
// import { redirect } from "react-router-dom";

const SidePopup = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isNotifVisible, setIsNotifVisible] = useState(false);

  localStorage.setItem("firstClick", "0");

  const { user, setSelectedChat, chats, setChats, notif, setNotif } = ChatState();

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
    if(!isPopupVisible) setSearchResult([]);
  };

  const toggleProfile = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  const toggleNotif = () => {
    setIsNotifVisible(!isNotifVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  const closePopup = () => {
    if(isPopupVisible) {
      setIsPopupVisible(false);
      setSearchResult([]);
      localStorage.setItem("firstClick", "0");
    } 
    if(isProfileVisible) {
      setIsProfileVisible(false);
      localStorage.setItem("firstClick", "0");
    }
    if(isNotifVisible) {
      setIsNotifVisible(false);
      localStorage.setItem("firstClick", "0");
    }
  };

  const handleSetSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = async() => {
    if(!search) {
      alert("The search field is blank!");
      return;
    }

    // console.log(search);
    try {
      const config = {
        headers: {
          Authorization:`Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      // console.log(data);
      setSearchResult(data);
    } catch(err) {
      alert("Unable to search for users!");
      return;
    }
  };

  const accessChat = async(userId) => {
    // closing the SidePopup
    setIsPopupVisible(false);
    setSearchResult([]);
    localStorage.setItem("firstClick", "0");

    // start the chat in the ChatBox component
    // console.log(userId);
    const config = {
      headers:{
        "Content-type":"application/json",
        Authorization:`Bearer ${user.token}`,
      },
    };

    const { data } = await axios.post("/api/chat", { userId }, config);

    if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
    setSelectedChat(data);
  };

  return (
    <div id="nav-bar">
      <div className="search-bar">
        {/* Search Bar */}
        {/* <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className='search-icon'/>
        <input
          type="text"
          value={search}
          id='search-user'
          onChange={setSearch}
          placeholder="Search for users"
        /> */}
        <button id='search-user-btn' onClick={togglePopup}><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className='search-icon'/>Search User</button>
        {
          isPopupVisible && 
          (<ClickOutsideDiv onClickOutside={closePopup}>       
            <div className="popup" style={{zIndex: "1"}}>
              <div className="popup-nav">
                {/* <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className='search-icon'/> */}
                <input
                  type="text"
                  id='search-user-ip'
                  onChange={handleSetSearch}
                  placeholder="Search for users"
                />
                <button className='search-btn' onClick={handleSearch}><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className='search-icon'/></button>
                <button className='close-btn' onClick={togglePopup}><FontAwesomeIcon icon="fa-solid fa-x" className='close-icon' /></button>
              </div>
              <div className='user-results'>
                {searchResult.map((user1) => {
                  return <UserBox key={user1._id} user={user1} onClickFn={() => {accessChat(user1._id)}} />
                })}
              </div>
            </div>
          </ClickOutsideDiv>)
        }
      </div>

      <div className="title">
        {/* Title */}
        ICon verse
      </div>

      <div id="notif-profile">
        {/* Profile */}
        <button onClick={toggleNotif} className='notif-btn'><FontAwesomeIcon icon="fa-solid fa-bell" className='notif-icon'/></button>
        {
          isNotifVisible && 
          <ClickOutsideDiv onClickOutside={closePopup}>   
            <div className="notif" style={{zIndex: "1"}}>
              <div className="notif-nav" style={{justifyContent: "space-between"}}>
                <button className='close-btn' onClick={toggleNotif}><FontAwesomeIcon icon="fa-solid fa-x" className='close-icon' /></button>
                <button className='clear-btn' onClick={() => {setNotif([])}} style={{padding: "10px"}}>Clear</button>
              </div>
              <ScrollableFeed>
                {notif.map((notification) => {
                  return <div style={{cursor: "pointer"}} onClick={() => {setNotif(notif.filter(n => n != notification)); setSelectedChat(notification.chat)}}>New Message from {notification.sender.name}</div>
                })}
              </ScrollableFeed>
            </div>
          </ClickOutsideDiv>
        }

        <button onClick={toggleProfile} className='profile-btn'><FontAwesomeIcon icon="fa-solid fa-user" className='profile-icon'/></button>
        {
          isProfileVisible && 
          <ClickOutsideDiv onClickOutside={closePopup}>   
            <div className="profile" style={{zIndex: "1"}}>
              <div className="profile-nav">
                <button className='close-btn' onClick={toggleProfile}><FontAwesomeIcon icon="fa-solid fa-x" className='close-icon' /></button>
              </div>
              <img src={user.pic} id="profile-pic" alt={user.name}></img>
              <div id='profile-desc'>
                <div className='desc-div'>{user.name}</div>
                <div className='desc-div'>{user.email}</div>
              </div>
              
              <footer>
                <button onClick={handleLogout}>Logout</button>
              </footer>
            </div>
          </ClickOutsideDiv>
        }
      </div>
    </div>
  );
}

export default SidePopup;