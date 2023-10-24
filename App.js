import { StatusBar } from 'expo-status-bar';
import { Alert, BackHandler, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import Login from './screens/Login';

import { useContext, useEffect, useState, Suspense, useCallback } from 'react';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import Logout from './components/Logout';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import AppLoading from 'expo-app-loading';

import * as SplashScreen from 'expo-splash-screen';
import LoadingOverlay from './components/UI/LoadingOverlay';
import SettingsApp from './screens/SettingsApp';

// now 6/3
import CurrentAccounts from './screens/CurrentAccounts';
import ListUsers from './screens/ListUsers';
import { Provider, useSelector } from 'react-redux';
import store from './store';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppRegistry } from 'react-native';
import { authService } from './services/auth/AuthService';
import CurrentAccountsUsers from './screens/CurrentAccountsUsers';
import ListCurrentAccountMoves from './screens/ListCurrentAccountMoves';
import { Ionicons } from '@expo/vector-icons';
import i18n from './I18N';
import CustomDrawer from './components/UI/CustomDrawer';
import Toast from 'react-native-toast-message';
import ExchangeRates from './screens/ExchangeRates';
import TransferFees from './screens/TransferFees';
import HomeUser from './screens/notAuth/HomeUser';
import AboutUs from './screens/notAuth/AboutUs';
import Contact from './screens/notAuth/Contact';

// الحمد لله ربنا اليوم أكرمني وييسرها

// import LocalizedStrings from 'react-native-localization';
// import strings from './Localized';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();


const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
  },
};

function AuthStack() {
  return (
    <Drawer.Navigator initialRouteName='HomeUser'
      screenOptions={{
        animationTypeForReplace: 'push',
        gestureEnabled: true,
      }}
      drawerContent={props => <CustomDrawer {...props} />}
    >

      <Drawer.Screen name="HomeUser" component={HomeUser}
        options={{
          title: i18n.t("header_HomeUser_label"),
          headerTitleAlign: 'center'
        }}
      />

      <Drawer.Screen name="Login" component={Login}
        options={{
          title: i18n.t("header_login_label"),
          headerTitleAlign: 'center'
        }}
      />

      <Drawer.Screen name="Settings" component={SettingsApp}
        options={{
          title: i18n.t("header_settings_label"),
          headerTitleAlign: 'center'
        }}
      />

      <Drawer.Screen name="AboutUs" component={AboutUs}
        options={{
          title: "About Us",
          headerTitleAlign: 'center'
        }}
      />

      <Drawer.Screen name="Contact" component={Contact}
        options={{
          title: "Contact Us",
          headerTitleAlign: 'center'
        }}
      />

      {/*
        HomeUser / About Us / Send Money / services / ExchangeRates / Contact Us  
          <Route path="/aboutUs" element={<About />} />
          <Route path="/sendMoney" element={<SendMoney />} />
          <Route path="/services" element={<Services />} />
          <Route path="/exchangeRates" element={<ExchangeRates />} />
          <Route path="/contact" element={<Contact />} /> 
      */}

    </Drawer.Navigator>
  )
}

function AuthenticatedStack() {
  const navigation = useNavigation()

  return (
    <Drawer.Navigator initialRouteName='Home'
      screenOptions={{
        animationTypeForReplace: 'push',
        gestureEnabled: true,
      }}
      drawerContent={props => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={Home}
        options={{
          title: i18n.t("header_Home_label"),
          headerTitleAlign: 'center'
        }}
      />

      <Drawer.Screen name="ListUsers" component={ListUsers}
        options={{
          title: i18n.t("header_ListUsers_label"),
          headerTitleAlign: 'center'
        }}
      />

      <Drawer.Screen name="CurrentAccountsUsers" component={CurrentAccountsUsers}
        options={{
          title: i18n.t("header_CurrentAccountsUsers_label"),
          headerTitleAlign: 'center'
        }}
      />

      <Drawer.Screen name="ListCurrentAccountMoves" component={ListCurrentAccountMoves}
        options={{
          title: i18n.t("header_ListCurrentAccountMoves_label"),
          headerTitleAlign: 'center',
          drawerItemStyle: {
            display: "none",
          },
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.navigate("CurrentAccountsUsers")} >
              <Ionicons name="chevron-back-outline" color="black" size={25} />
            </TouchableOpacity>
          ),
        }}
      />

      <Drawer.Screen name="exchangeRates" component={ExchangeRates}
        options={{
          title: i18n.t("header_exchangeRates_label"),
          headerTitleAlign: 'center'
        }}
      />

      <Drawer.Screen name="transferFees" component={TransferFees}
        options={{
          title: i18n.t("header_transferFees_label"),
          headerTitleAlign: 'center'
        }}
      />

      <Drawer.Screen name="Settings" component={SettingsApp}
        options={{
          title: i18n.t("header_settings_label"),
          headerTitleAlign: 'center'
        }}
      />
      <Drawer.Screen name="Logout" component={Logout}
        options={{
          title: i18n.t("header_logout_label"),
          headerTitleAlign: 'center'
        }}
      />
    </Drawer.Navigator>
  )
}

function Navigation() {
  const authCTPtovider = useContext(AuthContext)

  const [appIsReady, setAppIsReady] = useState(false);


  const [loggedInUser, setLoggedInUser] = useState(authService.currentUserValue);

  useEffect(() => {
    authService.currentUser.subscribe(x => setLoggedInUser(x));
  }, [authService]);


  const isAuthenticated = !!loggedInUser;

  return (
    <NavigationContainer>
      {!isAuthenticated && <AuthStack />}
      {isAuthenticated && <AuthenticatedStack />}
      <Toast />
    </NavigationContainer>
  )
}

function Root() {

  const [isTryingLogin, setIsTryingLogin] = useState(true)
  const authCTX = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const exitHandler = () => {
      Alert.alert("Exit App", "are you sure that you want to exit app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "ok",
          onPress: () => BackHandler.exitApp()
        },
      ]);
      return true;
    }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", exitHandler)

    return () => backHandler.remove();
  }, [])


  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token")

      if (storedToken) {
        authCTX.authenticate(storedToken)
        setIsLoading(false);
        setIsTryingLogin(false)
      } else {
        setIsTryingLogin(false)
        setIsLoading(false)
      }
    }

    fetchToken()
  }, [isTryingLogin])



  if (isLoading || isTryingLogin) {
    async function hide() {
      await SplashScreen.hideAsync();
    }
    hide()
    return <LoadingOverlay />
  }

  return <Navigation />

}

const loadingMarkup = (
  <div className="py-4 text-center">
    <h3>Loading..</h3>
  </div>
)


const queryClient = new QueryClient();

export default function App() {
  // npm i  --reset-cache


  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={loadingMarkup} >
        <AuthContextProvider>
          <Provider store={store}>
            <Root />
          </Provider>
        </AuthContextProvider>
      </Suspense>
    </QueryClientProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerStyle: {
    backgroundColor: '#fff',
    width: 200,
  },
  drawerItem: {
    padding: 30,
    marginTop: 20
  },
});


AppRegistry.registerComponent('ghalbanapp', () => App);