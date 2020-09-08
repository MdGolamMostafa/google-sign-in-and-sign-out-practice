import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './FireBaseConfig';

firebase.initializeApp(firebaseConfig);

function App() {
  const  provider = new firebase.auth.GoogleAuthProvider();

  const [user,setUser] = useState({
    isSignedIn:false,
    name: '',
    email: '',
    photo:''
  })
  const handleSignIn = ()=> {
    // console.log('Sign in clicked')
    firebase.auth().signInWithPopup(provider)
    
    .then(result => {
      const {email,displayName,photoURL} = result.user;
      const signedInUser ={
        isSignedIn: true,
        name:displayName,
        email:email,
        photo:photoURL
      }
    
      setUser(signedInUser)
    //  console.log(email,displayName,photoURL);
    })
    .catch(error=> {
      console.log(error);
      console.log(error.message);
    })

    
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(result => {
    const signOutUser ={
      isSignedIn:false,
      name:'',
      email:'',
      photo:''
    }
    setUser (signOutUser);
    })
    // .catch(error => {
    //   console.log(error);
    //   console.log(error.message);
    // })
    console.log("sign out")
  }
  return (
    <div className="App">
    {
      user.isSignedIn ? <button onClick = { handleSignOut }>Sign Out</button> :
      <button onClick = {handleSignIn}>SignIn</button>
      
      }
   {
      user.isSignedIn &&
      //  <h1>Display Name: {user.name}</h1> 
      <div>
        <h1>Display Name: {user.name}</h1>
        <h2>User Email: {user.email}</h2>
        <img src={user.photo} alt=""/>
     </div>
   } 
    </div>
  );
}

export default App;
