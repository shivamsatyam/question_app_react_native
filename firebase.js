

import * as firebase from 'firebase'
import "firebase/firestore"
import "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAW8zkPbtxUtvxMKePEh3qKHCrVOK7v_kk",
  authDomain: "shivam-vj-quiz.firebaseapp.com",
  projectId: "shivam-vj-quiz",
  storageBucket: "shivam-vj-quiz.appspot.com",
  messagingSenderId: "278184826163",
  appId: "1:278184826163:web:fe3815d6557ab833345a46"
};


let app;

if(firebase.apps.length===0){
app  = firebase.initializeApp(firebaseConfig)

}else{
  app  = firebase.app()
}


const db = app.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
export {db,auth,storage}



