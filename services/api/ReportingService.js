import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Helper from '../../helper/ServiceHelperUtil'
import { getAccessToken, isTokenExpired, updateAccessToken } from '../ApiClient';

const REPORT_BASE_REST_API_URL = Helper.getBaseURL() + '/api/v1/report';

// async function getAccessToken() {
//   let access_token = await AsyncStorage.getItem('access_token');

//   if (isTokenExpired(access_token)) {
//     console.log("Token expired. Requesting new...")
//     await updateAccessToken();
//     // console.log("new AccessToken received");
//     access_token = await AsyncStorage.getItem('access_token');
//   }
//   return access_token;
// }

class ReportingService {

  async getAccountTransactionsReport(currentAccountId, fromDate, toDate) {
    const accessToken = await getAccessToken();
    return axios.get(REPORT_BASE_REST_API_URL + '/accountTransactions/' + currentAccountId + '/' + fromDate + '/' + toDate
      ,
      {
        ResponseType: 'blob',
        setTimeout: 3000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf',
          'Authorization': `Bearer ${accessToken}`
        }
      });
  }

  async getClientCurrentAccountsBalanceValidationReport(clientId) {
    const accessToken = await getAccessToken();
    return axios.get(REPORT_BASE_REST_API_URL + '/clientAccountsValidation/' + clientId
      ,
      {
        ResponseType: 'blob',
        setTimeout: 3000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf',
          'Authorization': `Bearer ${accessToken}`
        }
      });
  }
  //get-general-accounts-balance

  async getAccountsGeneralBalance() {
    const accessToken = await getAccessToken();
    return axios.get(REPORT_BASE_REST_API_URL + '/get-general-accounts-balance'
      ,
      {
        ResponseType: 'blob',
        setTimeout: 3000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf',
          'Authorization': `Bearer ${accessToken}`
        }
      });
  }
  async getDummyReport() {
    const accessToken = await getAccessToken();
    return axios.get(REPORT_BASE_REST_API_URL + '/dummy', {

      ResponseType: 'blob',
      setTimeout: 3000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf',
        'Authorization': `Bearer ${accessToken}`
      }
    })
  }
}

export default new ReportingService();