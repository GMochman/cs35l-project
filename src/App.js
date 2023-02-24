import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './pages/Home';
import CreatePost from './pages/create-post/CreatePost';
import Login from './pages/Login';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from "./firebase-config";
import { useAuthState} from 'react-firebase-hooks/auth';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [user] = useAuthState(auth);
  
  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login";
    });
  };

  return (
  <Router>
    <nav>
      <Link to="/"> Home </Link>

      {!user ? (
        <Link to="/login"> Login </Link>
      ) : (
        <Link to="/createpost"> Add Review </Link>
      )}

      <div className='user'>
        {user && (
          <>
            <div>{user?.displayName}</div>
            <img src={user?.photoURL || ""} height="30px" width="30px" alt=""/>
            <button onClick={signUserOut}> Log Out </button>
          </>
      )}
      </div>

    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/createpost" element={<CreatePost />} />
      <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
    </Routes>
  </Router>
  );
}

export default App;