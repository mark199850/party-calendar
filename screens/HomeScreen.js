import React, { useState, useMemo } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
//import { Rating, AirbnbRating } from 'react-native-ratings';
import Articles from '../components/Home/Articles';
import Header from '../components/Home/Header';
//import { getStatusBarHeight } from 'react-native-status-bar-height';

const HomeScreen = () => {
 
  const [searchedStr, setSearchedStr] = useState('');

  const searchArticle = (str) => {
    setSearchedStr(str);
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <Header searchArticle={searchArticle}/>
      <Articles searchedStr={searchedStr}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cec8b0"
    //paddingTop: getStatusBarHeight(),
  },
});

export default HomeScreen;
