import React from 'react';
import {StatusBar, ImageBackground} from 'react-native';
import { ModalPortal } from 'react-native-modals';

//import SecureStore from 'expo-secure-store';
import AuthNavigation from './AuthNavigation';
import Toast, { BaseToast, SuccessToast, ErrorToast, InfoToast } from 'react-native-toast-message';

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <SuccessToast
      {...props}
      style={{ borderLeftColor: 'yellowgreen', height: 'auto', width: 'auto', margin: 20}}
      contentContainerStyle={{ padding: 10}}
      text2NumberOfLines={20}
      text1Style={{
        fontSize: 15,
        //fontWeight: '400'
      }}
      text2Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
    {...props}
    style={{ borderLeftColor: 'tomato', height: 'auto',  width: 'auto', margin: 20 }}
    contentContainerStyle={{ padding: 10}}
    text2NumberOfLines={20}
    text1Style={{
      fontSize: 15,
      //fontWeight: '400'
    }}
    text2Style={{
      fontSize: 15,
      fontWeight: '400'
    }}
    />
  ),

  info: (props) => (
    <SuccessToast
      {...props}
      style={{ borderLeftColor: 'blue', height: 'auto', width: 'auto', margin: 20}}
      contentContainerStyle={{ padding: 10}}
      text2NumberOfLines={20}
      text1Style={{
        fontSize: 15,
        //fontWeight: '400'
      }}
      text2Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
    />
  ),
}

export default function App() {
    return (
      <>
                <StatusBar
          animated={true}
          backgroundColor='#00000000'//"#4d4a42"
          barStyle='light-content'
          //showHideTransition={statusBarTransition}
          hidden={false}
          translucent={true}
          />
        <ImageBackground source={require('./images/loginbg.jpg')} style={{height: "100%"}}>

          <AuthNavigation />
        
          <Toast config={toastConfig}/>
        </ImageBackground>
        <ModalPortal />
      </>
    ) 
  }