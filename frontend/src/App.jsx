import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Feed from './pages/Feed.jsx'
import Login from './pages/Login.jsx'
import Friends from './pages/Friends.jsx'
import Messages from './pages/Messages.jsx'
import Register from './pages/Register.jsx'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/friends' element={<Friends />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App