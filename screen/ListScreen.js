import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { ListItem, Avatar } from 'react-native-elements';

export default function ListScreen({ navigation, route }) {
 
  const [testList, setTestList] = useState(null);

  useEffect(() => {
    const unsubscribe = db
      .collection('main')
      .doc(route.params.id)
      .collection('test')
      .onSnapshot((snapshot) => {
        setTestList(
          snapshot.docs.map((doc) => {
         
            return {
              id: doc.id,
              data: doc.data(),
            };
          })
        );
      });

    return unsubscribe;
  }, []);


  const showQuestion = (id,data)=>{
    navigation.navigate("TestScreen",{
      id:id,
      data:data
    })
  }

  return (
    <View style={{ flex: 1 }}>
      {testList
        ? testList.map((item, index) => {
         
            return (
              <ListItem
                key={item.id}
                buttonDivider
                onPress={()=>showQuestion(item.id,item.data)}
             >
                <Avatar
                  rounded
                  source={{
                    uri:
                      'https://cencup.com/wp-contents/uploads/2019/07/avatar-placeholder.png',
                  }}
                />
                <ListItem.Content>
                  <ListItem.Title style={{ fontWeight: '800' }}>
                    {item.data.title}
                  </ListItem.Title>

                  <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                  {item.data.down}
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            );
          })
        : null}
    </View>
  );
}

