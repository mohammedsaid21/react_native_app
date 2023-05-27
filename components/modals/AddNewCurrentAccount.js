import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Modal } from 'react-native'
import CurrentAccountService from '../../services/api/CurrentAccountService'
import UserService from "../../services/api/UserService"
import { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Picker } from '@react-native-picker/picker'
import { TextInput } from 'react-native'
import moment from 'moment'
import { TouchableOpacity } from 'react-native'

const AddNewCurrentAccount = ({ userId, setUserId, modalNewCurrent, setModalNewCurrent, accountId, setAccountId, setIsLoading }) => {

  const handleCloseModal = () => {
    setUserId(null)
    setAccountId(null)
    setAccountCurrency(null)
    setClientId(null)
    setModalNewCurrent(false)
    setErrors("")
  }

  const [clientId, setClientId] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [accountCurrency, setAccountCurrency] = useState('')
  const [balance, setBalance] = useState(0)
  const [activationDate, setActivationDate] = useState('')
  const [clientAllowedForCurrentAccounts, setClientAllowedForCurrentAccounts] = useState([]);

  const [errors, setErrors] = useState('');
  const [statusError, setStatusError] = useState('')
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    setBalance(0);
    // con date = new Date();
    setActivationDate(new Date());
    //yyyy-MM-dd'T'HH:mm:ss.SSSZ
    //  Moment().format(activationDate, 'MMMM Do YYYY, h:mm:ss a');

    if (accountId) {
      CurrentAccountService.getCurrentAccountById(accountId)
        .then((response) => {
          setClientId(response.data.clientId)
          setFirstName(response.data.firstName)
          setLastName(response.lastName)
          setBalance(response.data.balance)
          setAccountCurrency(response.data.accountCurrency)
          setActivationDate(response.data.activationDate)
        }).catch(error => {
          console.log(error)
        })
    }
    else {
      UserService.getClientsAllowedForCurrentAccounts()
        .then((response) => {
          setClientAllowedForCurrentAccounts(response.data)
          const userL = [];
          // console.log(response.data.length);
          for (var i = 0; i < response.data.length; i++) {
            userL.push({ name: response.data[i].userName, value: response.data[i].id })
          }
          // console.log(userL);
          setUsersList(userL);
        })
    }
  }, [userId, accountId, modalNewCurrent])


  const saveOrUpdateCurrentAccountTransaction = (e) => {
    e.preventDefault();
    if (clientId === undefined || clientId === "" ||
      accountCurrency === undefined || accountCurrency === ""
    ) {
      setErrors("errors");
    }
    else {
      const currentAccount = { clientId, firstName, lastName, accountCurrency, balance, activationDate }
      if (userId) {
        CurrentAccountService.updateCurrentAccount(accountId, currentAccount)
          .then((response) => {
            setUserId(null)
            setModalNewCurrent(false)
            setIsLoading(true)
            // navigate('/currentAccounts')
          }).catch(error => {
            console.log(error)
          })
      }
      else {
        CurrentAccountService.createCurrentAccount(currentAccount)
          .then((response) => {
            setModalNewCurrent(false)
            setIsLoading(true)
            // console.log(response.data)
            // navigate('/currentAccounts');
          }).catch(error => {
            alert(error);
          })
      }
    }//else everything is okay
  }

  const title = () => {
    if (accountId) {
      return <Text style={styles.modalTitle}>Update Account</Text>
    } else {
      return <Text style={styles.modalTitle}>Add New Account</Text>
    }
  }
  const accountCurrencys = useRef();
  const chooseUser = useRef();

  let editable = false

  return (
    <Modal visible={modalNewCurrent} animationType="slide" transparent={true} >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

          {title()}
          {
            errors !== ""
              ?
              <Text>There Is Error</Text>
              :
              statusError !== "" ?
                <Text>There Is Status error</Text>
                : ""
          }


          <View style={styles.inputPicker}>
            <Picker
              ref={chooseUser}
              style={{ height: 50 }}
              mode='dropdown'
              selectedValue={clientId}
              onValueChange={(itemValue, itemIndex) => setClientId(itemValue)}>
              <Picker.Item label={"اختر العميل"} value={"اختر العميل"} />
              {
                usersList?.map((el) =>
                  <Picker.Item label={el.name} value={el.value} key={el.value} style={{ fontSize: 13 }} />
                )
              }

            </Picker>
          </View>

          <View style={styles.inputPicker}>
            <Picker
              mode='dropdown'
              style={{ height: 50 }}
              ref={accountCurrencys}
              selectedValue={accountCurrency}
              onValueChange={(itemValue, itemIndex) => setAccountCurrency(itemValue)}
            >
              <Picker.Item label={"choose currency "} value={"choose currency"}
                style={{ fontSize: 13 }} />
              <Picker.Item label={"EUR"} value={"EUR"} />
              <Picker.Item label={"USD"} value={"USD"} />
              <Picker.Item label={"Israeli Shekel"} value={"ILS"} />
              <Picker.Item label={"Jordanian Dinar"} value={"JOD"} />
              <Picker.Item label={"Egypt Pound"} value={"EGP"} />
              <Picker.Item label={"Turkish Lira"} value={"TRY"} />
              <Picker.Item label={"Arab Emirates Dinar"} value={"AED"} />
            </Picker>
          </View>

          <TextInput
            style={[styles.input, !editable && styles.disableInput]}
            // placeholder="Current Account" 
            // value={currentAccountId}
            // value={`${HelperUtil.getCurrencyNameLocale(currentAccount.accountCurrency)}} ::: ${currentAccount.userName}`}
            value={balance.toString()}
            keyboardType="numeric"
            editable={editable}
          />

          <TextInput
            style={[styles.input, { width: "100%", fontSize: 12 }, !editable && styles.disableInput]}
            placeholder="Date Move Created"
            editable={editable}
            value={moment(activationDate).format('MMMM Do YYYY, h:mm:ss a')}
          />


          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={saveOrUpdateCurrentAccountTransaction}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  )
}

export default AddNewCurrentAccount


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
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 10,
    fontSize: 11
  },
  inputPicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 0,
    paddingHorizontal: 0,
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
