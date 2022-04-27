import React, {useContext } from "react";
import { View, Text, StyleSheet } from "react-native";

function Header () {
    return(
        <View style={styles.HeaderContainer}>
            <Text style={styles.Text}>New Idea</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    HeaderContainer: {
        flexDirection: "row",
        height: 60,
        color: '#4d4a42',
        backgroundColor: '#cec8b0',
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        elevation: 10,
    },

    TextContainer: {
        flex: 5,
        //justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        paddingLeft: 10,
    },
    Text: {
        flex: 5,
        //justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        paddingLeft: 10,
        fontSize: 40,
        color: '#4d4a42',
        margin:0,
        //textAlign: 'center',
    },

    LogoutContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        borderRadius: 100,
    },
    LogoutButton: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        borderRadius: 100,
    },
    LogoutImage: {
        aspectRatio : 1,
        width: '100%',
    }
});

export default Header