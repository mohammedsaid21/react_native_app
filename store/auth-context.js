import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DevSettings } from "react-native";


export const AuthContext = createContext({
  token: '',
  isAuthenticated: false,
  authenticate: (token) => { },
  logout: () => { },
  lang: "",
  isLang: false,
  language: ""
});


function AuthContextProvider({ children }) {

  const [authToken, setAuthToken] = useState();
  const [lang, setLang] = useState()

  function authenticate(token) {
    setAuthToken(token);
    AsyncStorage.setItem("token", token)
  }

  function logout() {
    setAuthToken(null);
    AsyncStorage.removeItem("token")
  }

  const changeLanguage = (language) => {
    setLang(language);
    AsyncStorage.setItem("lang", language)
  }

  let language

  const changeTest = async (la) => {
    await AsyncStorage.setItem("lang", la)
      .catch((err) => console.log(err))
  }


  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
    changeLanguage: changeLanguage,
    changeTest: changeTest,
    isLang: !!lang,
    language: language
    // changeLang: changeLang
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

export default AuthContextProvider