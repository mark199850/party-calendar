import React from 'react';
import { View, StyleSheet} from 'react-native';
import Header from "../components/NewArticle/Header";
import ArticleDataForm from '../components/NewArticle/ArticleDataForm';

const NewArticleScreen = () => {
    return(
          <View style={styles.container}>
            <Header/>
            <ArticleDataForm/>
          </View>

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      //paddingTop: getStatusBarHeight(),
    },
  });


export default NewArticleScreen;