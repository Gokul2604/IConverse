import React from 'react';

const MessageBox = ({ user, message }) => {
  console.log(user._id, message.sender._id);
  return (
    <div className='message-box' style={{position: 'relative', justifyContent: user._id === message.sender._id ? "right" : "left", zIndex: "0"}}>
        {message.chat.isGroupChat && message.sender._id !== user._id ? <div
          style={{
            fontSize: "10px",
            height: "10px",
            position: 'absolute',
            top: -15,
            left: 15,
            padding: '4px'
          }}
        >
          {message.sender.name}
        </div> : null}
      <div>
          {/* <div style={{fontSize: "10px", height: "10px"}}>{message.sender.name}</div> */}
          <div className='msg' style={
            {
              backgroundColor: user._id === message.sender._id ? "#8ceab3" : "#beedf5"
            }}>{message.content}</div>
      </div>
    </div>
  )
}

export default MessageBox;