// React Native Bottom Navigation
// https://aboutreact.com/react-native-bottom-navigation/

import * as React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { ScrollView, Image, StyleSheet } from 'react-native';

const DetailsScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 25,
              textAlign: 'center',
              marginBottom: 16,
            }}>
            You are on Details Screen
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

// const DetailsScreen = ({ route }) => {
//   // const { item } = route.params;

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.imageContainer}>
//         {/* <Image source={{ uri: item.image }} style={styles.image} /> */}
//       </View>
//       <View style={styles.contentContainer}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.description}>{item.description}</Text>
//         <Text style={styles.price}>{`Price: $${item.price}`}</Text>
//         <Text style={styles.rating}>{`Rating: ${item.rating}/5`}</Text>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   imageContainer: {
//     height: 300,
//     width: '100%',
//     backgroundColor: '#f2f2f2',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   image: {
//     height: 200,
//     width: '80%',
//     resizeMode: 'contain',
//   },
//   contentContainer: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   price: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   rating: {
//     fontSize: 16,
//   },
// });

export default DetailsScreen;
