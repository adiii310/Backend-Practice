import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [login, setLogin] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        {
          userName: username,
          password: password,
        },
        { withCredentials: true }
      );

      console.log(response.data);
      setLogin(true);
    } catch (error) {
      alert("wrongg username or password");
      console.error("Login failed:", error.response.data);
    }
  };

  const currentUser = async () => {
    const respones = await axios.post(
      "http://localhost:8000/api/v1/users/current-user",
      {},
      { withCredentials: true }
    );
    console.log(respones.data.data.user);
    setUser(respones.data.data.user);
  };

  const handleLogout = async () => {
    const respones = await axios.post(
      "http://localhost:8000/api/v1/users/logout",
      {},
      { withCredentials: true }
    );
    setLogin(false)
  };
  return (
    <>
      <input
        type="text"
        name="username"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {login ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button type="submit" onClick={handleSubmit}>
          Login
        </button>
      )}

      <button onClick={currentUser}>Current User {user.fullName}</button>
    </>
  );
}

export default App;
