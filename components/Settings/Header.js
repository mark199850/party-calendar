import React, { useContext } from "react";
import { View, Text, Image, Dimensions, StyleSheet, TouchableHighlight } from "react-native";
import { AuthContext } from '../../components/globals/Context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function Header ({...navigation}) {
    return(
        <View style={styles.HeaderContainer}>
            <Text style={styles.Text}>My Profile </Text>
            <LogoutButton  {...navigation}/>
        </View>
    )
}


const LogoutButton = ({...navigation}) => {
    const { signOut } = useContext(AuthContext);

    const onSubmitHandler = () => {
        
        signOut();
    };

    return(
        <View style={styles.LogoutContainer}>
            <TouchableHighlight 
                underlayColor={'rgba(0,0,0,0.3)'}
                style={styles.LogoutButton}
                onPress={onSubmitHandler}>
                <MaterialCommunityIcons name="star" color="#4d4a42" size={34} />

            </TouchableHighlight>
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