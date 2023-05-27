import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../store/auth-context'
import { authService } from '../services/auth/AuthService'

const Logout = (  ) => {
  const authCTPtovider = useContext(AuthContext)

  useEffect(() => {
    authService.logout();
    authCTPtovider.logout()
  }, [])

  return (
    <View>
      <Text>Logout</Text>
    </View>
  )
}

export default Logout