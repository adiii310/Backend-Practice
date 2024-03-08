import { useEffect, useState, useContext } from "react";
import { UserContext } from "./context/UserContext.jsx";
import Login from "./components/login/Login";
import Cookies from "react-cookie"

import "./App.css";

function App() {
  const { user ,loading } = useContext(UserContext);
  const token = Cookies.get('accessToken');

if (token) {
  // The user is logged in.
  console.log(token)
} else {
  console.log("cookei not present")
}

  if(loading) return <div> Loading....</div>
  return (
    <>
      <Login />
      {user && <div>welcome {user.userName}</div>}
    </>
  );
}

export default App;
