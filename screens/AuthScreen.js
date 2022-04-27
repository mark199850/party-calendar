import React, { useState, useContext} from 'react';
import { Dimensions, View, ScrollView, Text, StyleSheet, TouchableOpacity, TouchableHighlight, TextInput, useWindowDimensions, StatusBar, SafeAreaView } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { AuthContext } from '../components/globals/Context';

import MaskInput, { Masks } from 'react-native-mask-input';
import Toast from 'react-native-toast-message';

//import {useStateIfMounted} from 'use-state-if-mounted';
//import DatePicker from 'react-native-date-picker'
var userCreatedAt = null;
var userUpdatedAt = null;

function AuthScreen ({navigation}) {

    const [userUn, setUserUn] = useState('');
    const [userPw, setUserPw] = useState('');
    const [userPw2, setUserPw2] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userFN, setUserFN] = useState('');
    const [userSN, setUserSN] = useState('');
    const [userDob, setUserDob] = useState('');
    const [userPP, setUserPP] = useState('');

    const [isLogin, setIsLogin] = useState(true);  

    const { signIn } = useContext(AuthContext);

    const showToast = (type,text1,text2) => {
        Toast.show({
            type: type,
            text1: text1,
            text2: text2,
            position: 'bottom'
        });
    }

    const onChangeHandler = () => {
        setIsLogin(!isLogin);
    };

    const onLoggedIn = (token,UserUn,UserId,UserPP) => {
        fetch(`${global.NodeJS_URL}/api/login/user/auth`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': `Bearer ${token}`,
                'x-access-token': token,
            },
        })
        .then(async res => { 
            try {
                if (res.status === 200) {
                    const jsonRes = await res.json();
                    showToast('success', 'Success', jsonRes.message);
                    /* navigation.navigate('Home', {
                        paramKey: jsonRes.userName,
                      }); */
                      signIn(token, UserUn, UserId, UserPP);
                }else{
                    const jsonRes = await res.json();
                    showToast('error', 'Error', jsonRes.message);
                }
            } catch (err) {
                showToast('error', 'Error', err.toString());
                //console.log(err);
            };
        })
        .catch(err => {
            showToast('error', 'Error', err.toString());
            //console.log(err);
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
        return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
  }

    const onSubmitHandler = () => {

        if(
            ( !isLogin && (userUn == '' || userPw == '' || userPw2 == '' || userEmail == '' || userFN == '' || userSN == '' || userDob == '' ))
            || 
            ( isLogin && (userUn == '' || userPw == '') )
            )
            {
            showToast('info','Info','Please fill all the required fields');
        }else if( !isLogin && userPw !== userPw2 ){
            showToast('info','Info','Passwords do not match');
        }else{
            userCreatedAt = userUpdatedAt = getCurrentDate();
            const payload = {
                userUn,
                userPP,
                userPw,
                userFN,
                userSN,
                userDob,
                userEmail,
                userCreatedAt,
                userUpdatedAt,
            };
            fetch(`${global.NodeJS_URL}/api/${isLogin ? 'login/user' : 'register/user'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            .then(async res => { 
                try {
                    if (res.status !== 200) {
                        const jsonRes = await res.json();
                        //showToast('error', 'Error', jsonRes.message)
                    } else {
                        const jsonRes = await res.json();
                        if (isLogin) {
                            if (jsonRes.auth == true ) {
                                onLoggedIn(jsonRes.token,jsonRes.result[0].UserUn,jsonRes.result[0].UserId, jsonRes.result[0].UserPP);
                            }else{
                                showToast('error', 'Error', jsonRes.message)
                            }
                        }else if (!isLogin) {
                            showToast('success', 'Success', jsonRes.message)
                        }
                    }
                } catch (err) {
                    showToast('error', 'Error', err.toString())
                    // console.log(err);
                };
            })
            .catch(err => {
                showToast('error', 'Error', err.toString())
                // console.log(err);
            });
        }
        
    };

    const windowHeight = useWindowDimensions().height;

    return (
        <SafeAreaView style={styles.screenContainer}>
        <View style={[{ minHeight: Math.round(windowHeight), height:Dimensions.get('screen').height }]}>
            <View style = {styles.titleGradient}>
                    <Text style={styles.titleText}>IdeaShare</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.heading}>{isLogin ? 'Login' : 'Signup'}</Text>
                    <View style={styles.form}>
                            {!isLogin ?
                                <ScrollView style={styles.inputs}>
                                    <TextInput style={styles.input} placeholder="Username" placeholderTextColor='darkgrey' autoCapitalize="none" onChangeText={setUserUn}></TextInput>
                                    <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor='darkgrey' onChangeText={setUserEmail}></TextInput>
                                    <TextInput style={styles.input} placeholder="Forename" placeholderTextColor='darkgrey' onChangeText={setUserFN}></TextInput>
                                    <TextInput style={styles.input} placeholder="Surname" placeholderTextColor='darkgrey' onChangeText={setUserSN}></TextInput>
                                   {/*  <TextInput style={styles.input} placeholder="Date of Birth" placeholderTextColor= 'darkgrey' onPress={() => setOpen(true)} onChangeText={userDob}></TextInput>
                                    <DatePicker
                                            modal
                                            open={open}
                                            date={date}
                                            onConfirm={(date) => {
                                            setOpen(false)
                                            setDate(date)
                                            }}
                                            onCancel={() => {
                                            setOpen(false)
                                            }}
                                        /> */}
                                    <MaskInput style={styles.input} placeholder="Date of Birth, eg. 1990/01/01" placeholderTextColor='darkgrey' value={userDob} onChangeText={(masked, unmasked) => {setUserDob(masked)}}       mask={Masks.DATE_YYYYMMDD/*[/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]*/}/>
                                    <TextInput secureTextEntry={true} style={styles.input} placeholder="Password" placeholderTextColor='darkgrey'  onChangeText={setUserPw}></TextInput>
                                    <TextInput secureTextEntry={true} style={styles.input} placeholder="Password again" placeholderTextColor='darkgrey'  onChangeText={setUserPw2}></TextInput>
                                    <TextInput style={styles.input} placeholder="Profile picture link (optional)" placeholderTextColor='darkgrey'  onChangeText={setUserPP}></TextInput>

                                </ScrollView>
                            : 
                                <View style={styles.inputs}>
                                    <TextInput style={styles.input} placeholder="Username" placeholderTextColor='darkgrey' autoCapitalize="none" onChangeText={setUserUn}></TextInput>
                                    <TextInput style={styles.input} placeholder="Password" placeholderTextColor='darkgrey' onChangeText={setUserPw} secureTextEntry={true}></TextInput>
                                </View>
                            }
                    </View>
                </View>
                <View style={styles.footer}>
                     {/* <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{getmessage ? getMessage() : null}</Text> */}
                    <TouchableHighlight style={styles.button} onPress={onSubmitHandler} underlayColor={'#32302a'}>
                        <Text style={styles.buttonText}>Done</Text>
                    </TouchableHighlight>
                    <TouchableOpacity style={styles.buttonAlt} onPress={onChangeHandler}>
                        <Text style={styles.buttonAltText}>{isLogin ? 'Sign Up' : 'Log In'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* <View style={styles.footer}>
                <Image style={styles.footerImg} source={require('../public/images/bulb.png')}></Image>
            </View> */}
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f2f1e1', //'#ECF0F1'
      },
        titleGradient: {
            flex: 2,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: getStatusBarHeight(),
            //backgroundColor: '#009688',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            width: '100%',
            elevation: 10,
        },
            titleText: {
                fontSize: 50,
                color: '#4d4a42', //'#eeffff',
            },
        container: {
            flex: 9,
            width: '100%',
        },
            formContainer: {
                flex: 3,
                padding: 45,
                paddingBottom: 0,
            },
                heading: {
                    fontSize: 30,
                    fontWeight: 'bold',
                    color: '#4d4a42',//'#8aacc8',
                    marginBottom: 20,
                },
                form: {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                    inputs: {
                        width: '100%',

                    }, 
                        input: {
                            backgroundColor: 'white',
                            borderRadius: 10,
                            marginBottom: 10,
                            paddingLeft: 10,
                            minHeight: 40,
                            color: 'black',
                            margin: 5,
                            elevation: 2,
                        },
            footer: {
                height: 150,
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 50,
                paddingRight: 50,
            },
                button: {
                    width: '100%',
                    backgroundColor: '#4d4a42',
                    height: 40,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 5,
                },
                buttonText: {
                    color: 'white',
                    fontSize: 16,
                    fontWeight: '400'
                },
                buttonAlt: {
                    width: '100%',
                    borderWidth: 1,
                    height: 40,
                    borderRadius: 5,
                    borderColor: '#4d4a42'/*'#8aacc8'/*'#0077c2'*/,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 5,
                },
                buttonAltText: {
                    color: '#4d4a42',//'#8aacc8',
                    fontSize: 16,
                    fontWeight: '400',
                },
                message: {
                    fontSize: 16,
                },
});

export default AuthScreen;