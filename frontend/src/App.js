
// import { Button } from '@chakra-ui/react';
import { Routes,Route } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div className='app'>
      <Routes>
      <Route exact  path="/" element={<Homepage/> }/>
      <Route exact path="/chats" element={<ChatPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
