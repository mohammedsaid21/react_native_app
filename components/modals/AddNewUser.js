import { View, Text } from 'react-native'
import React from 'react'
import UserService from '../../services/api/UserService'
import { StyleSheet } from 'react-native'
import { useState } from 'react'
import { useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { Modal } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useRef } from 'react'
import { TextInput } from 'react-native'
import Toast from 'react-native-toast-message';


const AddNewUser = ({ modalNewUser, setModalNewUser, userId, setUserId }) => {

  const [roleType, setRoleType] = useState('')
  const [logingUserName, setLogingUserName] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [canHaveCurrentAccount, setCanHaveCurrentAccount] = useState('')
  const [allowedCountries, setAllowedCountries] = useState([])
  const [country, setCountry] = useState('')
  const [address, setAddress] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [mainMobileNumber, setMainMobileNumber] = useState('')
  const [secondaryMobileNumber, setSecondaryMobileNumber] = useState('')
  const [errors, setErrors] = useState('')

  useEffect(() => {
    if (userId) {
      UserService.getUsersById(userId).then((response) => {
        setRoleType(response.data?.roleType)
        setLogingUserName(response.data?.logingUserName)
        setPassword(response.data?.password)

        setUserName(response.data?.userName)
        setCountry(response.data?.country)
        setAddress(response.data?.address)
        setEmailAddress(response.data?.emailAddress)
        setMainMobileNumber(response.data?.mainMobileNumber)
        setSecondaryMobileNumber(response.data?.secondaryMobileNumber)

      }).catch(error => {
        console.log(error)
      })
    }
    else {
      setUserId(null)
      setRoleType("")
      setLogingUserName("")
      setPassword("")
      setUserName("")
      setCountry("")
      setAddress("")
      setEmailAddress("")
      setMainMobileNumber("")
      setSecondaryMobileNumber("")
      UserService.getAllowedCountries().then((response) => {
        setAllowedCountries(response.data)
        // setModalNewUser(false)
      }).catch(error => {
        console.log(error)
      })
    }
  }, [userId, modalNewUser])

  const handleClose = () => {
    setUserId(null)
    setModalNewUser(false)
    setErrors("")
  };


  const saveOrUpdateUser = (e) => {
    e.preventDefault();
    if (roleType === undefined || roleType === "" ||
      userName === undefined || userName === "" ||
      mainMobileNumber === undefined || mainMobileNumber === "" ||
      country === undefined || country === ""
    ) {
      setErrors("errors");
    }
    else {
      //  setAuth({ user, pwd, accessToken });
      const user = { roleType, logingUserName, password, userName, country, address, emailAddress, mainMobileNumber, secondaryMobileNumber }
      if (userId) {
        UserService.updateUser(userId, user).then((response) => {
          // navigate('/users')
          handleClose()
          Toast.show({
            type: 'success',
            text1: 'Success Update User',
            position: "bottom"
          });
        }).catch(error => {
          console.log(error)
        })
      } else {
        UserService.createUser(user).then((response) => {
          console.log(response.data)
          // navigate('/users');
          handleClose()
          Toast.show({
            type: 'success',
            text1: 'Success Add New User',
            position: "bottom"
          });
        }).catch(error => {
          console.log(error)
        })
      }
    }  //else everything is okay
  }

  let editable = false
  const TypeUserRef = useRef();
  const countriesRef = useRef();

  const title = () => {
    if (userId) {
      return <Text style={styles.modalTitle}>Update User Info</Text>
    } else {
      return <Text style={styles.modalTitle}>Add New User</Text>
    }
  }

  const typeUsers = [
    "ADMIN",
    "ACCOUNTANT",
    "BROKER",
    "MEDIATOR",
    "CLIENT",
  ]

  return (
    <Modal visible={modalNewUser} animationType="slide" transparent={true} >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

          {title()}

          {
            errors !== ""
              ?
              <Text>There Is Error</Text>
              // :
              // statusError !== "" ?
              //   <Text>There Is Status error</Text>
              : ""
          }


          <View style={styles.inputPicker}>
            <Picker
              ref={TypeUserRef}
              selectedValue={roleType}
              onValueChange={(itemValue, itemIndex) => setRoleType(itemValue)}
              mode='dropdown'
              style={{ height: 48 }}
            >
              {
                typeUsers.map((type) =>
                  <Picker.Item label={type} value={type} style={{ fontSize: 13 }} key={Math.ceil(Math.random())} />
                )
              }
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter User Name"
            value={userName}
            onChangeText={(text) => setUserName(text)}
          />

          <View style={styles.inputPicker}>
            <Picker
              ref={countriesRef}
              selectedValue={country}
              onValueChange={(itemValue, itemIndex) => setCountry(itemValue)}
              style={{ height: 48 }}
            >
              {
                allowedCountries.map((allowedCountry) =>
                  <Picker.Item label={allowedCountry.countryName} style={{ fontSize: 13 }} value={allowedCountry.countryName} key={allowedCountry.countryName} />
                )
              }
            </Picker>
          </View>


          <TextInput
            style={styles.input}
            placeholder="Enter Address"
            value={address}
            onChangeText={(text) => setAddress(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Email Address"
            value={emailAddress}
            onChangeText={(text) => setEmailAddress(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Main Mobile Number"
            value={mainMobileNumber.toString()}
            onChangeText={(text) => setMainMobileNumber(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Secondary Mobile Number"
            value={secondaryMobileNumber.toString()}
            onChangeText={(text) => setSecondaryMobileNumber(text)}
          />

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={saveOrUpdateUser}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  )
}

export default AddNewUser



const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginBottom: 10,
    fontSize: 11
  },
  inputPicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10
  },
  disableInput: {
    backgroundColor: "#eee"
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 8,
    marginTop: 10,
    marginHorizontal: 10,
    flex: 1
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
