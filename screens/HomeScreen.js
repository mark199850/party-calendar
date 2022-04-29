import React, { useState, useMemo } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
//import { Rating, AirbnbRating } from 'react-native-ratings';
import Articles from '../components/Home/Articles';
import Footer from '../components/Home/Footer';
//import { getStatusBarHeight } from 'react-native-status-bar-height';

const HomeScreen = () => {
 
  const [searchedStr, setSearchedStr] = useState('');

  const searchArticle = (str) => {
    setSearchedStr(str);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Articles searchedStr={searchedStr}/> 
      <Footer searchArticle={searchArticle}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  '#00000000',//"#cec8b0"
    //paddingTop: getStatusBarHeight(),
  },
});

export default HomeScreen;
