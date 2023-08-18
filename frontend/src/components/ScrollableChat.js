import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import MessageBox from './MessageBox';
import { ChatState } from '../context/ChatProvider';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <div className='scrollable-chat'>
    <ScrollableFeed className='scrollable-chat'>
      {messages && messages.map((message, index) => {
        return <MessageBox key={index} user={user} message={message} />
      })}
    </ScrollableFeed>
    </div>
  );
};

export default ScrollableChat;