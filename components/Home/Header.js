import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const Header = ({searchArticle}) => {

    const [search, setSearch] = useState(false);
    const [searchText, setSearchText ] = useState('');
    const toggleSearchBar = (bool) => {
        setSearch(bool);
        if (bool == false ) {
            searchArticle('');
        }
    }

    const showToast = (type,text1,text2) => {
        Toast.show({
            type: type,
            text1: text1,
            text2: text2,
            position: 'bottom'
        });
    }


    return(
        <View style={styles.HeaderContainer}>
            {search == true ?
                <>
                    <TextInput style={styles.TextInput} onChangeText={(text) => {searchArticle(text)}} placeholder="Search" placeholderTextColor = 'lightgrey' autoCapitalize="none"></TextInput>
                    <CancelButton toggleSearchBar={toggleSearchBar}/>
                </>
            :
                <>
                    <Text style={styles.Text}>IdeaShare</Text>
                    <SearchButton toggleSearchBar={toggleSearchBar}/>
                </>
            }
        </View>
    )
}


const SearchButton = ({toggleSearchBar}) => {

    return(
        <View style={styles.buttonContainer}>
            <TouchableOpacity 
                underlayColor={'rgba(0,0,0,0.3)'}
                style={styles.button}
                onPress={() => toggleSearchBar(true)}>
                <MaterialCommunityIcons name="magnify" color={'#4d4a42'} size={40} />
            </TouchableOpacity>
        </View>
    )
}

const CancelButton = ({toggleSearchBar}) => {

    return(
        <View style={styles.buttonContainer}>
            <TouchableOpacity 
                underlayColor={'rgba(0,0,0,0.3)'}
                style={styles.button}
                onPress={() => toggleSearchBar(false)}>
                <MaterialCommunityIcons name="window-close" color={'#4d4a42'} size={40} />
            </TouchableOpacity>
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
    TextInput: {
        flex: 5,
        //justifyContent: 'center',
        fontSize: 25,
        paddingBottom:3,
        alignItems: 'center',
        flexDirection: "row",
        paddingLeft: 10,
        color: '#4d4a42',
        margin:0,
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 10,
        //textAlign: 'center',
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

    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        borderRadius: 100,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        borderRadius: 100,
    },
});

export default Header