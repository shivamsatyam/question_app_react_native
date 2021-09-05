import React,{useState,useEffect} from 'react'
import {View,TextInput,Text,AsyncStorage,Button} from 'react-native'

export default function({navigation}){
  useEffect(()=>{
    AsyncStorage.getItem("question_input").then((data)=>{
      navigation.replace("Subject")
    })
  },[])

  const [input,setInput] = useState("")

  const checkFunc = async()=>{
    if(input!=""){
      if (input==="softgooddeveloper@gmail"){
        await AsyncStorage.setItem("question_input","yes")
      }else{
        await AsyncStorage.setItem("question_input","no")
      }
    }else{
      alert("please type something")
    }
  }
  return(
    <View style={{flex:1,backgroundColor:"white"}}>
     <TextInput
     placeholder="type something"
      onChangeText={text => setInput(text)}
      value={input}
    />

    <Button title="Enter" onpress={()=>checkFunc()}/>
    </View>
  )
}