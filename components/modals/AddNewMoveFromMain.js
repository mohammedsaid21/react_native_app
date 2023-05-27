import { View, Text } from 'react-native'
import React from 'react'
import { useState } from 'react'
import CurrentAccountTransactionService from '../../services/api/CurrentAccountTransactionService'
import { authService } from '../../services/auth/AuthService'
import CurrentAccountService from '../../services/api/CurrentAccountService'
import { StyleSheet } from 'react-native'
import moment from 'moment'
import { useEffect } from 'react'
import { useRef } from 'react'
import { Modal } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

const AddNewMoveFromMain = ({ id, addMove, setAddMove, accountId, setAccountId, idUpdate, setIdUpdated, setIsLoading }) => {
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
  const [notes, setNotes] = useState('')

  const handleCloseModal = () => {
    setAddMove(false);
    // setUserId(null)
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
    allowedStatuses.splice(0, allowedStatuses.length);
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
    if (accountId) {
      CurrentAccountService.getCurrentAccountById(accountId)
        .then((response) => {
          setUserNameAccount(response.data.userName)
          setCurrentAccountId(response.data.id)
          setAccountCurrency(response.data.accountCurrency)
          fetchCurrentAccounts(response.data.accountCurrency)
          setExecutionDate(new Date());
        }).catch(error => {
          console.log(error)
        })
      // console.log(accountId);
    }
    else if (id) {
      console.log("Id df ", id)
      CurrentAccountTransactionService.getCurrentAccountTransactionById(id)
        .then((response) => {
          // console.log(response.data)
          setUserNameAccount(response.data.accountHolderName)
          setCurrentAccountId(response.data.currentAccountId)
          setCreatedByUserId(response.data.createdByUserId)
          setCreatedByUserName(response.data.createdByUserName)
          setCreatedByLoginName(response.data.createdByLoginName)
          setNotes(response.data.notes)
          setTransactionStatus(response.data.transactionStatus)
          setStatusChangeDate(response.data.statusChangeDate)
          // console.log("Date:", response.data.statusChangeDate)
          // setExecutionDate(response.data.executionDate)
          initialiseAllowedStatuses(response.data.transactionStatus)
          setReasonForReactivation(response.data.reasonForReactivation)
          setReasonForCancelling(response.data.reasonForCancelling)
          setTransactionAmount(response.data.transactionAmount)
          setTransactionType(response.data.transactionType)
          setAccountCurrency(response.data.accountCurrency)
          fetchCurrentAccounts(response.data.accountCurrency)
        }).catch(error => {
          console.log(error)
        })
    }

    if (id === null || id === undefined) {
      setCreatedByLoginName(authService.currentUserValue.username);
    }
  }, [accountId, addMove])


  const saveOrUpdateCurrentAccountTransaction = (e) => {
    e.preventDefault();
    //something missing
    if (currentAccountId === undefined || currentAccountId === "" || transactionType === undefined || transactionType === ""
      || transactionAmount === undefined || transactionAmount === "") {
      setErrors("errors");
    }
    else if (
      (transactionStatus === 'REACTIVATED' && (reasonForReactivation == "" || !reasonForReactivation))
      || (transactionStatus === 'CANCELLED' && (reasonForCancelling == "" || !reasonForCancelling))) {
      setStatusError("errors");
    }

    else {

      console.log("Add move Main " + authService.currentUserValue.id)
      const currentAccountTransaction = {
        currentAccountId, createdByUserId, createdByUserName, createdByLoginName, editedByUserId,
        transactionType, transactionAmount, transactionStatus, reasonForCancelling, reasonForReactivation, executionDate, notes
      }

      if (id) {
        // console.log("Update with id", id, transactionProof)

        CurrentAccountTransactionService.updateCurrentAccountTransaction(id, currentAccountTransaction)
          .then((response) => {
            // navigate('/currentAccountTransactions/' + currentAccountId);
            handleCloseModal()
            setIsLoading(true)
          }).catch(error => {
            console.log(error)
          })
      } else {
        CurrentAccountTransactionService.createCurrentAccountTransaction(currentAccountTransaction)
          .then((response) => {
            handleCloseModal()
            setIsLoading(true)
            // navigate('/currentAccountTransactions/' + currentAccountId);
          }).catch(error => {
            console.log(error)
          })
      }
    } //else everything is entered
  }


  const fetchCurrentAccounts = (currency) => {
    // console.log("Hey Ahmed");
    // console.log(currency); // getCurrentAccountsOfSpecificCurrency
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

  const pickerRef = useRef();
  const TypeMoveRef = useRef();

  const title = () => {
    if (id) {
      return <Text style={styles.modalTitle}>Update Value</Text>
    } else {
      return <Text style={styles.modalTitle}>Add New Move</Text>
    }
  }

  let editable = false



  return (
    <Modal visible={addMove} animationType="slide" transparent={true} >
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

          {transactionStatus != "" && transactionStatus ?
            <View style={styles.inputPicker}>
              <Picker
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
                ref={pickerRef}
                selectedValue={transactionStatus}
                onValueChange={(itemValue, itemIndex) => setTransactionStatus(itemValue)}>
                <Picker.Item label={"ACTIVE"} value={"ACTIVE"} />
              </Picker>
            </View>
          }

          <View style={styles.inputPicker}>
            {
              accountId ?
                <Picker
                  ref={TypeMoveRef}
                  selectedValue={transactionType}
                  onValueChange={(itemValue, itemIndex) => setTransactionType(itemValue)}>
                  <Picker.Item label={"اختر نوع الحركة"} value={"اختر نوع الحركة"} />
                  <Picker.Item label={"ايداع"} value={"DEPOSIT"} />
                  <Picker.Item label={"سحب"} value={"WITHDRAW"} />
                </Picker>
                :
                <Picker
                  ref={TypeMoveRef}
                  selectedValue={transactionType}
                  onValueChange={(itemValue, itemIndex) => setTransactionType(itemValue)}>
                  <Picker.Item label={"ايداع"} value={"DEPOSIT"} />
                  <Picker.Item label={"سحب"} value={"WITHDRAW"} />
                </Picker>
            }
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
            value={transactionAmount.toString()}
            onChangeText={(text) => setTransactionAmount(text)}
            keyboardType='numeric'
          />

          <TextInput
            style={styles.input}
            placeholder="Note Transaction"
            value={notes}
            onChangeText={(text) => setNotes(text)}
          />

          {
            accountId ?
              <TextInput
                style={[styles.input, { width: "100%", fontSize: 12 }, !editable && styles.disableInput]}
                placeholder="Date Move Created"
                editable={editable}
                value={moment(executionDate).format('MMMM Do YYYY, h:mm:ss a')}
              />
              :
              <TextInput
                style={[styles.input, { width: "100%", fontSize: 12 }, !editable && styles.disableInput]}
                placeholder="Date Move Created"
                editable={editable}
                value={moment(statusChangeDate).format('MMMM Do YYYY, h:mm:ss a')}
              />
          }

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
              <Text style={{ color: "#a0a0a0", fontSize: 12 }}>Drop Img Here</Text>
              <View style={{
                backgroundColor: '#4285F4aa', width: 25, height: 25, borderRadius: 50,
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

export default AddNewMoveFromMain


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
