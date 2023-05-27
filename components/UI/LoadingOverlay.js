import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import i18n from '../../I18N';

// const [spinValue, setSpanValue] = useState(new Animated.Value(0));
// useEffect(() => {
//   Animated.loop(
//     Animated.timing(spinValue, {
//       toValue: 1,
//       duration: 1000,
//       easing: Easing.linear,
//       useNativeDriver: true,
//     }),
//   ).start();
// }, [spinValue]);
// const spin = spinValue.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['0deg', '360deg'],
// });

function LoadingOverlay({ message }) {
  let messageNew = message || i18n.t('loading') ;
  "Loading ....."
  return (
    <View style={styles.rootContainer}>
      <ActivityIndicator size="large" />
      <Text style={styles.message}>{messageNew}</Text>
    </View>
  );
}



export default LoadingOverlay;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  message: {
    fontSize: 13,
    marginTop: 12,
  },
});