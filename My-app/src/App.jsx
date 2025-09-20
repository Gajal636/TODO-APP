

import React from 'react'
import TodoWithMongo from './components/TodoWithMongo'
import Register from './components/Register'
import Login from './components/Login'
import { createBrowserRouter , Route, RouterProvider, Routes } from 'react-router-dom'

const App = () => {


  return (
    <div>
     <Routes>
     <Route path="/register" element={<Register/>}/>
     <Route path="/login" element={<Login/>}/>
     <Route path="/" element={<TodoWithMongo/>}/>
     </Routes>

    
    </div>
  )
}

export default App

