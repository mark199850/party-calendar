import React, { useState, useEffect, useContext, useMemo } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../components/globals/Context';
import { PanelHandlerContext } from '../globals/Context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomModal from "../globals/CustomModal";

//import NonScrollableModal from "../globals/NonScrollableModal";

const OptionList = () => {
    const [userName, setUserName] = useState(null)
    const [userPP, setUserPP] = useState(null)
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => { 
        AsyncStorage.getItem('name').then((name) => {
            AsyncStorage.getItem('pp').then((pp) => {
                setUserName(name);
                setUserPP(pp);
            })
        })
    }, []);
        
    const panelHandlerContext = useMemo(() => ({
        openPanel: () => {
            setModalVisible(true);
        },
         closePanel: () => {
            setModalVisible(true);
        }}))



    useEffect(() => { 
        console.log(isModalVisible);

    }, [isModalVisible]);

    return(
        <PanelHandlerContext.Provider value={panelHandlerContext}>

        <View style={styles.container}>
                <FastImage style={styles.profileImg} source={{uri: userPP}} />
                <Text style={styles.userName}>{userName}</Text>               
            
            <View style={{flex: 1}}>
            <TouchableHighlight style={styles.submitBtn} /*onPress={() => {}}*/ onPress={() => ([setModalVisible(true), underlayColor='#32302a'])}>
                <Text style={styles.submitBtnText}>Edit profile data</Text>
            </TouchableHighlight>
            <CustomModal showModal={isModalVisible} contentprop={"editProfile"} />

            {/* <CustomModal showModal={isModalVisible} toggleModal={toggleModal} /> */}
            {/* <NonScrollableModal isVisible={isModalVisible} onSwipeComplete={toggleModal}/> */}
            </View>
            <LogoutButton/>
        </View>
        </PanelHandlerContext.Provider>
    )
}

const LogoutButton = () => {
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
    container: {
        flex:13,
        alignItems: 'center',
        backgroundColor: '#000000BB',
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