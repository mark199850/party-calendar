import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContentLoader, { Facebook, Circle, Rect } from 'react-content-loader/native'
import Toast from 'react-native-toast-message';
import FastImage from 'react-native-fast-image'

var userUpdatedAt = null;

const UserDataForm = ({userId}) => {

    const [userPP, setUserPP] = useState('');
    const [userUn, setUserUn] = useState('');
    const [userFN, setUserFN] = useState('');
    const [userSN, setUserSN] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userUpdatedAt, setuserUpdatedAt] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getUserData();
    }, []);

    const showToast = (type,text1,text2) => {
        Toast.show({
            type: type,
            text1: text1,
            text2: text2,
            position: 'bottom'
        });
    }

    const getUserData = () => {
        fetch(`${global.NodeJS_URL}/api/get/userById`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'userIdUpd' : userId,
            },
        })
        .then(async res => { 
            try {
                if (res.status !== 200) {
                    const jsonRes = await res.json();
                    setIsLoading(false);
                    showToast('error','Error',jsonRes.message);
                } else {
                    const jsonRes = await res.json();
                    setIsLoading(false);
                    setUserPP(jsonRes[0].UserPP);
                    setUserUn(jsonRes[0].UserUn);
                    setUserFN(jsonRes[0].UserFN);
                    setUserSN(jsonRes[0].UserSN);
                    setUserEmail(jsonRes[0].UserEmail);
                }
            } catch (err) {
                setIsLoading(false);
                showToast('error','Error', err.toString());
            // console.log(err);
            };
        })
        .catch(err => {
            setIsLoading(false);
            showToast('error','Error',err.toString());
            // console.log(err);
        });
    }

    
    return(
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerPillContainer}>
                    <View style={styles.headerPill}></View>
                </View>
            </View>
            { isLoading ? 
                <>
                    <LoadingPlaceholderImg style={{flex: 1}}/>
                    <LoadingPlaceholder style={{flex: 1}}/>
                    <LoadingPlaceholder style={{flex: 1}}/>
                    <LoadingPlaceholder style={{flex: 1}}/>
                    <LoadingPlaceholder style={{flex: 1}}/>
                </>
            :
                <>
                    <FastImage source={{uri: userPP}} style={styles.ProfilePic}/>
                    <Text style={styles.UsernameText} selectable={true}>{userUn}</Text>
                    <ScrollView>
                        <Text style={styles.label}>E-mail</Text>
                        <Text style={styles.text} selectable={true} placeholder="E-mail" placeholderTextColor = 'lightgrey' autoCapitalize="none">{userEmail}</Text>
                        
                        <Text style={styles.label}>Forename</Text>
                        <Text style={styles.text} selectable={true} placeholder="Forename" placeholderTextColor = 'lightgrey' autoCapitalize="none">{userFN}</Text>
                        
                        <Text style={styles.label}>Surname</Text>
                        <Text style={styles.text} selectable={true} placeholder="Surnsme" placeholderTextColor = 'lightgrey' autoCapitalize="none">{userSN}</Text>
                        
                        <Text style={styles.label}>Profile picture link</Text>
                        <Text style={styles.text} selectable={true} placeholder="Profile Picture URL" placeholderTextColor = 'lightgrey' autoCapitalize="none">{userPP}</Text>
                        
                    </ScrollView>
                </>
            }
        </View>
    )
}

const LoadingPlaceholderImg = () => (
    <ContentLoader foregroundColor="#ada585"/*"#9b957d"*/ backgroundColor="#b8b094"/*"#ada585"*/ width="100%" height="170">
        <Circle cx="50%" cy="50" r="48" />

        <Rect x="28%" y="120" rx="10" ry="2" width="44%" height="30" />

    </ContentLoader>
  )

const LoadingPlaceholder = () => (
    <ContentLoader foregroundColor="#ada585"/*"#9b957d"*/ backgroundColor="#b8b094"/*"#ada585"*/ width="100%" height="100">
        <Rect x="0%" y="8%" rx="1" ry="2" width="20%" height="15%" />

        <Rect x="0%" y="35%" rx="10" ry="2" width="80%" height="20%" />

    </ContentLoader>
  )

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: "#f2f1e1",
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    headerContainer: {
        height: 40,
        flexDirection: 'column',
    },
        headerPillContainer: {
            height: 30,
            alignContent: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            padding: 11,
        },
            headerPill: {
                height: '100%',
                width: '20%',
                backgroundColor: '#4d4a42',
                borderRadius: 10000,
            },
    ProfilePic: {
        aspectRatio: 1,
        height:100,
        alignSelf: 'center',
        borderRadius: 10000,
        marginBottom: 10,
    },
    UsernameText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#4d4a42',
        alignSelf: 'center',
        marginBottom: 20
    },
    label: {
        color: '#4d4a42',
        marginBottom: 10,
    },
    text: {
        width: '100%',
        fontSize: 16, 
        minHeight: 40,
        color: 'black',
       // backgroundColor: 'white',
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 20,
        paddingLeft: 10,
    },
  });
  
  export default UserDataForm;