import { View, Text, Button, I18nManager, DevSettings } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../store/auth-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from '../I18N';
import { getLocales } from 'expo-localization';
// import { i18n } from '../translation/i18n';
import RNRestart from 'react-native-restart';
import LoadingOverlay from '../components/UI/LoadingOverlay';

const SettingsApp = () => {
  const deviceLanguage = getLocales()[0].languageCode;
  const [localeLang, setLocaleLang] = useState(i18n.locale)
  const [loading, setLoading] = useState(false)

  const ChangLang = async () => {
    setLoading(true)
    i18n.locale = localeLang === 'en' ? 'ar' : 'en'
    setLocaleLang(i18n.locale)

    if (i18n.locale == 'en') {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
      // console.log('en 1 ', I18nManager.isRTL)
    } else {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      // console.log('ar 2 ', I18nManager.isRTL)
    }
    await AsyncStorage.setItem('lang', i18n.locale)
      .then(() => DevSettings.reload())

  }

  if (loading) {
    return <LoadingOverlay />
  }


  return (
    <View>
      <Button
        title={i18n.t("toggle_Language")}
        onPress={() => ChangLang()}
      />
    </View>
  )
}

export default SettingsApp