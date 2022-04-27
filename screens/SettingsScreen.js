import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import Header from "../components/Settings/Header";
import OptionList from '../components/Settings/OptionList';

const SettingsScreen = ({userPP, userName}) => {
    return(
        <SafeAreaView style={styles.container}>
            <Header userName={userName} />
            <OptionList userName={userName} userPP={userPP}/>
        </SafeAreaView>
        

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      //paddingTop: getStatusBarHeight(),
    },
  });


export default SettingsScreen;