import React, { Component } from 'react';
import { Alert } from 'react-native';
import { SignedInStack, SignedOutStack } from './navigation';
import { AuthContext } from './components/globals/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthNavigation extends Component{
    state = {token : null, name: null, id: null, pp: null, isLoading: true};

componentDidMount(){

    AsyncStorage.getItem('token').then((token) => {
        AsyncStorage.getItem('id').then((id) => {
            AsyncStorage.getItem('name').then((name) => {
                AsyncStorage.getItem('pp').then((pp) => {
                    if(token && token != null) {
                        this.setState({token: token, name: name, id:id, pp: pp, isLoading: false});
                        //  setUserToken(token);
                    }else{
                        this.setState({token: null, name: null, id:null, pp: null, isLoading: false});
                    }
                })
            })
        })
    })
}
render(){
    const createTwoButtonAlert = (value) =>
    Alert.alert(
      "Alert Title",
      "My Alert Msg" +value,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );


    const authContext = () => ({
        signIn: (token,name,id,pp) => {
            //console.log(id);
            AsyncStorage.setItem('token', token).then(()=>{
                AsyncStorage.setItem('name', name).then(() =>{
                    AsyncStorage.setItem('id', id).then(() =>{
                        AsyncStorage.setItem('pp', pp).then(() =>{
                            this.setState({token: token, name: name, id: id, pp: pp, isLoading: false});
                        })
                    })
                })
            })
        },
        signOut: () => {
            AsyncStorage.removeItem('token').then(()=>{
                AsyncStorage.removeItem('name').then(() =>{
                    AsyncStorage.removeItem('id').then(() =>{
                        AsyncStorage.removeItem('pp').then(() =>{
                            this.setState({token: null, name: null, id: null, pp: null, isLoading: false});
                        })
                    })
                })
            })
        },
        signUp: ({token}) => {
            this.setState({token: token, name: name});
        },
    });


    return(
        
        //return <>{currentUser ? <SignedInStack />: <SignedOutStack />}</>
        <AuthContext.Provider value={authContext()}>
            {this.state.isLoading == false && (
                this.state.id != null && this.state.token != null ? (
                     <SignedOutStack userName={this.state.name}/>  
                    ):(
                         <SignedInStack userName={this.state.name} userPP={this.state.pp}/> 
                    )
                )
            
            }

        </AuthContext.Provider>
    )}
}


export default AuthNavigation