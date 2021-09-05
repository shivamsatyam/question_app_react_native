import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
export default function CardBox({ id,image, subject,press }) {
 

  return (
    <Animatable.View style={styles.container} animation="slideInDown">
      <TouchableOpacity onPress={()=>press(id)}>
        <Image style={styles.logo} source={require(`../images/science.png`)} />

        <Text style={styles.paragraph}>{subject}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 12,
  },
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 13,
  },
  logo: {
    height: 128,
    width: 128,
  },
});
