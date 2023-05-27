import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native'
import React, { useEffect, useRef } from 'react'
import TransferTransactionFeeService from '../../services/api/TransferTransactionFeeService'
import i18n from '../../I18N'
import { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import moment from 'moment'
import UserService from '../../services/api/UserService'
import Toast from 'react-native-toast-message';

const AddNewTransferFees = ({ showAddPriceModal, setShowAddPriceModal, id, setId, }) => {
  let idEdit = id


  const [fromCountry, setFromCountry] = useState('')
  const [toCountry, setToCountry] = useState('')
  const [fee, setFee] = useState('')
  const [feeType, setFeeType] = useState('')
  const [feeDelm, setFeeDelm] = useState('')
  const [rangeValue, setRangeValue] = useState('')
  const [rangeValueMin, setRangeValueMin] = useState('')
  const [rangeValueMax, setRangeValueMax] = useState('')
  const [allowedCountries, setAllowedCountries] = useState([])

  const [errors, setErrors] = useState('');
  const [statusError, setStatusError] = useState('')

  const saveOrUpdateTransferTransactionFee = (e) => {
    e.preventDefault();

    const transferFee = { fromCountry, toCountry, fee, feeType, feeDelm, rangeValue, rangeValueMin, rangeValueMax }

    if (!fromCountry || !toCountry || !fee || !feeType || !feeDelm || !rangeValue || !rangeValueMin || !rangeValueMax) {
      setErrors("errors")
    } else {
      if (idEdit) {
        TransferTransactionFeeService.updateTransferTransactionFee(idEdit, transferFee)
          .then((response) => {
            // navigate('/transfer-fees')
            handleClose()
            Toast.show({
              type: 'success',
              text1: 'Update Transfer Transaction Fee successfuly',
              position: "bottom"
            });
          }).catch(error => {
            console.log(error)
          })
      } else {
        TransferTransactionFeeService.createTransferTransactionFee(transferFee)
          .then((response) => {
            console.log(response.data)
            // navigate('/transfer-fees');
            handleClose()
            Toast.show({
              type: 'success',
              text1: 'Add Transfer Transaction Fee successfuly',
              position: "bottom"
            });
          }).catch(error => {
            console.log(error)
          })
      }

    }
  }

  const handleClose = () => {
    setShowAddPriceModal(false)
    setId(null)
    idEdit = null
    setFromCountry("")
    setToCountry("")
    setFee("")
    setFeeDelm("")
    setFeeType("")
    setRangeValue("")
    setRangeValueMin("")
    setRangeValueMax("")
  };


  useEffect(() => {

    if (idEdit) {

      TransferTransactionFeeService.getTransferTransactionFee(idEdit)
        .then((response) => {
          setFromCountry(response.data.fromCountry)
          setToCountry(response.data.toCountry)
          setFee(response.data.fee)
          setFeeDelm(response.data.feeDelm)
          setFeeType(response.data.feeType)
          setRangeValue(response.data.rangeValue)
          setRangeValueMin(response.data.rangeValueMin)
          setRangeValueMax(response.data.rangeValueMax)
        }).catch(error => {
          console.log(error)
        })
    }

    UserService.getAllowedCountries().then((response) => {
      setAllowedCountries(response.data)
      console.log(response.data)
    }).catch(error => {
      console.log(error)
    })

  }, [idEdit, showAddPriceModal])

  const title = () => {
    if (idEdit) {
      return <Text style={styles.modalTitle}>{i18n.t('transfer_fee_update')}</Text>
    } else {
      return <Text style={styles.modalTitle}>{i18n.t('transfer_fee_add_new')}</Text>
    }
  }

  const fromCountryRef = useRef();
  const toCountryRef = useRef();
  const feeDelmRef = useRef();
  const feeTypeRef = useRef();
  let editable = false;


  return (
    <Modal visible={showAddPriceModal} animationType="slide" transparent={true} >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

          {title()}

          <View style={styles.inputPicker}>
            <Picker
              ref={fromCountryRef}
              style={{ height: 48 }}
              mode='dropdown'
              selectedValue={fromCountry}
              onValueChange={(itemValue, itemIndex) => setFromCountry(itemValue)}>
              <Picker.Item label={i18n.t("choose_from_currency")} style={styles.inputHeaderPicker} />
              {
                allowedCountries.map((allowedCountrry) =>
                  <Picker.Item label={allowedCountrry.countryName} value={allowedCountrry.countryName} key={allowedCountrry.countryName} style={styles.input12pxSize} />
                )
              }
            </Picker>
          </View>

          <View style={styles.inputPicker}>
            <Picker
              ref={toCountryRef}
              mode='dropdown'
              style={{ height: 48 }}
              selectedValue={toCountry}
              onValueChange={(itemValue, itemIndex) => setToCountry(itemValue)}
            >
              <Picker.Item label={i18n.t("choose_to_currency")} style={styles.inputHeaderPicker} />
              {
                allowedCountries.map((allowedCountrry) =>
                  <Picker.Item label={allowedCountrry.countryName} value={allowedCountrry.countryName} key={allowedCountrry.countryName} style={styles.input12pxSize} />
                )
              }
            </Picker>
          </View>

          <View style={styles.inputPicker}>
            <Picker
              ref={feeDelmRef}
              mode='dropdown'
              style={{ height: 48 }}
              selectedValue={feeDelm}
              onValueChange={(itemValue, itemIndex) => setFeeDelm(itemValue)}
            >
              <Picker.Item label={i18n.t("transfer_fee_value_is")} style={styles.input12pxSize} />
              <Picker.Item value="EQUAL" label={i18n.t("transfer_fee_value_is_equal")} style={styles.input12pxSize} />
              <Picker.Item value="BETWEEN" label={i18n.t("transfer_fee_value_is_between")} style={styles.input12pxSize} />
              <Picker.Item value="GREATER" label={i18n.t("transfer_fee_value_is_greater")} style={styles.input12pxSize} />
              <Picker.Item value="LESS" label={i18n.t("transfer_fee_value_is_less")} style={styles.input12pxSize} />

            </Picker>
          </View>

          {
            feeDelm == "" || feeDelm == "EQUAL" || feeDelm == "GREATER" || feeDelm == "LESS" ?
              (
                <TextInput
                  style={[styles.input,]}
                  placeholder={i18n.t("transfer_fee_value_is_compared_to_value")}
                  onChangeText={(text) => setRangeValue(text)}
                  value={rangeValue.toString()}
                  keyboardType="numeric"
                />
              ) : (
                <View>
                  <TextInput
                    style={[styles.input,]}
                    placeholder={i18n.t("transfer_fee_value_is_compared_to_value_min")}
                    onChangeText={(text) => setRangeValueMin(text)}
                    value={rangeValueMin.toString()}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.input,]}
                    placeholder={i18n.t("transfer_fee_value_is_compared_to_value_max")}
                    onChangeText={(text) => setRangeValueMax(text)}
                    value={rangeValueMax.toString()}
                    keyboardType="numeric"
                  />

                </View>
              )}

          <View style={styles.inputPicker}>
            <Picker
              ref={feeTypeRef}
              mode='dropdown'
              style={{ height: 48 }}
              selectedValue={feeType}
              onValueChange={(itemValue, itemIndex) => setFeeType(itemValue)}
            >
              <Picker.Item label={i18n.t("transfer_fee_type")} style={styles.inputHeaderPicker} />
              <Picker.Item value="PERCENTAGE" label={i18n.t("transfer_fee_type_percentage")} style={styles.input12pxSize} />
              <Picker.Item value="VALUE" label={i18n.t("transfer_fee_type_value")} style={styles.input12pxSize} />
            </Picker>
          </View>

          <TextInput
            style={[styles.input,]}
            placeholder={i18n.t("transfer_fee_value")}
            onChangeText={(text) => setFee(text)}
            value={fee.toString()}
            keyboardType="numeric"
          />

          {
            errors !== ""
              ?
              <Text style={{ color: "red", fontSize: 12 }}>{i18n.t("validation_general_empty_error")}</Text>
              :
              statusError !== "" ?
                <Text style={{ color: "red", fontSize: 12 }}>There Is Status error</Text>
                : ""
          }

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={saveOrUpdateTransferTransactionFee}>
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

export default AddNewTransferFees



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
  },
  inputHeaderPicker: {
    fontSize: 12,
    color: "#555"
  },
  input12pxSize: {
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
