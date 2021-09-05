import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  Picker,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { db } from '../firebase';
import { Input } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../firebase';
import firebase from 'firebase';
import LottieView from 'lottie-react-native'

export default function AddQuestion({navigation}) {
  const [className, setClassName] = useState('class 10');
  const [subject, setSubject] = useState(null);
  const [topicId, setTopicId] = useState('');
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const[showProgress,setShowProgress] = useState(false)
  const [loading,setLoading] = useState(false)
  const [question, setQuestion] = useState([
    {
      id: 1,
      image: '',
      question: '',
      options: {
        a: '',
        b: '',
        c: '',
        d: '',
      },
      correct: '',
      showImage: false,
    },
  ]);

  const [image, setImage] = useState(null);
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
          navigation.replace('Subject');
        } else {
          setPermission(true);
        }
      }
    })();
  }, []);

  useEffect(() => {
    let change = true;
    const unsubscribe = db.collection('main').onSnapshot((snapshot) => {
      setSubject(
        snapshot.docs.map((doc) => {
          if (change) {
            setTopicId(doc.id);
          }

          change = false;

          return {
            id: doc.id,
            data: doc.data(),
          };
        })
      );
    });

    return unsubscribe;
  }, []);

  const addQuestionList = () => {
    let last = question[question.length - 1];
    if (last.question === '') {
      alert('question not added');
      return;
    } else if (last.correct === '') {
      alert('correct option not added');
      return;
    } else {
      let options = last.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i] === '') {
          alert('options not given correctly!');
          return;
        }
      }
    }

    setQuestion([
      ...question,
      {
        id: question.length + 1,
        image: '',
        question: '',
        options: {
          a: '',
          b: '',
          c: '',
          d: '',
        },
        correct: '',
        showImage: false,
      },
    ]);
  };

  const uploadImage = async (uri, id) => {
  
 
    const response = await fetch(uri);
    const blob = await response.blob();

    const a = new Date()
    const imgArray = uri.split('/');
    const imgName = `${a}_${
      imgArray[imgArray.length - 1]
    }`;
    const uploadTask = storage.ref('/images/' + imgName).put(blob);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
      
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if(progress===100){
          setShowProgress(false)
        }
    
        setProgress(progress);
      },
      (error) => {
        alert(error.message);
        return;
      },
      () => {
        //complete function
        storage
          .ref('images')
          .child(imgName)
          .getDownloadURL()
          .then((url) => {
          
            let main = question[id - 1];
            main.image = url;
            main.showImage = true;
            let re = [
              ...question.slice(0, id - 1),
              main,
              ...question.slice(id, question.length),
            ];
            setQuestion(re);
          });
      }
    );
  };

  const submitAll = ()=>{
      if(title===""){
        alert("please enter a title")
        return
      }

      setLoading(true)

      let questionArray = JSON.stringify(question)
    
      db.collection("main").doc(topicId).collection("test").add({
        timestap:firebase.firestore.FieldValue.serverTimestamp(),
        question:questionArray,
        title:title,
        down:className,
        
      }).then(()=>{
      
        setTitle("")
         navigation.replace('Subject');
         setLoading(false)
      }).catch(()=>{
        setLoading(false)
        alert("Some error occured or no internet connection")
      })
  }

  const changeQuestion = (text, id) => {
    let main = question[id - 1];
    main.question = text;
    let re = [
      ...question.slice(0, id - 1),
      main,
      ...question.slice(id, question.length),
    ];
    setQuestion(re);
  };


  const changeQuestionOption = (text, id, value) => {
    let main = question[id - 1];
    main.options[value] = text;
  
    let re = [
      ...question.slice(0, id - 1),
      main,
      ...question.slice(id, question.length),
    ];
    setQuestion(re);
  };

  const changeQuestionCorrect = (text, id) => {
    let main = question[id - 1];
    main.correct = text;
    let re = [
      ...question.slice(0, id - 1),
      main,
      ...question.slice(id, question.length),
    ];
    setQuestion(re);
 
   
  };

  const pickImage = async (id) => {
    if (permission) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
     
        quality: 1,
      });

    

      if (result.type !== 'image') {
        alert('please select an image');
        return;
      }


      if (!result.cancelled) {
        setImage(result.uri);
        uploadImage(result.uri, id);
      }
    } else {
       (async () => {
      if (Platform.OS !== 'web') {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
          
        } else {
          setPermission(true);
        }
      }
    })();
    }
  };



  if(showProgress){
    return(
      <View style={{flex:1,width:"100%",height:"100%"}}>
        <LottieView source={require('../assets/60041-upload.json')} autoPlay loop/>
      </View>
    )
  }

  
  if(loading){
    return(
      <View style={{flex:1,width:"100%",height:"100%"}}>
        <LottieView source={require('../assets/9329-loading.json')} autoPlay loop/>
      </View>
    )
  }


  return (
    <View style={{ height: '100%', flex: 1 }}>
      <ScrollView style={styles.container}>
        {subject ? (
          <>
            <Text style={styles.form_title}>Enter the Title</Text>
            <Input
              value={title}
              onChangeText={(text) => setTitle(text)}
              placeholder="enter the title"
            />

            <Text style={styles.form_title}>Choose your Class</Text>

            <Picker
              selectedValue={className}
              style={{ height: 50, width: '100%', backgroundColor: '#fff' }}
              onValueChange={(itemValue, itemIndex) => setClassName(itemValue)}>
              <Picker.Item label="8" value="class 8" />
              <Picker.Item label="9" value="class 9" />
              <Picker.Item label="10" value="class 10" />
              <Picker.Item label="11" value="class 11" />
              <Picker.Item label="12" value="class 12" />
            </Picker>

            <Text style={styles.form_title}>Choose your topic</Text>
            <Picker
              selectedValue={topicId}
              style={{ height: 50, width: '100%', backgroundColor: '#fff' }}
              onValueChange={(itemValue, itemIndex) => setTopicId(itemValue)}>
              {subject.map((item, index) => (
                <Picker.Item label={item.data.subject} value={item.id} />
              ))}
            </Picker>

            <View>
              <Button style={styles.box_file_button} onPress={()=>submitAll()} title="Submit"/>
            </View>

            <KeyboardAvoidingView style={styles.box}>
              {question.map((item, index) => {
                return (
                  <View style={styles.box_main}>
                    <View style={styles.box_file}>
                      {item.showImage ? (
                        <Image
                          source={{ uri: item.image }}
                          style={{ width:"100%", height: 200 }}
                        />
                      ) : (
                        <Button
                          title="choose file "
                          style={styles.box_file_button}
                          onPress={() => pickImage(item.id)}
                        />
                      )}
                    </View>
                    <TextInput
                      placeholder="Enter the question"
                      multiline={true}
                      style={styles.box_question}
                      onChangeText={(text) => changeQuestion(text, item.id)}
                    />
                    <View style={styles.box_option_view}>
                      <View style={styles.box_option_content}>
                        <Text style={styles.box_option_text}>a </Text>
                        <TextInput
                          placeholder="Enter option"
                          onChangeText={(text) =>
                            changeQuestionOption(text, item.id, 'a')
                          }
                          style={styles.box_option}
                        />
                      </View>
                      <View style={styles.box_option_content}>
                        <Text style={styles.box_option_text}>b </Text>
                        <TextInput
                          placeholder="Enter option"
                          onChangeText={(text) =>
                            changeQuestionOption(text, item.id, 'b')
                          }
                          style={styles.box_option}
                        />
                      </View>

                      <View style={styles.box_option_content}>
                        <Text style={styles.box_option_text}>c </Text>
                        <TextInput
                          placeholder="Enter option"
                          onChangeText={(text) =>
                            changeQuestionOption(text, item.id, 'c')
                          }
                          style={styles.box_option}
                        />
                      </View>

                      <View style={styles.box_option_content}>
                        <Text style={styles.box_option_text}>d </Text>
                        <TextInput
                          placeholder="Enter option"
                          onChangeText={(text) =>
                            changeQuestionOption(text, item.id, 'd')
                          }
                          style={styles.box_option}
                        />
                      </View>
                    </View>

                    <Input
                      style={styles.box_correct_input}
                      placeholder="Enter the correct option eg-:a"
                      maxLength={1}
                      onChangeText={(text) =>
                        changeQuestionCorrect(text, item.id)
                      }
                    />
                  </View>
                );
              })}
            </KeyboardAvoidingView>
          </>
        ) : (
          <Text>No Internet connection</Text>
        )}
      </ScrollView>

      <View style={styles.plus_view}>
        <Button title="+" style={styles.add_button} onPress={addQuestionList} />
      </View>

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 2,
  },
  form_title: {
    color: 'black',
    marginLeft: 3,
    marginVertical: 5,
    fontSize: 17,
    fontWeight: 'bold',
  },

  input: {},
  question_view: {
    backgroundColor: '#c4c3be',
  },
  thumbmail: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },

  plus_view: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  add_button: {
    backgroundColor: 'purple',
    fontSize: 22,
    fontWeight: 'bold',
    width: '80px',
    height: '80px',
    borderRadius: '100px',
  },

  box: {},
  box_main: {
    borderColor: '#3a7ebf',
    borderWidth: 1,
    padding: 5,
    marginVertical: 10,
    borderRadius: 4,
    margin:10
  },
  box_question: {
    bordercolor: 'black',
    borderWidth: 1,
    padding: 2,
    fontSize: 17,
  },
  box_file: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  box_file_button: {
    color: '#fff',
    backgroundColor: '#2C6BED',
    fontSize: 18,
  },
  box_option_view: {
    marginVertical: 6,
  },
  box_option_content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box_option_text: {},
  box_option: {},
  box_correct_input: {
    marginVertical: 3,
  },
});
