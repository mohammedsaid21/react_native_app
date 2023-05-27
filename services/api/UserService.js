import axios from 'axios'
import HelperUtil from '../../helper/ServiceHelperUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccessToken, isTokenExpired, updateAccessToken } from '../ApiClient';

const USER_BASE_REST_API_URL = HelperUtil.getBaseURL() + '/api/v1/users1';

// async function getAccessToken() {
//     let access_token = await AsyncStorage.getItem('access_token');

//     if (isTokenExpired(access_token)) {
//         console.log("Token expired. Requesting new...")
//         await updateAccessToken();
//         // console.log("new AccessToken received");
//         access_token = await AsyncStorage.getItem('access_token');
//     }
//     else {
//         console.log("There is error in get Access Token ")
//         await updateAccessToken();
//     }
//     return access_token;
// }

class UserService {

    async getAllowedCountries() {
        const accessToken = await getAccessToken();
        return axios.get(USER_BASE_REST_API_URL + '/allowedCountries', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    async getAllowedCountries2() {
        return axios.get(USER_BASE_REST_API_URL + '/allowedCountries', {
            headers: {
                'Accept': 'application/json',
            }
        })
    }

    async getAllUsers() {
        const accessToken = await getAccessToken();
        return axios.get(USER_BASE_REST_API_URL, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    /**
     * Get users accessible by the logged-in user
     * @param {} userId : the logged-in userId
     * @returns 
     */
    async getAccessibleUsers(userId) {
        const accessToken = await getAccessToken();
        return axios.get(USER_BASE_REST_API_URL + '/acc/' + userId, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    async getClientsAllowedForCurrentAccounts() {
        const accessToken = await getAccessToken();
        return axios.get(USER_BASE_REST_API_URL + '/clientsWithAccounts', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    async createUser(user) {
        const accessToken = await getAccessToken();
        return axios.post(USER_BASE_REST_API_URL, user, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    async getUsersByRoleType(roleType) {
        const accessToken = await getAccessToken();
        return axios.get(USER_BASE_REST_API_URL + '/role' + '/' + roleType, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    async getUsersById(userId) {
        const accessToken = await getAccessToken();
        return axios.get(USER_BASE_REST_API_URL + '/' + userId, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    async updateUser(userId, user) {
        const accessToken = await getAccessToken();
        return axios.put(USER_BASE_REST_API_URL + '/' + userId, user, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    async deleteUser(userId) {
        const accessToken = await getAccessToken();
        return axios.delete(USER_BASE_REST_API_URL + '/' + userId, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }
}

export default new UserService();