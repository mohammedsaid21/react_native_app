import AsyncStorage from '@react-native-async-storage/async-storage';
import ar from './translation/ar';
import en from './translation/en';
// الحمد لله ربنا اليوم أكرمني وييسرها
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Set the key-value pairs for the different languages you want to support.
const translations = {
  en,
  ar
};

const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
const languageCode = Localization.locale.split('-')[0];
// i18n.locale = languageCode;
// i18n.locale = 'ar'; // for Arabic 

const loadLastLang = async () => {
  // const selectedLanguage = await AsyncStorage.getItem("lang");
  // console.log("selectedLanguage : ", selectedLanguage)
  // if (selectedLanguage === 'en') {
  //   i18n.locale = 'en';
  // } else {
  //   i18n.locale = 'ar'
  // }

  AsyncStorage.getItem('lang')
    .then(lang => {
      if (lang == 'en') i18n.locale = 'en'
      else i18n.locale = 'ar'
    });

  // localize.rtlLayoutDirection(isRTL);

  // Listen for locale changes
  // Localization.addLocaleChangeListener(locale => {
  //   i18n.locale = locale;
  //   AsyncStorage.setItem('lang', locale);
  // });

}
loadLastLang()



// console.log("Localization.locale : ", i18n.locale)

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;
// To see the fallback mechanism uncomment the line below to force the app to use the Japanese language.
// i18n.locale = 'en';

export default i18n;