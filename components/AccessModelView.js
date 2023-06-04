import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';

const AccessModelView = () => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={{ uri: 'https://placeimg.com/640/480/animals' }}
            />
            <TouchableOpacity style={styles.button}>
                <Text style={[styles.buttonText, styles.button1]}>Allow as Primary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={[styles.buttonText, styles.button2]}>Allow Once</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={[styles.buttonText, styles.button3]}>Deny Access</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#F5FCFF',
        // marginTop: 100, // set marginTop to 0
        marginTop: 175,

    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#314D67',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default AccessModelView;

