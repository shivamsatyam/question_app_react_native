import React, { useState, useEffect, useLayoutEffect,useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  Modal,
  Pressable,
  Alert,
  AsyncStorage
} from 'react-native';
import { db } from '../firebase';
import LottieView from 'lottie-react-native';
import Constants from 'expo-constants';
import CardBox from '../components/CardBox';

import { Card } from 'react-native-paper';
export default function SubjectScreen({navigation}) {
  const [subject, setSubject] = useState(null);
  



  useEffect(() => {
    const unsubscribe = db.collection('main').onSnapshot((snapshot) => {
      setSubject(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, []);

  const addQuestion = ()=>{
  AsyncStorage.getItem('email').then((data)=>{
     
      if(data==="softgooddeveloper@gmail.com"){
        navigation.navigate('AddQuestion')
      }else{
        alert("you are not authorised to add question")
      }
    })
 
 
 
  }

  const changeScreen = (id)=>{
  
    navigation.navigate('ListScreen',{
      id:id
    })
  }

if(subject===null){
   return <LottieView source={require('../assets/9329-loading.json')} autoPlay loop />
}
  return (
    <>

      <ScrollView style={styles.container}>
       

        {subject ? (
          subject.map((item, index) => (
            <CardBox
              image={item.data.image}
              subject={item.data.subject}
              key={item.id}
              id={item.id}
              screen="Class"
              press={changeScreen}
            />
          ))
        ) : (
          <Text>Not found</Text>
        )}
      </ScrollView>
      <Button title="+" style={styles.view_button} onPress={addQuestion}/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  view_button: {
    position: 'absolute',
    borderColor: '#1c51ed',
    borderWidth: 50,
    width: '70px',
    height: '70px',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '20',
    bottom: 30,
    right: 10,
    backgroundColor: '#1c51ed',
    
  },
  
});
