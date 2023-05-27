import LocalizedStrings from 'react-native-localization';
import ar from './translation/ar';
import en from './translation/en';

let strings = new LocalizedStrings({
  en: en,
  ar: ar,
});

export default strings;