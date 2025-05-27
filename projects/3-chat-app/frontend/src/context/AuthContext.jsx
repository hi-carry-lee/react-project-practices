import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("chat-user")) || null
  );

  function handleSetAuthUser(user) {
    setAuthUser(user);
    localStorage.setItem("chat-user", JSON.stringify(user));
  }

  return (
    <AuthContext.Provider value={{ authUser, handleSetAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
