import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Moment, { format } from 'moment';
import { useState } from 'react';
import ExchangeRateService from '../../services/api/ExchangeRateService';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import i18n from '../../I18N';
import Toast from 'react-native-toast-message';

const AddNewPriceRate = ({ showAddNewPrice, setShowAddNewPrice, idForEdit, setIdForEdit }) => {

  const [fromCurrency, setFromCurrency] = useState('')
  const [toCurrency, setToCurrency] = useState('')
  const [date, setDate] = useState('')
  const [rate, setRate] = useState('')


  const [errors, setErrors] = useState('');
  const [statusError, setStatusError] = useState('')
  const [usersList, setUsersList] = useState([]);

  const handleClose = () => {
    setShowAddNewPrice(false)
    setIdForEdit(null)
    setFromCurrency("")
    setToCurrency("")
    setDate("")
    setRate("")
    setErrors("")
  };

  const saveOrUpdateExchangeRate = (e) => {
    e.preventDefault();
    if (!fromCurrency || !toCurrency || !rate) {
      setErrors("errors")
    }
    const exchangeRate = { fromCurrency, toCurrency, date, rate }
    if (idForEdit) {
      ExchangeRateService.updateExchangeRate(idForEdit, exchangeRate).then((response) => {
        // navigate('/exchange-rates')
        handleClose()
        Toast.show({
          type: 'success',
          text1: 'update successfuly',
          position: "bottom"
        });
      }).catch(error => {
        console.log(error)
      })

    } else {
      ExchangeRateService.createExchangeRate(exchangeRate).then((response) => {
        // console.log(response.data)
        handleClose()
        Toast.show({
          type: 'success',
          text1: 'Add New Price successfuly',
          position: "bottom"
        });
        // navigate('/exchange-rates');
      }).catch(error => {
        console.log(error)
      })
    }

  }

  useEffect(() => {
    setDate(new Date());

    if (idForEdit) {
      ExchangeRateService.getExchangeRate(idForEdit).then((response) => {
        setFromCurrency(response.data.fromCurrency)
        setToCurrency(response.data.toCurrency)
        setDate(response.data.date)
        setRate(response.data.rate)
      }).catch(error => {
        console.log(error)
      })
    }

  }, [showAddNewPrice, idForEdit])

  const fromCurrencyRef = useRef();
  const toCurrencyRef = useRef();

  const title = () => {
    if (idForEdit) {
      return <Text style={styles.modalTitle}>Update Account</Text>
    } else {
      return <Text style={styles.modalTitle}>Add New Account</Text>
    }
  }
  let editable = false;

  return (
    <Modal visible={showAddNewPrice} animationType="slide" transparent={true} >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

          {title()}

          <View style={styles.inputPicker}>
            <Picker
              ref={fromCurrencyRef}
              style={{ height: 48 }}
              mode='dropdown'
              selectedValue={fromCurrency}
              onValueChange={(itemValue, itemIndex) => setFromCurrency(itemValue)}>
              <Picker.Item label={i18n.t("choose_from_currency")} style={styles.inputHeaderPicker} />
              <Picker.Item label={i18n.t("currency_usd")} value={"USD"} style={styles.input12pxSize} />
              <Picker.Item label={i18n.t("currency_eur")} value={"EUR"} style={styles.input12pxSize} />
              <Picker.Item label={i18n.t("currency_jod")} value={"JOD"} style={styles.input12pxSize} />
              <Picker.Item label={i18n.t("currency_ils")} value={"ILS"} style={styles.input12pxSize} />
              <Picker.Item label={i18n.t("currency_try")} value={"TRY"} style={styles.input12pxSize} />
              <Picker.Item label={i18n.t("currency_aed")} value={"AED"} style={styles.input12pxSize} />
              <Picker.Item label={i18n.t("currency_egp")} value={"EGP"} style={styles.input12pxSize} />
            </Picker>
          </View>

          <View style={styles.inputPicker}>
            <Picker
              ref={toCurrencyRef}
              mode='dropdown'
              style={{ height: 48 }}
              selectedValue={toCurrency}
              onValueChange={(itemValue, itemIndex) => setToCurrency(itemValue)}
            >
              <Picker.Item label={i18n.t("choose_to_currency")} style={styles.inputHeaderPicker} />
              <Picker.Item label={i18n.t("currency_usd")} value={"USD"} style={styles.input12pxSize} />
              <Picker.Item label={i18n.t("currency_eur")} value={"EUR"} style={styles.input12pxSize} />
              <Picker.Item label={i18n.t("currency_jod")} value={"JOD"} style={styles.input12pxSize} />
              <Picker.Item label={i18n.t("currency_ils")} value={"ILS"} style={styles.input12pxSize} />
              <Picker.Item label={i18n.t("currency_try")} value={"TRY"} style={styles.input12pxSize} />
              <Picker.Item label={i18n.t("currency_aed")} value={"AED"} style={styles.input12pxSize} />
              <Picker.Item label={i18n.t("currency_egp")} value={"EGP"} style={styles.input12pxSize} />
            </Picker>
          </View>

          <TextInput
            style={[styles.input,]}
            placeholder={i18n.t("exchange_rate_enter_value")}
            onChangeText={(text) => setRate(text)}
            value={rate.toString()}
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, { width: "100%", fontSize: 12 }, !editable && styles.disableInput]}
            placeholder="Date Move Created"
            editable={editable}
            value={moment(date).format('MMMM Do YYYY, h:mm:ss a')}
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
            <TouchableOpacity style={styles.button} onPress={saveOrUpdateExchangeRate}>
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

export default AddNewPriceRate



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
