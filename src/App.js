import React, { useState } from 'react';
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import { signOut } from 'firebase/auth';
import { auth } from "./firebase-config";
import { useAuthState} from 'react-firebase-hooks/auth';
import Dropdown from "./components/Dropdown"

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [user] = useAuthState(auth);
  
  const options = [ {value: "most_recent", label: "Most Recent"}, 
  {value: "least_recent", label: "Least Recent"}, 
  {value: "most_liked", label: "Most Liked"},
  {value: "least_liked", label: "Least Liked"} ];

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
      <Link to="/createpost"> Add Review </Link>

      {isAuth ?
      (<div className='user'>
        <div>{user?.displayName}</div>
        <img src={user?.photoURL || ""} height="30px" width="30px" alt=""/>
      </div>
      ) : (
        <div></div>
      )}

      {!isAuth ?(<Link to="/login"> Login </Link> 
      ) : (
      <>
      <Link to="/createpost"> Add Review </Link>
      <button onClick={signUserOut}> Log Out </button>
      </>
      )}
    </nav>
    <Routes>
      <Route path="/" element={<Home isAuth={isAuth} />} />
      <Route path="/createpost" element={<CreatePost isAuth={isAuth} />} />
      <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
    </Routes>
    <Dropdown placeHolder={"Sort by..."} options={options}/>
  </Router>
  );
}

export default App;