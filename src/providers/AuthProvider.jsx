import React, { createContext, useState, useContext } from "react";
import { useLocalStorage } from "../hooks";
import { validateOtp } from "../services";
import { setupAuthHeaders } from "./utils/setupAuthHeaders";

const AuthContext = createContext(null);

const initialLoginStatus = {
  isUserLoggedIn: false,
  userId: null,
  accessToken: null,
  phoneNumber: null,
};

export const AuthProvider = ({ children }) => {
  const [storedLoginStatus, setStoredLoginStatus] = useLocalStorage(
    "projectHeroInternalLogin",
    initialLoginStatus
  );

  const [user, setUser] = useState(storedLoginStatus);
  // const [user, setUser] = useState({
  //   isUserLoggedIn: true,
  //   userId: "61a47f6990832d0016b4e209",
  //   accessToken: null,
  //   phoneNumber: "+918828453483",
  // }); //dummy for testing
  const { isUserLoggedIn, userId } = user;

  const loginUser = (user) => {
    const { accessToken, _id, phoneNumber } = user;
    setUser((prevUser) => ({
      ...prevUser,
      isUserLoggedIn: true,
      accessToken,
      userId: _id,
      phoneNumber: phoneNumber,
    }));

    setStoredLoginStatus({
      isUserLoggedIn: true,
      accessToken,
      userId: _id,
      phoneNumber: phoneNumber,
    });
  };

  setupAuthHeaders(user.accessToken);
  // setupAuthHeaders(`cHJvamVjdEhlcm9CYXNlQWRtaW46VDNNR0FXM1NHRzgyWkREVQ===`);

  function logout() {
    localStorage.removeItem("projectHeroInternalLogin");
    setUser(initialLoginStatus);
  }

  const loginByOtp = async (phoneNumber, otp) => {
    try {
      const res = await validateOtp(phoneNumber, otp);
      if (res?.data?.success) {
        loginUser(res?.data?.data);
      }
      return res;
    } catch (error) {
      console.log(error.message);
      return {
        data: {
          error: "Something went wrong",
        },
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loginByOtp,
        logout,
        isUserLoggedIn,
        userId,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
