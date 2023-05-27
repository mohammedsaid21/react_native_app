import axios from 'axios'
import Helper from "../../helper/ServiceHelperUtil";
import { getAccessToken, isTokenExpired, updateAccessToken } from "../ApiClient"
import AsyncStorage from '@react-native-async-storage/async-storage';

//const CURRENT_ACCOUNT_BASE_REST_API_URL = '/api/v1/currentAccounts';
const CURRENT_ACCOUNT_BASE_REST_API_URL = Helper.getBaseURL() + '/api/v1/currentAccounts';

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
//     access_token = await AsyncStorage.getItem('access_token');
//   }
//   return access_token;
// }


class CurrentAccountService {


  async getAllCurrentAccounts() {
    const accessToken = await getAccessToken();

    return axios.get(CURRENT_ACCOUNT_BASE_REST_API_URL, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
  }

  /**
   * Get all Current Accounts that the logged-in user has access to
   * @param {*} userId  : the user id of the logged-in user
   * @returns 
   */
  async getAccessibleCurrentAccounts(userId) {
    const accessToken = await getAccessToken();

    return axios.get(CURRENT_ACCOUNT_BASE_REST_API_URL + '/acc/' + userId, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }


  async getAllCurrentAccountsStats() {
    const accessToken = await getAccessToken();
    // console.log("🚀 CurrentAccountService.js:48 ~~ accessToken:", accessToken)

    // const config = {
    //     headers: {
    //         'Accept': 'application/json',
    //         'Authorization': `Bearer ${accessToken}`
    //     }
    // }
    let res = await axios.get(CURRENT_ACCOUNT_BASE_REST_API_URL + '/stats',
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )

    return res
  }

  async createCurrentAccount(currentAccount) {
    const accessToken = await getAccessToken();

    return axios.post(CURRENT_ACCOUNT_BASE_REST_API_URL, currentAccount, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
  }

  async getClientCurrentAccounts(clientId) {
    const accessToken = await getAccessToken();

    // console.log("In Service Client Id", clientId)
    return axios.get(CURRENT_ACCOUNT_BASE_REST_API_URL + '/clientAccounts' + '/' + clientId, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async getCurrentAccountsOfSpecificCurrency(currency) {
    const accessToken = await getAccessToken();

    return axios.get(CURRENT_ACCOUNT_BASE_REST_API_URL + '/currency' + '/' + currency, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async getClientCurrentAccountOfSpecificCurrency(clientId, currency) {
    const accessToken = await getAccessToken();

    return axios.get(CURRENT_ACCOUNT_BASE_REST_API_URL + 'clientAccounts' + '/' + clientId + '/' + currency, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }


  async getCurrentAccountById(currentAccountId) {
    const accessToken = await getAccessToken();

    return axios.get(CURRENT_ACCOUNT_BASE_REST_API_URL + '/' + currentAccountId, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async updateCurrentAccount(currentAccountId, currentAccount) {
    const accessToken = await getAccessToken();

    return axios.put(CURRENT_ACCOUNT_BASE_REST_API_URL + '/' + currentAccountId, currentAccount, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async deleteCurrentAccount(currentAccountId) {
    const accessToken = await getAccessToken();

    return axios.delete(CURRENT_ACCOUNT_BASE_REST_API_URL + '/' + currentAccountId, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}

export default new CurrentAccountService();