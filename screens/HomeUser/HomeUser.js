import { View, Text, StyleSheet, Button, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import UserService from '../../services/api/UserService';
import ExchangeRateService from '../../services/api/ExchangeRateService';
import TransferTransactionService from '../../services/api/TransferTransactionService';


const HomeUser = () => {
  const [fromCountry, setFromCountry] = useState('');
  const [toCountry, setToCountry] = useState('');

  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');

  const [sendAmount, setSendAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');

  const [countries, setCountries] = useState()
  const [currencies, setCurrencies] = useState()

  const [allFees, setAllFees] = useState();
  const [errorMsg, setErrorMsg] = useState("")
  const [show, setShow] = useState(false)

  useEffect(() => {
    UserService.getAllowedCountries2()
      .then((res) => {
        setCountries(res.data)
      })
      .catch(error => {
        console.log(error)
      })

    ExchangeRateService.getSupportedCurrencies()
      .then((res) => {
        setCurrencies(res.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const handleSubmit = () => {
    console.log("test 22")
    // // event.preventDefault();
    // {
    //   "fromCountry": "بلجيكا", "toCountry": "العراق",
    //   "fromCurrency": "TRY", "toCurrency": "USD",
    //   "sentMoney": "500"
    // }
    // const object = {
    //   "fromCurrency": fromCurrency, "toCurrency": toCurrency,
    //   "fromCountry": fromCountry, "toCountry": toCountry,
    //   "sentMoney": sendAmount
    // }

    // console.log(object)

    // if (fromCurrency || toCurrency || fromCountry || toCountry || sendAmount) {
    //   TransferTransactionService.calcuateTransferTransaction(object)
    //     .then((res) => {
    //       setShow(true)
    //       setReceiveAmount(res.data?.netReceived)
    //       setAllFees(res.data?.allFees)
    //       console.log(res.data)
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    // } else {
    //   setErrorMsg("Enter All The Input Please")
    // }
  };


  // useEffect(() => {
  //   if (!isNaN(allFees)) {
  //     if (allFees > 0 || receiveAmount > 0) setShow(true);
  //   }
  // }, [allFees, receiveAmount]);

  const fromContryRef = useRef();
  const toContryRef = useRef();
  const fromCurrencyRef = useRef();
  const toCurrencyRef = useRef();

  return (
    <ScrollView style={{ flex: 1 }}>
      <Text style={styles.textHeader}>International money transfer</Text>

      <View style={styles.formConversion}>
        <Text style={{ marginBottom: 15 }}>Currency Conversion</Text>

        <View style={styles.inputPicker}>
          <Picker
            mode='dropdown'
            style={{ height: 50 }}
            ref={fromContryRef}
            selectedValue={fromCountry}
            onValueChange={(itemValue, itemIndex) => setFromCountry(itemValue)}
          >
            <Picker.Item label={"From Country"} value={"From Country"} style={{ fontSize: 14 }} />
            {
              countries && countries.map((contry) =>
                <Picker.Item label={contry.countryName} key={contry.id} value={contry.countryName} />
              )
            }
          </Picker>
        </View>

        <View style={styles.inputPicker}>
          <Picker
            mode='dropdown'
            style={{ height: 50 }}
            ref={fromCurrencyRef}
            selectedValue={fromCurrency}
            onValueChange={(itemValue, itemIndex) => setFromCurrency(itemValue)}
          >
            <Picker.Item label={"From currency"} value={"From currency"} style={{ fontSize: 14 }} />
            {
              currencies && currencies.map((currency) =>
                <Picker.Item label={currency} key={currency} value={currency} />
              )
            }
          </Picker>
        </View>

        {/* <TextInput
          style={styles.input}
          placeholder="Send Amount"
          value={sendAmount}
          onChangeText={(text) => setSendAmount(text)}
        /> */}

        <View style={styles.inputPicker}>
          <Picker
            mode='dropdown'
            style={{ height: 50 }}
            ref={toContryRef}
            selectedValue={toCountry}
            onValueChange={(itemValue, itemIndex) => setToCountry(itemValue)}
          >
            <Picker.Item label={"To Country"} value={"To Country"} style={{ fontSize: 14 }} />
            {
              countries && countries.map((contry) =>
                <Picker.Item label={contry.countryName} key={contry.id} value={contry.countryName} />
              )
            }
          </Picker>
        </View>

        <View style={[styles.inputPicker,]}>
          <Picker
            mode='dropdown'
            style={{ height: 50 }}
            ref={toCurrencyRef}
            selectedValue={toCurrency}
            onValueChange={(itemValue, itemIndex) => setToCurrency(itemValue)}
          >
            <Picker.Item label={"To currency"} value={"To currency"}
              style={{ fontSize: 14 }} />
            {
              currencies && currencies.map((currency) =>
                <Picker.Item label={currency} key={currency} value={currency} />
              )
            }
          </Picker>
        </View>

        {/* {show &&
          <>
            <TextInput
              style={[styles.input,]}
              placeholder="receive Amount"
              value={receiveAmount && receiveAmount.toString()}
              onChangeText={(text) => setReceiveAmount(text)}
              editable={false}
            />

            <TextInput
              style={[styles.input,]}
              placeholder="receive Amount"
              value={allFees && allFees.toString()}
              onChangeText={(text) => setAllFees(text)}
              editable={false}
            />
          </>
        }
        {errorMsg &&
          <Text style={{ color: "red", marginBottom: 10, fontSize: 12 }}>{errorMsg}</Text>
        } */}

        <View style={{ marginVertical: 20 }}>
          <Button title="Submit" onPress={handleSubmit} />
        </View>
        
      </View>

    </ScrollView>
  )
}

export default HomeUser



const styles = StyleSheet.create({
  textHeader: {
    fontSize: 18,
    marginHorizontal: 10,
    marginVertical: 15,
  },
  formConversion: {
    paddingHorizontal: 12,
    paddingVertical: 25,
    marginHorizontal: 10,
    marginBottom: 50,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 7,
    backgroundColor: "#fff"
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    fontSize: 14,
  },
  inputPicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginBottom: 15,
  },
  disableInput: {
    backgroundColor: "#eee"
  },

})