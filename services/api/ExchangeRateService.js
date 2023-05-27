import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import Helper from '../../helper/ServiceHelperUtil'

import { getAccessToken, isTokenExpired, updateAccessToken } from '../ApiClient';

const Exchange_Rate_BASE_REST_API_URL = Helper.getBaseURL() + '/api/v1/exchange-rate';

//Cross-Origin Request
//resonse_object.header("Access-Control-Allow-Origin", "*");
//resonse_object.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

// async function getAccessToken() {
//   let access_token = await AsyncStorage.getItem('access_token');

//   if (isTokenExpired(access_token)) {
//     console.log("Token expired. Requesting new...")
//     await updateAccessToken();
//     // console.log("new AccessToken received");
//     access_token = await AsyncStorage.getItem('access_token');
//   }
//   else {
//     console.log("There is error in get Access Token ")
//     await updateAccessToken();
//   }
//   return access_token;
// }

class ExchangeRateService {

  getSupportedCurrencies() {
    return axios.get(Exchange_Rate_BASE_REST_API_URL + '/currencies')
  }

  async getAllExchangeRates() {
    const accessToken = await getAccessToken();
    return axios.get(Exchange_Rate_BASE_REST_API_URL,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )

  }

  async getActiveExchangeRates() {
    const accessToken = await getAccessToken();
    // console.log("🚀  ExchangeRateService.js:29  accessToken:", accessToken)

    return axios.get(Exchange_Rate_BASE_REST_API_URL + '/active',
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )
  }

  async createExchangeRate(exchangeRate) {
    const accessToken = await getAccessToken();

    return axios.post(Exchange_Rate_BASE_REST_API_URL, exchangeRate,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )
  }

  async getExchangeRate(fromCurrency, toCurrency) {
    const accessToken = await getAccessToken();

    return axios.get(Exchange_Rate_BASE_REST_API_URL + '/rate/' + fromCurrency + '/' + toCurrency,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'ccess-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
  }

  async getExchangeRate(id) {
    const accessToken = await getAccessToken();

    return axios.get(Exchange_Rate_BASE_REST_API_URL + '/' + id,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'ccess-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
  }

  async updateExchangeRate(exchangeRateId, exchangeRate) {
    const accessToken = await getAccessToken();

    return axios.put(Exchange_Rate_BASE_REST_API_URL + '/' + exchangeRateId, exchangeRate,
      {

        headers: {
          'Access-Control-Allow-Origin': '*',
          'ccess-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

  }

  async deleteExchangeRate(exchangeRateId) {
    const accessToken = await getAccessToken();

    return axios.delete(Exchange_Rate_BASE_REST_API_URL + '/' + exchangeRateId, {

      headers: {
        'Access-Control-Allow-Origin': '*',
        'ccess-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

  }


}

export default new ExchangeRateService();