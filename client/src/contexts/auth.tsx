import React, { createContext, useState } from "react";
import { User } from "../types/util/user";

interface AuthContextType {
  onLogin: (token: string, user: User) => void;
  onLogOut: () => void;
  onRefresh: () => void;
  token: string | null;
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({
  onLogin: (token: string, user: User) => {},
  onLogOut: () => {},
  onRefresh: () => {},
  token: null,
  user: null,
});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const tokenID = React.useId();
  const userID = React.useId();

  const [localToken, setLocalToken] = useState(
    localStorage.getItem(tokenID) || null
  );
  const [localUser, setLocalUser] = useState<AuthContextType['user']>(
    localStorage.getItem(userID)
      ? JSON.parse(localStorage.getItem(userID)!)
      : null
  );

  const onLogin = (token: string, user: User) => {
    localStorage.setItem(tokenID, token);
    setLocalToken(token);

    localStorage.setItem(userID, JSON.stringify(user));
    setLocalUser(user);
  };

  const onLogOut = () => {
    localStorage.removeItem(tokenID);
    setLocalToken("");
  };

  const onRefresh = () => {};

  return (
    <AuthContext.Provider
      value={{
        token: localToken,
        onLogin,
        onLogOut,
        onRefresh,
        user: localUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

export default AuthProvider;
