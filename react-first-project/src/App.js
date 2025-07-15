import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Form from './Form';



function App() {
   const [isLoggedIn, setIsLoggedIn] = useState(false); 
  
  return (
    <Router>
      <div className="app-container">
      <Routes>
  <Route path="/" element={isLoggedIn ? <Navigate to="/Home" /> : <Navigate to="/Login" />} />
  <Route path="/form" element={<Form />} />
  <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
  <Route path="/Register" element={<Register/>} />
  <Route path="/Home" element={isLoggedIn ? <Home /> : <Navigate to ="/Login"/>}></Route>
</Routes>
 </div>
    </Router>
  );
}

export default App;
