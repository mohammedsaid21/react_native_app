import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'

const InputNative = ({ label, style, invalid, placeholder, textInputConfig, password }) => {

  const inputStyles = [styles.input];


  useEffect(() => {

    if (textInputConfig && textInputConfig.multiline) {
      inputStyles.push(styles.inputMultiline)
    }

    if (invalid) {
      inputStyles.push(styles.invalidInput)
    }
  }, [invalid, textInputConfig])


  return (
    <View style={[styles.inputContainer, style]}>
      <Text style={[styles.label, invalid && styles.invalidLable]}>{label}</Text>
      <TextInput style={inputStyles} {...textInputConfig} placeholder={placeholder} secureTextEntry={password} />
    </View>
  )
}

export default InputNative


const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  label: {
    fontSize: 11,
    color: "#000",
    marginBottom: 4,
    paddingHorizontal: 2
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#111",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    fontSize: 13,
    marginBottom: 5
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top'
  },
  invalidInput: {
    backgroundColor: "#f99",
  },
  invalidLable: {
    color: "#f99",
  }
})