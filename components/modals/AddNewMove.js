import { View, Text } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Modal } from 'react-native'
import { TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native';
import { Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CurrentAccountService from '../../services/api/CurrentAccountService';
import CurrentAccountTransactionService from '../../services/api/CurrentAccountTransactionService';
import { authService } from '../../services/auth/AuthService';
import HelperUtil from "../../helper/HelperUtil"
import Moment, { format } from 'moment';

// import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { ScrollView } from 'react-native';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IconWithLabel from '../UI/IconWithLabel';


const AddNewMove = ({ modalVisible, setModalVisible, setIsLoading, userId, setUserId, accountId, setAccountId, }) => {

  let id = userId

  const [accountCurrency, setAccountCurrency] = useState('')
  const [allowedStatuses, setAllowedStatuses] = useState([])
  const [executionDate, setExecutionDate] = useState('')
  const [userNameAccount, setUserNameAccount] = useState("")

  const [currentAccountId, setCurrentAccountId] = useState('')
  const [createdByUserId, setCreatedByUserId] = useState('')
  const [editedByUserId, setEditedByUserId] = useState('')
  const [createdByUserName, setCreatedByUserName] = useState('')
  const [createdByLoginName, setCreatedByLoginName] = useState('')
  const [statusChangeDate, setStatusChangeDate] = useState('')
  const [reasonForCancelling, setReasonForCancelling] = useState('')
  const [reasonForReactivation, setReasonForReactivation] = useState('')
  const [transactionType, setTransactionType] = useState('')
  const [transactionAmount, setTransactionAmount] = useState('')
  const [transactionStatus, setTransactionStatus] = useState('')

  const [imageUri, setImageUri] = useState(null);

  const [errors, setErrors] = useState('')
  const [statusError, setStatusError] = useState('')
  // const [notes, setNotes] = useState('')
  const [noteTransaction, setNoteTransaction] = useState('');

  const handleCloseModal = () => {
    setModalVisible(false);
    setUserId(null)
    id = null
    setCurrentAccountId("")
    setCreatedByUserId("")
    setCreatedByUserName("")
    setCreatedByLoginName("")
    setTransactionStatus("")
    setStatusChangeDate("")
    initialiseAllowedStatuses("")
    setReasonForReactivation("")
    setReasonForCancelling("")
    setTransactionAmount("")
    setTransactionType("")
    setExecutionDate("")
    setAccountCurrency("")
    fetchCurrentAccounts("")
    setAccountId(null)
    setUserNameAccount("")
    setImageUri(null)
    setNoteTransaction("")
  };

  const initialiseAllowedStatuses = (trStatus) => {
    if (trStatus == 'ACTIVE') {
      allowedStatuses.push('ACTIVE')
      allowedStatuses.push('CANCELLED')
      // setAllowedStatuses(['ACTIVE', 'CANCELLED']);
    }
    else if (trStatus == 'CANCELLED') {
      allowedStatuses.push('CANCELLED')
      allowedStatuses.push('REACTIVATED')
      //setAllowedStatuses(['CANCELLED', 'REACTIVATED']);
    }
    else if (trStatus == 'REACTIVATED') {
      allowedStatuses.push('REACTIVATED')
      allowedStatuses.push('CANCELLED')
      // setAllowedStatuses(['REACTIVATED', 'CANCELLED'])
    }
    // alert(allowedStatuses);
  }


  useEffect(() => {
    setEditedByUserId(authService.currentUserValue.id);

    setExecutionDate(new Date());
    if (accountId) {
      console.log("account Id: ", accountId)
      CurrentAccountService.getCurrentAccountById(accountId)
        .then((response) => {
          console.log(response.data)
          setCurrentAccountId(response.data.id)
          setAccountCurrency(response.data.accountCurrency)
          fetchCurrentAccounts(response.data.accountCurrency)
          setUserNameAccount(response.data.userName)
          setNoteTransaction(response.data.notes)
        }).catch(error => {
          console.error(error)
        })
    }
    else if (id) {
      console.log("id: ", id)
      CurrentAccountTransactionService.getCurrentAccountTransactionById(id)
        .then((response) => {
          console.log(response.data)
          setCurrentAccountId(response.data.currentAccountId)
          setCreatedByUserId(response.data.createdByUserId)
          setCreatedByUserName(response.data.createdByUserName)
          setCreatedByLoginName(response.data.createdByLoginName)
          setTransactionStatus(response.data.transactionStatus)
          setStatusChangeDate(response.data.statusChangeDate)
          initialiseAllowedStatuses(response.data.transactionStatus)
          setReasonForReactivation(response.data.reasonForReactivation)
          setReasonForCancelling(response.data.reasonForCancelling)
          setTransactionAmount(response.data.transactionAmount)
          setTransactionType(response.data.transactionType)
          setExecutionDate(response.data.executionDate)
          setAccountCurrency(response.data.accountCurrency)
          fetchCurrentAccounts(response.data.accountCurrency)
          setUserNameAccount(response.data.userName)
          setNotes(response.data.notes)
        }).catch(error => {
          console.error(error)
        })
    }

    if (id === null || id === undefined) {
      setCreatedByLoginName(authService.currentUserValue.username);
      // console.log("create from Auth (login name) ")
    }

  }, [accountId, id, modalVisible])

  const fetchCurrentAccounts = (currency) => {
    // console.log("Hey Ahmed");
    // console.log(currency); //getCurrentAccountsOfSpecificCurrency
    setAccountCurrency(currency);
    // CurrentAccountService.getCurrentAccountsOfSpecificCurrency(currency)
    //   .then((response) => {
    //     setCurrentAccounts(response.data)
    //   })
  }

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      // let content = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
      // setImageUri(`data:image/png;base64,${content}`);
      setImageUri(result.assets[0].uri);
    }
  }


  const saveOrUpdateCurrentAccountTransaction = (e) => {
    e.preventDefault();
    //something missing
    if (currentAccountId === undefined || currentAccountId === "" || transactionType === undefined || transactionType === ""
      || transactionAmount === undefined || transactionAmount === "") {
      setErrors("errors");
      console.log(errors)
    }
    else if (
      (transactionStatus === 'REACTIVATED' && (reasonForReactivation == "" || !reasonForReactivation))
      || (transactionStatus === 'CANCELLED' && (reasonForCancelling == "" || !reasonForCancelling))) {
      setStatusError("errors");
      console.log(statusError)
    }
    else {
      console.log("Add move" + authService.currentUserValue.id)
      const currentAccountTransaction = {
        currentAccountId, createdByUserId, createdByUserName, createdByLoginName, editedByUserId,
        transactionType, transactionAmount, transactionStatus, reasonForCancelling, reasonForReactivation,
        executionDate, notes: noteTransaction
      }
      // console.log("🚀 ~ file: AddNewMove.js:196 currentAccountTransaction:", currentAccountTransaction)

      if (id) {
        console.log("Update with id: ", id)
        // console.log(transactionProof);
        CurrentAccountTransactionService.updateCurrentAccountTransaction(id, currentAccountTransaction)
          .then((response) => {
            // setUserId(null)
            handleCloseModal()
            setIsLoading(true)
            // navigate('/currentAccountTransactions/' + currentAccountId);
          }).catch(error => {
            console.log(error)
          })
      } else {
        CurrentAccountTransactionService.createCurrentAccountTransaction(currentAccountTransaction)
          .then((response) => {
            // setUserId(null)
            console.log("done save move ")
            setModalVisible(false)
            handleCloseModal()
            setIsLoading(true)
            // navigate('/currentAccountTransactions/' + currentAccountId);
          }).catch(error => {
            console.log(error)
          })
      }
    } //else everything is entered
  }


  const generateStatusDropDownListText = (trStatus) => {
    if (trStatus === 'ACTIVE') {
      return 'current_account_transactio_status_active'
    }
    else if (trStatus === 'CANCELLED') {
      return 'current_account_transactio_status_cancelled'

    }
    else if (trStatus === 'REACTIVATED') {
      return 'current_account_transactio_status_reactivated'
    }
  }

  const pickerRef = useRef();
  const TypeMoveRef = useRef();

  const title = () => {
    if (id) {
      return <Text style={styles.modalTitle}>Update Value</Text>
    } else {
      return <Text style={styles.modalTitle}>Add New Account</Text>
    }
  }

  let editable = false


  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true} >
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

          <TextInput
            style={[styles.input, !editable && styles.disableInput]}
            placeholder="Current Account"
            // value={currentAccountId}
            // value={`${HelperUtil.getCurrencyNameLocale(currentAccount.accountCurrency)}} ::: ${currentAccount.userName}`}
            value={`${accountCurrency} ::: ${userNameAccount}`}
            editable={editable}
          />

          {/* <TextInput
            style={styles.input}
            placeholder="Status Move"
            value={statusMove}
            onChangeText={(text) => setStatusMove(text)}
          /> */}

          {transactionStatus != "" && transactionStatus ?
            <View style={styles.inputPicker}>
              <Picker
                mode='dropdown'
                ref={pickerRef}
                selectedValue={transactionStatus}
                onValueChange={(itemValue, itemIndex) => setTransactionStatus(itemValue)}>
                {
                  allowedStatuses.map((transState) =>
                    <Picker.Item label={transState} value={transState} key={transState} />
                  )
                }
              </Picker>
            </View>
            :
            <View style={styles.inputPicker}>
              <Picker
                mode='dropdown'
                ref={pickerRef}
                selectedValue={transactionStatus}
                onValueChange={(itemValue, itemIndex) => setTransactionStatus(itemValue)}>
                <Picker.Item label={"ACTIVE"} value={"ACTIVE"} />
              </Picker>
            </View>
          }

          <View style={styles.inputPicker}>
            <Picker
              mode='dropdown'
              ref={TypeMoveRef}
              selectedValue={transactionType}
              onValueChange={(itemValue, itemIndex) => setTransactionType(itemValue)}>
              <Picker.Item label={"اختر نوع الحركة"} value={"اختر نوع الحركة"} />
              <Picker.Item label={"ايداع"} value={"DEPOSIT"} />
              <Picker.Item label={"سحب"} value={"WITHDRAW"} />
            </Picker>
          </View>

          {/* <TextInput
            style={styles.input}
            placeholder="Type Move"
            value={typeMove}
            onChangeText={(text) => setTypeMove(text)}
          /> */}

          <TextInput
            style={styles.input}
            placeholder="Value Move"
            value={transactionAmount}
            onChangeText={(text) => setTransactionAmount(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Note Transaction"
            value={noteTransaction}
            onChangeText={(text) => setNoteTransaction(text)}
          />

          <TextInput
            style={[styles.input, { width: "100%", fontSize: 12 }, !editable && styles.disableInput]}
            placeholder="Date Move Created"
            editable={editable}
            value={Moment(executionDate).format('MMMM Do YYYY, h:mm:ss a')}
          />

          {/* <View style={styles.buttons}> */}
          <TextInput
            style={[styles.input, { width: "100%", fontSize: 12 }, !editable && styles.disableInput]}
            placeholder="Date Move Created"
            // value={dateCreated}
            onChangeText={(text) => setCreatedByLoginName(text)}
            editable={editable}
            value={createdByLoginName}
          />
          {/* </View> */}

          <View style={{ justifyContent: 'center', alignItems: 'center', }}>
            <TouchableOpacity style={[styles.input, { width: "100%", flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", paddingHorizontal: 25 }]} onPress={pickImage} >
              <Text style={{ color: "#a0a0a0", fontSize: 11 }}>Drop Img Here</Text>
              <View style={{
                backgroundColor: '#4285F4aa', width: 28, height: 28, borderRadius: 50,
                justifyContent: 'center', alignItems: 'center'
              }}>
                <Ionicons name="image-outline" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            {imageUri && (
              <Image source={{ uri: imageUri }} style={{ width: "100%", height: 200, resizeMode: 'cover' }} />
            )}
          </View>


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

export default AddNewMove

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
    paddingHorizontal: 8,
    marginBottom: 10,
    fontSize: 12
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
