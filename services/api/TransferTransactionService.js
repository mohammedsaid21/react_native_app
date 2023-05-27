import axios from 'axios'

import Helper from '../../helper/ServiceHelperUtil'
const TRANSFER_TRANSACTION_BASE_REST_API_URL = Helper.getBaseURL() + '/api/v1/transferTranscations';
// const TRANSFER_TRANSACTION_BASE_REST_API_URL = 'http://ahmed-tayeh.com/backend-spring/api/v1/transferTranscations';

class TransferTransactionService{

     getAllTransferTransactions(user){
         return axios.get(TRANSFER_TRANSACTION_BASE_REST_API_URL + '/user/' + user)
    }

    createTransferTranscation(transferTransaction){
        return axios.post(TRANSFER_TRANSACTION_BASE_REST_API_URL, transferTransaction)
    }

    calcuateTransaction(transactionDetails){
        // console.log("In the service to handle the balance")
        return axios.post(TRANSFER_TRANSACTION_BASE_REST_API_URL + '/calculateTransaction', transactionDetails)
    }

    calcuateTransferTransaction(transactionDetails){
        // console.log("In the service to handle the balance")
        return axios.post(TRANSFER_TRANSACTION_BASE_REST_API_URL + '/calculateTransferTransaction', transactionDetails)
    }

    getTransferTransactionById(transferTransactionId){
        return axios.get(TRANSFER_TRANSACTION_BASE_REST_API_URL + '/' + transferTransactionId);
    }

    getTransferTransactionByIdentifier(transferTransactionIdentifier){
        return axios.get(TRANSFER_TRANSACTION_BASE_REST_API_URL + '/identifier/' + transferTransactionIdentifier);
    }

    getTransferTransactionByBroker(brokerUserName){
        return axios.get(TRANSFER_TRANSACTION_BASE_REST_API_URL + '/broker/' + brokerUserName);
    }

    getTransferTransactionBySender(senderId){
        return axios.get(TRANSFER_TRANSACTION_BASE_REST_API_URL + '/sender/' + senderId);
    }

    getTransferTransactionBySender(receiverId){
        return axios.get(TRANSFER_TRANSACTION_BASE_REST_API_URL + '/receiver/' + receiverId);
    }

    updateTransferTransaction(transferTransactionId, transferTransaction){
        return axios.put(TRANSFER_TRANSACTION_BASE_REST_API_URL + '/' + transferTransactionId, transferTransaction);
    }

    deleteTransferTransaction(transferTransactionId){
        return axios.delete(TRANSFER_TRANSACTION_BASE_REST_API_URL + '/' + transferTransactionId);
    }
}

export default new TransferTransactionService();