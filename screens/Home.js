import { View, Text, Button, I18nManager, DevSettings, FlatList, StyleSheet, Dimensions } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../store/auth-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from 'react-redux';
import ExchangeRateService from '../services/api/ExchangeRateService';
import axios from 'axios';
import { useQuery } from 'react-query';
import { getExchange } from '../services/api/user';
// import TableExchange from '../components/home/TableExchange';
import { authService } from '../services/auth/AuthService';
import TableExchange from '../components/home/TableExchange';
import { ScrollView } from 'react-native';
import CurrentAccounts from '../components/home/CurrentAccounts';
import { TouchableOpacity } from 'react-native';
import FileDownloaderHelperUtil from '../helper/FileDownloaderHelperUtil';
import ReportingService from '../services/api/ReportingService';

import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

import * as FileSystem from 'expo-file-system';
// import Pdf from "react-native-pdf";
import { decode as atob } from 'base-64';
import i18n from '../I18N';
import IconWithLabel from '../components/UI/IconWithLabel';


const Home = () => {
  // const { isLoading, isError, data, error } = useQuery('posts', getExchange());
  // if (isLoading) {
  //   return <Text>Loading...</Text>;
  // }

  // if (isError) {
  //   return <Text>Error: {error.message}</Text>;
  // }


  const [userLogged, setUserLogged] = useState()
  useEffect(() => {
    // authService.currentUser.subscribe(x => setUserLogged(x));
    // console.log(userLogged)
  }, []);


  const printGeneralAccountsBalance = async () => {
    ReportingService.getAccountsGeneralBalance()
      .then((response) => {
        var reportName = "الميزان العام - شركة الغلبان";
        // console.log("🚀 ~ file: Home.js:48 ~ .then ~ response.data:", response.data)

        FileDownloaderHelperUtil.downloadDocument(response.data, reportName)
        // const blob = base64toBlob(response.data);
        // const url = URL.createObjectURL(blob);
        // console.log("🚀 ~ file: Home.js:67 ~ .then ~ url:", blob)

        console.log("done download")
      }).catch(error => {
        // console.log("error: ", error)
      })
  }

  let dateNow = new Date().toLocaleDateString('en-GB');


  return (
    <ScrollView>
      <View style={[styles.headerTitle, { paddingBottom: 12, }]}>
        <Text style={styles.txtHeader}>{i18n.t("home_header_exchanges")}</Text>
        <Text>{dateNow}</Text>
      </View>

      {/* button download pdf */}

      {/* <TouchableOpacity style={styles.btn} onPress={printGeneralAccountsBalance}>
        <Text style={styles.txtBtn}>Accounts General Balance</Text>
      </TouchableOpacity> */}

      <TableExchange />

      <View style={styles.headerTitle}>
        <Text style={styles.txtHeader}>{i18n.t("home_header_current_accounts")}</Text>
        <IconWithLabel iconName="print-outline" />
        {/* label={i18n.t("home_header_accounts_general_balance")}  */}
      </View>

      <CurrentAccounts />

    </ScrollView>
  )
}

export default Home



const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    flex: 1
  },
  headerTitle: {
    paddingTop: 30,
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    borderBottomColor: "#aaa",
    borderBottomWidth: 2
  },

  txtHeader: {
    fontSize: 14
  },
  btn: {
    width: 160,
    backgroundColor: "rgb(0, 135, 240)",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  txtBtn: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13
  },

  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});