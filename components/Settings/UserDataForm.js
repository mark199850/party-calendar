import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContentLoader, { Facebook, Circle, Rect } from 'react-content-loader/native'
import Toast from 'react-native-toast-message';

var userUpdatedAt = null;

const UserDataForm = ({beginLoadData}) => {

    const [userId, setUserId] = useState('')
    const [userPP, setUserPP] = useState('');
    const [userFN, setUserFN] = useState('');
    const [userSN, setUserSN] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userUpdatedAt, setuserUpdatedAt] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if ( beginLoadData == true ) {
            AsyncStorage.getItem('id').then((id) => {
                setUserId(id);
                getUserData(id);
            })
        }
    }, [beginLoadData]);

    const showToast = (type,text1,text2) => {
        Toast.show({
            type: type,
            text1: text1,
            text2: text2,
            position: 'bottom'
        });
    }

    const getUserData = (userId) => {
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
                    setUserId(jsonRes[0].UserId),
                    setUserPP(jsonRes[0].UserPP);
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
        //  console.log(err);
        });
    }

    const getCurrentDate=()=>{

        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var hours = new Date().getHours();
        var minutes = new Date().getMinutes();
        var seconds = new Date().getSeconds();
  
        //Alert.alert(date + '-' + month + '-' + year);
        // You can turn it in to your desired format
        return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;//format: dd-mm-yyyy;
    }

    const Submit = () => {
        if( userFN == '' || userSN == '' || userEmail == '' ) {
            showToast('info','Info','Please fill all the required fields');
        }else{
            var userUpdatedAt = getCurrentDate();
            const payload = {
                userId,
                userPP,
                userFN,
                userSN,
                userEmail,
                userUpdatedAt
            };
            fetch(`${global.NodeJS_URL}/api/update/user/userId`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
            .then(async res => { 
                try {
                    if (res.status !== 200) {
                        const jsonRes = await res.json();
                        showToast('error','Error',jsonRes.message);
                    } else {
                        const jsonRes = await res.json();
                        showToast('success','Success',jsonRes.message);
                        //console.log(jsonRes);
                    }
                } catch (err) {
                // console.log(err);
                showToast('error','Error',err.toString());
                };
            })
            .catch(err => {
            //   console.log(err);
            showToast('error','Error',err.toString());
            });
        }
    }
    return(
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerPillContainer}>
                    <View style={styles.headerPill}></View>
                </View>
                <Text style={styles.headerText}>Edit Profile</Text>
            </View>
            { isLoading ? 
                <>
                    <LoadingPlaceholder style={{flex: 1}}/>
                    <LoadingPlaceholder style={{flex: 1}}/>
                    <LoadingPlaceholder style={{flex: 1}}/>
                    <LoadingPlaceholder style={{flex: 1}}/>
                    <LoadingPlaceholderButton style={{flex: 1}}/>
                </>
            :
                <>
                    <Text style={styles.label}>E-mail: {userEmail.length}/40</Text>
                    <TextInput style={styles.input} onChangeText={setUserEmail} maxLength={40} placeholder="E-mail" placeholderTextColor = 'lightgrey' autoCapitalize="none">{userEmail}</TextInput>
                    
                    <Text style={styles.label}>Forename: {userFN.length}/20</Text>
                    <TextInput style={styles.input} onChangeText={setUserFN} maxLength={20} placeholder="Forename" placeholderTextColor = 'lightgrey' autoCapitalize="none">{userFN}</TextInput>
                    
                    <Text style={styles.label}>Surname: {userSN.length}/20</Text>
                    <TextInput style={styles.input} onChangeText={setUserSN} maxLength={20} placeholder="Surname" placeholderTextColor = 'lightgrey' autoCapitalize="none">{userSN}</TextInput>
                    
                    <Text style={styles.label}>Profile picture link (optional): {userPP.length}/1000 </Text>
                    <TextInput style={styles.input} onChangeText={setUserPP} maxLength={1000} placeholder="Profile Picture URL" placeholderTextColor = 'lightgrey' autoCapitalize="none">{userPP}</TextInput>
                    
                    <TouchableHighlight style={styles.submitBtn} /*onPress={() => {}}*/ onPress={Submit} underlayColor={'#32302a'}>
                        <Text style={styles.submitBtnText}>Apply</Text>
                    </TouchableHighlight>
                </>
            }
        </View>
    )
}

const LoadingPlaceholder = () => (
    <ContentLoader foregroundColor="#ada585"/*"#9b957d"*/ backgroundColor="#b8b094"/*"#ada585"*/ width="100%" height="90">
        <Rect x="0%" y="8%" rx="1" ry="2" width="20%" height="15%" />

        <Rect x="0%" y="35%" rx="10" ry="2" width="100%" height="40%" />

    </ContentLoader>
  )

  const LoadingPlaceholderButton = () => (
    <ContentLoader foregroundColor="#ada585"/*"#9b957d"*/ backgroundColor="#b8b094"/*"#ada585"*/ width="100%" height="100">
        <Rect x="0%" y="55%" rx="10" ry="2" width="100%" height="50%" />

    </ContentLoader>
  )


const styles = StyleSheet.create({
    
    container: {
        backgroundColor: "#f2f1e1",
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    headerContainer: {
        height: 80,
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
    headerText: {
        color: '#4d4a42',
        fontSize: 30,
        marginBottom: 20,
    },
    label: {
        color: '#4d4a42',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        fontSize: 16, 
        minHeight: 40,
        color: 'black',
        backgroundColor: 'white',
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 20,
        paddingLeft: 10,
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
    },
    submitBtnText: {
        color: 'white',
        fontSize: 20,
    },
  });
  
  export default UserDataForm;