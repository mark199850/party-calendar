import React  from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import OptionList from '../components/Settings/OptionList';
import Modal from '../components/Settings/Modal';
const SettingsScreen = () => {

return(
        <SafeAreaView style={styles.container}>
            <OptionList />
            <Modal />
        </SafeAreaView>
        

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#00000000'
      //paddingTop: getStatusBarHeight(),
    },
  });


export default SettingsScreen;