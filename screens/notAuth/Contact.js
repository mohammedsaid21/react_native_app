import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import InputNative from '../../components/UI/InputNative'
import { useState } from 'react'

const Contact = () => {
  const [inputValues, setInputValues] = useState({
    username: "",
    password: "",
    // username: "",
    // password: "",
  })

  const inputChangedHandler = (inputIdentifier, enteredValue) => {
    setInputValues((curInputValues) => {
      return {
        ...curInputValues,
        [inputIdentifier]: enteredValue
      }
    })
  }

  /* 
    <Button 
      title="open mail"
      onPress={() => Linking.openURL("mailto: support@expo.io")}
      />
  */

  return (
    <View>
      <Text>Talk to the contact person</Text>
      <Text>Have any question ? lorem asjkldsa asd jkasdja sa skadsklk lasdkl askdklads sax</Text>
      <View style={{ paddingTop: 15, paddingHorizontal: 15 }}>
        <InputNative
          label="enter your name"
          // placeholder={i18n.t("login_username_input")}
          // ref={inputUserRef}
          textInputConfig={{
            keyboardInputConfig: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, 'username'),
            value: inputValues.username
          }}
        />

        <InputNative
          label="enter your email"
          // placeholder={i18n.t("login_password_input")}
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
        // onPress={loginIn}
        />

      </View>
    </View>
  )
}

export default Contact


const styles = StyleSheet.create({

})