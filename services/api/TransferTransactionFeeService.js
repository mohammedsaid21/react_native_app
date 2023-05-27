import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Helper from '../../helper/ServiceHelperUtil'
import { getAccessToken, isTokenExpired, updateAccessToken } from '../ApiClient';
const TRANSFER_FEE_BASE_REST_API_URL = Helper.getBaseURL() + '/api/v1/transfer-fee';

class TransferTransactionFeeService {

  async getAllTransferFees() {
    const accessToken = await getAccessToken();

    return axios.get(TRANSFER_FEE_BASE_REST_API_URL, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
  }

  async createTransferTransactionFee(transferTransactionFee) {
    const accessToken = await getAccessToken();

    return axios.post(TRANSFER_FEE_BASE_REST_API_URL, transferTransactionFee, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
  }

  async getTransferTransactionFee(fromCountry, toCountry) {
    const accessToken = await getAccessToken();

    return axios.get(TRANSFER_FEE_BASE_REST_API_URL + '/fee/' + fromCountry + '/' + toCountry, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async getTransferTransactionFee(id) {
    const accessToken = await getAccessToken();

    return axios.get(TRANSFER_FEE_BASE_REST_API_URL + '/' + id, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }


  async updateTransferTransactionFee(transactionFeeId, transactionFee) {
    const accessToken = await getAccessToken();

    return axios.put(TRANSFER_FEE_BASE_REST_API_URL + '/' + transactionFeeId, transactionFee, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

  }

  async deleteTransferTransactionFee(transactionFeeId) {
    const accessToken = await getAccessToken();

    return axios.delete(TRANSFER_FEE_BASE_REST_API_URL + '/' + transactionFeeId, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }



}

export default new TransferTransactionFeeService();