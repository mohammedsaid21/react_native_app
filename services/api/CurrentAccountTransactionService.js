import axios from 'axios'
import Helper from "../../helper/ServiceHelperUtil";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccessToken, isTokenExpired, updateAccessToken } from '../ApiClient';

//const CURRENT_ACCOUNT_TRANSACTION_BASE_REST_API_URL = 'http://ahmed-tayeh.com/api/v1/currentAccountTransaction';
const CURRENT_ACCOUNT_TRANSACTION_BASE_REST_API_URL = Helper.getBaseURL() + '/api/v1/currentAccountTransaction';

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

class CurrentAccountTransactionService {

  async getAccountTransactions(currentAccountId) {
    const accessToken = await getAccessToken();

    return axios.get(CURRENT_ACCOUNT_TRANSACTION_BASE_REST_API_URL + '/currentAccount/' + currentAccountId, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
  }

  async getClientTransactions(clientId) {
    const accessToken = await getAccessToken();

    return axios.get(CURRENT_ACCOUNT_TRANSACTION_BASE_REST_API_URL + '/client/' + clientId, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
  }

  async createCurrentAccountTransaction(currentAccountTransaction) {
    const accessToken = await getAccessToken();

    return axios.post(CURRENT_ACCOUNT_TRANSACTION_BASE_REST_API_URL, currentAccountTransaction, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
  }


  async updateTransactionProof(currentAccountTransactionId, proofFile) {
    const accessToken = await getAccessToken();

    return axios.post(CURRENT_ACCOUNT_TRANSACTION_BASE_REST_API_URL + '/updateProof/' + currentAccountTransactionId, proofFile,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`
          // if backend supports u can use gzip request encoding
          // "Content-Encoding": "gzip",
        },
        //         transformRequest: (data, headers) => {
        // !!! override data to return formData
        // since axios converts that to string
        //           return proofFile;
        //      },
        onUploadProgress: (progressEvent) => {
          // use upload data, since it's an upload progress
          // iOS: {"isTrusted": false, "lengthComputable": true, "loaded": 123, "total": 98902}
        },
      });
  }

  async addTransactionProof(currentAccountTransactionId, proofFile) {
    const accessToken = await getAccessToken();

    //console.log(p)
    //.post(`/mails/users/sendVerificationMail`, null, { params: {
    //  mail,
    // firstname
    //}})
    //  var proof;  //= {proof : proofFile };
    return axios.post(CURRENT_ACCOUNT_TRANSACTION_BASE_REST_API_URL + '/uploadProof/' + currentAccountTransactionId, proofFile,
      // ,
      ///{
      //   headers:{
      //      'Content-Type': 'multipart/form-data'
      // }
      // }
      {
        params: {
          proof: proofFile
        },

        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`

          // if backend supports u can use gzip request encoding
          // "Content-Encoding": "gzip",
        },
        //   transformRequest: (data, headers) => {
        // !!! override data to return formData
        // since axios converts that to string
        //     return proofFile;
        // },
        onUploadProgress: (progressEvent) => {
          // use upload data, since it's an upload progress
          // iOS: {"isTrusted": false, "lengthComputable": true, "loaded": 123, "total": 98902}
        },
      }

    );
  }


  async getCurrentAccountTransactionById(currentAccountTransactionId) {
    const accessToken = await getAccessToken();

    return axios.get(CURRENT_ACCOUNT_TRANSACTION_BASE_REST_API_URL + '/' + currentAccountTransactionId, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async updateCurrentAccountTransaction(currentAccountTransactionId, currentAccountTransaction) {
    const accessToken = await getAccessToken();

    return axios.put(CURRENT_ACCOUNT_TRANSACTION_BASE_REST_API_URL + '/' + currentAccountTransactionId, currentAccountTransaction, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async deleteCurrentAccountTransaction(currentAccountTransactionId) {
    const accessToken = await getAccessToken();

    return axios.delete(CURRENT_ACCOUNT_TRANSACTION_BASE_REST_API_URL + '/' + currentAccountTransactionId, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}

export default new CurrentAccountTransactionService();