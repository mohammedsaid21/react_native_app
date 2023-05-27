import { BehaviorSubject } from 'rxjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const currentUserSubject = new BehaviorSubject(null);
AsyncStorage.getItem('currentUser')
    .then(user => {
        // console.log("🚀 ~ file: AuthService.js:6 ~ AsyncStorage.getItem ~ user: ", user)
        currentUserSubject.next(JSON.parse(user));
    });

export const authService = {
    login,
    logout,
    updateLoggedInUserInfo,
    userHasAuthority,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value
    }
};

async function login(user, accessToken, refreshToken) {
    try {
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        await AsyncStorage.setItem('access_token', accessToken);
        await AsyncStorage.setItem('refresh_token', refreshToken);
        currentUserSubject.next(user);
        console.log("from authservice : ", user)
    } catch (error) {
        console.log(error);
    }
}

async function logout() {
    try {
        await AsyncStorage.removeItem('currentUser');
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        currentUserSubject.next(null);
        console.log('done logout ')
    } catch (error) {
        console.log(error);
    }
}

async function updateLoggedInUserInfo(user) {
    try {
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        currentUserSubject.next(user);
    } catch (error) {
        console.log(error);
    }
}

function userHasAuthority(authority) {
    return currentUserSubject.value?.authorities?.includes(authority);
}