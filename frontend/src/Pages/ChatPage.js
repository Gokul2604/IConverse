import React from 'react';
import { ChatState } from '../context/ChatProvider';
import SidePopup from '../components/SidePopup';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';

function ChatPage() {
  // const [ user, setUser ] = useState();
  // const { userInfo } = ChatState();

  // useEffect(() => {
  //   // const { userInfo } = ChatState();
  //   setUser(userInfo);
  // }, [userInfo]);

  const { user } = ChatState();

  return (
    <div style={{width:"100%"}}>
      {/* Side Pop-up component */}
      { user && <SidePopup /> }

      <div id="chat-box">
        {/* Component to display all the chats (LEFT) */}
        { user && <MyChats /> }

        {/* Component to display a single chat / Group (RIGHT) */}
        { user && <ChatBox /> }
      </div>
    </div>
  );
}

export default ChatPage;