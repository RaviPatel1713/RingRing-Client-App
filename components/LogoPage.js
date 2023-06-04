import { StyleSheet, View, Image } from 'react-native';

// Create a new component for the app logo page
export default function LogoPage() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/ringring_t.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#314D67'
  },
  logo: {
    width: 250,
    height: 250
  },
});
