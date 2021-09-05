import React, { useState, useEffect,useRef } from 'react';
import { StyleSheet, View, Text, Image,Button,ScrollView,Alert,Pressable,Modal } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
 
 

function RadioOptions(data){
  const arr = []
  for(item in data){
    let docs = data[item]
    arr.push({value:docs,label:docs})
  }

  return arr
}



export default function TestScreen({ navigation, route }) {
  const [question, setQuestion] = useState(
    JSON.parse(route.params.data.question)
  );


  const[currentId,setCurrentId] = useState(question[0].id-1)


  const [previous,setPrevious] = useState("previous")
  const [next,setNext] = useState("next")
  
  const [currentQuestion,setCurrentQuestion] = useState(question[currentId].question)
  const [currentOptions,setCurrentOptions] = useState(RadioOptions(question[currentId].options))
  const [currentCorrectAnswer,setCurrentCorrectAnswer] = useState(question[currentId].options[question[currentId].correct])

  const [currentImage,setCurrentImage] = useState(question[currentId].image)
  const [showImage,setShowImage] = useState(question[currentId].showImage)
 
  const [answer,setAnswer] = useState(new Array(question.length))
  const [modalVisible, setModalVisible] = useState(false);
  const score = useRef(0)
  const total = useRef(0)

  useEffect(()=>{
    setCurrentQuestion(question[currentId].question)
    setCurrentOptions(RadioOptions(question[currentId].options))
    setCurrentCorrectAnswer(question[currentId].options[question[currentId].correct])
    setCurrentImage(question[currentId].image)
    setShowImage(question[currentId].showImage)

    
  },[currentId])

function previousQuestion(){
  setNext("Next")
  if(currentId!=0){
    setCurrentId(currentId-1)
  }else{
    
   
  }
}

function SubmitAll(Answer){
  let scores = 0;
  Answer.forEach((item)=>{
    if(item.currentAnswer===item.answer){
      scores+=10
    }
  })
  score.current = scores
  total.current =question.length*10
  setModalVisible(true)
 
}


function AddAnswer(e){
  let allAnswer = answer
  
  
  allAnswer[currentId] = {id:currentId,answer:e.label,currentAnswer:currentCorrectAnswer}

  setAnswer(allAnswer)
}

  function nextQuestion(){
  
     
  if(next==="submit"){
    SubmitAll(answer)
    return 
  }

    if(currentId<question.length-1){

   
      setCurrentId(currentId+1)
    
    }
    else{
   
      setNext("submit")
    }
  }

const onPress = ()=>{
 
}


if(modalVisible){
 return <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>You Score!</Text>
            <Text style={{fontWeight:"bold",fontSize:22,color:"#2c9dd1"}}>{score.current} out of {total.current}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => navigation.replace("Subject")}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable>
    </View>
}

  return (
    <ScrollView>
     <View style={styles.test_main}>
     <Text style={styles.test_question}>{currentId}. </Text>
      {
        showImage? <Image
        source={{uri:currentImage}}
        style={styles.test_image}
      />:null
      }

     
  {
    currentQuestion!==""?    <Text style={styles.test_question}>
     {currentQuestion}
      </Text>:null
  }

 <View style={styles.test_options_view}>
        <RadioButtonRN
          data={currentOptions}
          selectedBtn={(e) => AddAnswer(e)}
          icon={<Icon name="check-circle" size={25} color="#2c9dd1" />}
        />




      </View>


  <View style={styles.test_button_view}>
          <Button title={previous} style={styles.test_button } onPress={()=>previousQuestion()}/>
          <Button  title={next} style={styles.test_button} onPress={()=>nextQuestion()}/>
      </View>

  </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  test_main: {
    flex: 1,
    backgroundColor: '#fff',
    margin:8,
    padding:10,
    borderWidth:1,
    borderColor:"#2c9dd1"
  },
  test_box: {},
  test_question: {
    marginVertical:10,
    fontSize:17,
    fontWeight:"bold"
  },
  test_image: {
    width: '100%',
    height: 200,
  },
  test_options_view: {},
  test_options: {},
  test_button_view:{
    flexDirection:"row",
    justifyContent:"space-between",
    paddingVertical:5
  },
  test_button:{
       borderWidth:1,
    borderColor:"#2c9dd1",
    backgroundColor:"#fff",
    borderRadius:20
  },
   centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

