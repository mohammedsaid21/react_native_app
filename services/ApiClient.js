import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { authService } from './auth/AuthService';

// const API_URL = process.env.REACT_APP_API_URL
const API_URL = "https://ahmed-tayeh.com/ghalban-backend-test"

const signIn = async (loginData) => {
  // Send data to the backend via POST
  let response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(loginData)
  });
  return await response.json();
};

const signOn = async (registerData) => {
  return fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(registerData)
  });
};

const confirmRegistration = async (token) => {
  return fetch(`${API_URL}/api/auth/registration-confirm?token=${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
};

const resetPassword = async (email) => {
  const response = await fetch(`${API_URL}/api/auth/reset-password?email=${email}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return await handleApiResponse(response);
};

const changePassword = async (passwordChangeRequest) => {
  const response = await fetch(`${API_URL}/api/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(passwordChangeRequest)
  });
  return await handleApiResponse(response);
};


export const updateAccessToken = async () => {
  let refreshToken = await getRefreshToken();
  // console.log("🚀 ~ file: ApiClient.js:69~ refreshToken: ", refreshToken)

  let response = await fetch(`${API_URL}/api/auth/refresh-token?token=${refreshToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  if (response.status === 200) {
    console.log("update access token ")
    let res = await response.json();
    return validateAndSaveTokens(res);
  } else if (response.status === 401 || response.status === 403) {
    authService.logout();
    const msg = "Refresh token expired or account blocked. Try to login again or call administration";
    console.log(msg)
    // notify({ info: msg, status: "success" });

    let body = await response.json();
    console.log(body);
    // throw new Error(msg);
  } else {
    let body = await response.json();
    let errorMsg = body.message ? body.message : JSON.stringify(body);
    console.log(errorMsg)

    // notify({ info: errorMsg, status: "failed" });
  }

}

function validateAndSaveTokens(responseFromApi) {
  if (responseFromApi?.access_token && responseFromApi?.refresh_token) {
    let jwtDecoded = jwt_decode(responseFromApi.access_token);
    let refreshJwtDecoded = jwt_decode(responseFromApi.refresh_token);
    if (jwtDecoded.sub && jwtDecoded.userId && !isTokenExpired(responseFromApi.access_token)) {
      AsyncStorage.setItem('access_token', responseFromApi.access_token);
    }
    if (refreshJwtDecoded.sub && refreshJwtDecoded.userId && !isTokenExpired(responseFromApi.refresh_token)) {
      AsyncStorage.setItem('refresh_token', responseFromApi.refresh_token);
    }
    authService.updateLoggedInUserInfo(responseFromApi.user);
    return responseFromApi.access_token;
  }
}

export function deleteUserDataAndTokens() {
  authService.logout()
}


// export async function getAccessToken() {
//   let access_token = await AsyncStorage.getItem('access_token');
//   if (isTokenExpired(access_token)) {
//     console.log("Token expired. Requesting new...")
//     await updateAccessToken();
//     console.log("new AccessToken received");
//     access_token = await AsyncStorage.getItem('access_token');
//   }
//   return access_token;
// }

export async function getRefreshToken() {
  let refreshToken = await AsyncStorage.getItem('refresh_token')
  // .then((tok) => refreshToken = tok)
  // .then((re) => console.log(re))  

  if (isTokenExpired(refreshToken)) {
    console.log("token is expired ")
    authService.logout();
    // throw new Error("Refresh token expired. Relogin please 2 ");
  } else {
    return refreshToken;
  }

}


export function isTokenExpired(token) {
  // console.log("🚀 ~ file: ApiClient.js:152 ~ isTokenExpired ~ token : ", token)
  // let token1 = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJJZCI6MTU4LCJ0eXAiOiJSZWZyZXNoIiwiaWF0IjoxNjc5MzEyNjg4LCJleHAiOjE2NzkzOTkwODh9.o63fhZ43ITNvFQppzcuBPbA9VvAP35ehaw7Hpr7NB-ynxRi8hpseaA41BYvdZTaaFJE9LxUZ7mBlCSekfscIMw"

  let isExpired = false;
  const timeMarginSec = 40;

  let decodedToken = jwt_decode(token);
  // console.log("isTokenExpired ~ decodedToken:", decodedToken)

  let currentDate = new Date().getTime() / 1000; // Convert to seconds

  if (decodedToken.exp < (currentDate - timeMarginSec)) {
    console.log("Token expired.2 ");
    isExpired = true;
    return isExpired
  } else {
    console.log("is token expired is false ")
    return false
  }

  // return isExpired;
}

const getAllProperties = async () => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API_URL}/api/v1/properties`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return await handleApiResponse(response);
}


const handleApiResponse = async (response) => {
  const status = response.status;
  const body = await response.json();
  if (status === 200) {
    return body;
  } else if (status === 401) {
    handle401();
  } else {
    let errorMsg = body.message ? body.message : JSON.stringify(body);
    console.log(errorMsg)

    // notify({ info: errorMsg, status: "failed" });
  }
};

const handle401 = () => {
  //do nothing for now
};

const getAllUsers = async () => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API_URL}/api/v1/admin/users`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return await handleApiResponse(response);
};

const bookProperty = async (propertyId) => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API_URL}/api/v1/properties/${propertyId}/book`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return await handleApiResponse(response);
};

const getUserById = async (userId) => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API_URL}/api/v1/users/${userId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return await handleApiResponse(response);
};

const updateUser = async (user) => {
  let userId = user.id;

  const accessToken = await getAccessToken();

  const response = await fetch(`${API_URL}/api/v1/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(user)
  });
  return await handleApiResponse(response);
};

const updateProperty = (userId, property) =>
  changeProperty(userId, property, 'PUT');

const createProperty = (userId, property) =>
  changeProperty(userId, property, 'POST');

async function changeProperty(userId, property, method) {
  try {
    let access_token = await getAccessToken();
    let response = await fetch(`${API_URL}/api/v1/users/${userId}/property`, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify(property)
    });
    let res = await response.json();
    console.log(res);
    return res;
  } catch (error) {
    return console.log(error);
  }
}

const getAllRoles = async () => {

  const accessToken = await getAccessToken();

  const response = await fetch(`${API_URL}/api/v1/admin/roles`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return await handleApiResponse(response);
}

const assignRolesToUser = async (userId, roleIds) => {

  const accessToken = await getAccessToken();

  let requestParams = '';
  roleIds.forEach(roleId => {
    if (requestParams) requestParams += '&';
    requestParams += `roleId=${roleId}`;
  });
  if (requestParams) requestParams = '?' + requestParams;

  const response = await fetch(`${API_URL}/api/v1/admin/users/${userId}/roles${requestParams}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return await handleApiResponse(response);
}

const getAllAuthorities = async () => {

  const accessToken = await getAccessToken();

  const response = await fetch(`${API_URL}/api/v1/admin/authorities`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return await handleApiResponse(response);
}

const getUserSeparateAuthorities = async (userId) => {

  const accessToken = await getAccessToken();

  const response = await fetch(`${API_URL}/api/v1/admin/users/${userId}/authorities`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return await handleApiResponse(response);
}

const assignSeparateAuthoritiesToUser = async (userId, authorityIds) => {

  const accessToken = await getAccessToken();

  let requestParams = '';
  authorityIds.forEach(authorityId => {
    if (requestParams) requestParams += '&';
    requestParams += `authorityId=${authorityId}`;
  });
  if (requestParams) requestParams = '?' + requestParams;

  const response = await fetch(`${API_URL}/api/v1/admin/users/${userId}/authorities${requestParams}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return await handleApiResponse(response);
}

const createRole = async (roleName, authorityIds) => {

  const accessToken = await getAccessToken();

  const modifyRoleRequest = {
    name: roleName,
    authorities: authorityIds.map(authId => ({ id: authId }))
  };

  const response = await fetch(`${API_URL}/api/v1/admin/roles`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(modifyRoleRequest)
  });
  return await handleApiResponse(response);
}

const deleteRole = async (role) => {

  const accessToken = await getAccessToken();

  const response = await fetch(`${API_URL}/api/v1/admin/roles/${role.id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const status = response.status;
  if (status !== 200) {
    const body = await response.json();
    let errorMsg = body.message ? body.message : JSON.stringify(body);
    console.log("🚀 ~ file: ApiClient.js:391 ~ deleteRole ~ errorMsg:", errorMsg)
    // notify({ info: errorMsg, status: "failed" });

    // alert(errorMsg);
  }
};

const getProfileImage = async (userId) => {

  const accessToken = await getAccessToken();

  const response = await fetch(`${API_URL}/api/v1/users/${userId}/image`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const status = response.status;

  if (status === 200) {

    const imageBlob = await response.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    // console.log(imageObjectURL);
    return imageObjectURL;
  } else if (status === 401) {
    handle401();
  } else {
    const body = await response.json();
    let errorMsg = body.message ? body.message : JSON.stringify(body);
    console.log("🚀 ~ file: ApiClient.js:421 ~ getProfileImage ~ errorMsg:", errorMsg)
    // notify({ info: errorMsg, status: "failed" });

    // alert(errorMsg);
  }

};


export async function getAccessToken() {
  let access_token = await AsyncStorage.getItem('access_token');

  if (isTokenExpired(access_token)) {
    console.log("Token expired. Requesting new...")
    await updateAccessToken();
    // console.log("new AccessToken received");
    access_token = await AsyncStorage.getItem('access_token');
  }
  else {
    console.log("There is error in get Access Token ")
    await updateAccessToken();
    access_token = await AsyncStorage.getItem('access_token');
  }
  return access_token;
}

export const apiClient = {
  signIn,
  signOn,
  confirmRegistration,
  resetPassword,
  changePassword,



  getAllUsers,
  getUserById,
  updateUser,

  getProfileImage,

  getAllProperties,
  createProperty,
  updateProperty,
  bookProperty,

  getAllRoles,
  createRole,
  deleteRole,

  getAllAuthorities,
  getUserSeparateAuthorities,

  assignRolesToUser,
  assignSeparateAuthoritiesToUser


}

