import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../store/auth-context";
import { getRefreshToken, isTokenExpired, updateAccessToken } from "../ApiClient";

const api = axios.create({
  baseURL: "https://ahmed-tayeh.com/ghalban-backend-test",
});

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  const response = await fetch(`https://ahmed-tayeh.com/ghalban-backend-test/api/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  });

  if (response.status === 200) {
    const { accessToken } = await response.json();
    // setAccessToken(accessToken);
    return accessToken;
  } else {
    throw new Error('Failed to refresh access token');
  }
}

async function getAccessToken() {
  let access_token = await AsyncStorage.getItem('access_token');

  // console.log("isTokenExpired(access_token) ", isTokenExpired(access_token))
  if (isTokenExpired(access_token)) {
    // console.log("Token expired. Requesting new...")
    await updateAccessToken();
    // console.log("new AccessToken received");
    access_token = await AsyncStorage.getItem('access_token');
  }
  return access_token;
}

const axiosRequest = async (method, url, token = null, data = null, params = null,) => {
  const config = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // 'authorization': `Bearer ${token}`,
    },
    data,
    params,
  };

  let access_token = await AsyncStorage.getItem('access_token');

  if (isTokenExpired(access_token)) { 
    // console.log("Token expired. Requesting new...")
    await updateAccessToken();
    // console.log("new AccessToken received");
    access_token = await AsyncStorage.getItem('access_token');
  }

  if (access_token) {
    config.headers['authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await api(config);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Access token expired, try to refresh it
      try {
        const newToken = await updateAccessToken();
        console.log("🚀 ~ file: request.js:80 ~ axiosRequest ~ newToken:", newToken)
        // Retry the API request with the new token
        config.headers.authorization = `Bearer ${newToken.access_token}`;
        const response = await api(config);
        return response;
      } catch (error) {
        // Failed to refresh token or make API request, handle error here
        console.log('Failed to refresh token or make API request:', error);
        return error;
      }
    } else {
      // API request failed for another reason, handle error here
      console.log('API request failed:', error);
      return error;
    }
  }
};

// const axiosRequest = async (method, url, token = null, data = null, params = null,) => {
//   const config = {
//     method,
//     url,
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//       'authorization': `Bearer ${token}`,
//     },
//     data,
//     params,
//   };

//   try {
//     return await api(config);
//   } catch (error) {
//     return error;
//   }
// };

export default axiosRequest;
