import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage';

//import NonScrollableModal from "../globals/NonScrollableModal";

const OptionList = () => {
    const [userName, setUserName] = useState(null)
    const [userPP, setUserPP] = useState(null)

    useEffect(() => { 
        AsyncStorage.getItem('name').then((name) => {
            AsyncStorage.getItem('pp').then((pp) => {
                setUserName(name);
                setUserPP(pp);
            })
        })
    }, []);
        
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
      };


    return(
        <View style={styles.container}>
                <FastImage style={styles.profileImg} source={{uri: userPP}} />
                <Text style={styles.userName}>{userName}</Text>               
            
            <View style={{flex: 1}}>
            <TouchableHighlight style={styles.submitBtn} /*onPress={() => {}}*/ onPress={toggleModal} underlayColor={'#32302a'}>
                <Text style={styles.submitBtnText}>Edit profile data</Text>
            </TouchableHighlight>
            {/* <NonScrollableModal isVisible={isModalVisible} onSwipeComplete={toggleModal}/> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:13,
        alignItems: 'center',
    },
    profileImg: {
        height: 100,
        marginTop: 10,
        alignItems: 'center',
        aspectRatio: 1,
        borderRadius: 10000,
    },
    userName: {
        color: 'black',
        fontSize: 30,
    },
    submitBtn: {
        marginTop: 20,
        height: 50,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: '#4d4a42',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 10,
    },
    submitBtnText: {
        color: 'white',
        fontSize: 20,
    },
});

export default OptionList