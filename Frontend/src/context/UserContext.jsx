import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [alluser, setAllUser] = useState([]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [userPresent, setUserPresent] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const userData = await axios.get(
        "http://localhost:8000/api/v1/users/getuser"
      );
      setAllUser(userData.data);
    };

    getUser();
  }, []);

  const login = async (userName, password) => {
    try {
      setLoading(true);
      const userData = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        {
          userName,
          password,
        }
      );

      setUser(userData.data.data.user);
      setUserPresent(true);
      setLoading(false);
    } catch (error) {
      console.log("Login failed:: ", error.message);
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ alluser, user, loading, login , userPresent}}>
      {children}
    </UserContext.Provider>
  );
};
