import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path='/' element={<HomePage />}></Route>
          <Route exact path='/chats' element={<ChatPage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
library.add(fab, fas, far)