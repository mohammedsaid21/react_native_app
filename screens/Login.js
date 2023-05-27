import { View, Text, Button, Alert, StyleSheet, Image, ImageBackground, I18nManager, ToastAndroid } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import InputNative from '../components/UI/InputNative'
import { fetchExpenses, getRequest } from '../util/http';
import axios from "axios";
import { AuthContext } from '../store/auth-context';
import LoadingOverlay from "../components/UI/LoadingOverlay"
import { useDispatch } from 'react-redux';
import { authenticate } from '../store/projectSlice';
import { apiClient } from "../services/ApiClient"
import { authService } from '../services/auth/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImgLogo from "../assets/ghalbanNlogo.png"
import { getLocales } from 'expo-localization';
import i18n from '../I18N';
import * as Localization from 'expo-localization';
import Toast from 'react-native-toast-message';

const Login = ({ navigation }) => {
  let defaultValue = false;

  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const authCTPtovider = useContext(AuthContext)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('header_login_label'),
      headerTitleAlign: 'center',
    })
  }, [navigation]);

  const [inputValues, setInputValues] = useState({
    username: defaultValue ? "admin" : "",
    password: defaultValue ? "pass" : "",
    // username: "",
    // password: "",
  })
  const [isValid, setIsValid] = useState(false)

  const inputChangedHandler = (inputIdentifier, enteredValue) => {
    setInputValues((curInputValues) => {
      return {
        ...curInputValues,
        [inputIdentifier]: enteredValue
      }
    })
  }
  const inputUserRef = useRef();
  const inputPassRef = useRef();

  const loginIn = () => {
    console.log(inputUserRef)
    // inputUserRef.current.blur();
    // inputPassRef.current.blur();
    if (!inputValues.username || !inputValues.password) {
      // Alert.alert("Invalid Input");
      setIsValid(true)
      Toast.show({
        type: 'error',
        text1: 'please enter data',
        position: "bottom"
      });
    } else {
      setIsValid(false);
      let username = inputValues.username.charAt(0).toLowerCase() + inputValues.username.slice(1);
      let password = inputValues.password.charAt(0).toLowerCase() + inputValues.password.slice(1);
      // console.log({ username, password })
      // inputRef.current.blur();
      apiClient.signIn({ username, password })
        .then((res) => {
          if (res.access_token) {
            console.log(res.user, res.access_token, res.refresh_token);
            authCTPtovider.authenticate(res.access_token);
            authService.login(res.user, res.access_token, res.refresh_token)
            setIsAuthenticating(true)
            Toast.show({
              type: 'success',
              text1: 'Success Login',
              position: "bottom"
            });
          }
          else {
            console.log("🚀 LoginPage.js:41:~ username, password ", inputValues.username, inputValues.password)
            // ToastAndroid.show('Bad Info', ToastAndroid.BOTTOM);
            Toast.show({
              type: 'error',
              text1: 'There Is Error in your Data',
              position: "bottom"
            });
            authService.logout();
          }
        })
        .catch((err) => {
          setIsValid(true)
          console.log("Falied Authenticate ", err)
          setIsAuthenticating(false)
          // Alert.alert("Authentication Falied!", err)
        })
    }
  }


  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in..." />;
  }

  return (
    <ImageBackground source={require('../assets/background_dot.png')} resizeMode="repeat" style={{ flex: 1, paddingTop: 80, backgroundColor: "#fff" }}>
      {/* <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 100, backgroundColor: "#fff" }}> */}
      <Image source={ImgLogo} style={{ width: "100%", height: 90, resizeMode: 'contain' }} />

      <View style={{ paddingTop: 15, paddingHorizontal: 15 }}>
        <InputNative
          label={i18n.t("login_username_label")}
          placeholder={i18n.t("login_username_input")}
          invalid={isValid}
          // ref={inputUserRef}
          textInputConfig={{
            keyboardInputConfig: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, 'username'),
            value: inputValues.username
          }}
        />

        <InputNative
          label={i18n.t("login_password_label")}
          placeholder={i18n.t("login_password_input")}
          invalid={isValid}
          // ref={inputPassRef}
          password={true}
          textInputConfig={{
            keyboardInputConfig: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, 'password'),
            value: inputValues.password
          }}
        />

        <Button
          title='login in'
          onPress={loginIn}
        />

      </View>

    </ImageBackground>
  )
}

export default Login

