import { View, Text } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { ImageBackground } from 'react-native'
import { authService } from '../../services/auth/AuthService'

const CustomDrawer = props => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        contentContainerStyle={{ backgroundColor: "#ccc", height: 170, width: "100%", justifyContent: 'center', alignItems: "center", flexDirection: "row", flex: 1 }}>

        <ImageBackground source={require("../../assets/ghalbanNlogo.png")}
          style={{ width: '70%', height: 50, }} resizeMode='contain' />
        <Text>{authService.currentUserValue && authService?.currentUserValue.username}</Text>
      </DrawerContentScrollView>

      <View style={{ flex: 3.5, paddingTop: 12  }} >
        <DrawerItemList {...props} />
      </View>

    </View>
  )
}

export default CustomDrawer