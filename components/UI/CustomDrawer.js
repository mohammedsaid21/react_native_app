import { View, Text } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { ImageBackground } from 'react-native'
import { authService } from '../../services/auth/AuthService'
import Icon from 'react-native-vector-icons/FontAwesome'; // You can choose the icon library you prefer


const CustomDrawer = props => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        contentContainerStyle={{ backgroundColor: "#29C6DA", height: 170, width: "100%", justifyContent: 'center', alignItems: "center",  flex: 1, paddingTop: 50 }}>

        <ImageBackground source={require("../../assets/ghalbanNlogo.png")}
          style={{ width: '100%', height: 40, marginBottom: 15, }} resizeMode='contain' />
        
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between", width: '80%', }}>
          <Text style={{ color: "#fff", fontSize: 19 }}>{authService?.currentUserValue?.username}</Text>
          <Icon name="angle-down" size={25} color="#fff" />
        </View>

      </DrawerContentScrollView>

      <View style={{ flex: 3.5, paddingTop: 12 }} >
        <DrawerItemList {...props} />
      </View>

    </View>
  )
}

export default CustomDrawer