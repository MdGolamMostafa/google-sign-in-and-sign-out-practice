import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './FireBaseConfig';

firebase.initializeApp(firebaseConfig);

function App() {

  const [newUser , setNewUser] = useState(false)
  const  provider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();
  const [user,setUser] = useState({
    isSignedIn:false,
    newUser: false,
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

  const handleFacebookLogin = ()=> {
    firebase.auth().signInWithPopup(fbProvider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(result => {
    const signOutUser ={
      isSignedIn:false,
      newUser : false,
      name:'',
      email:'',
      photo:'',
      error:'',
      success : false
    }
    setUser (signOutUser);
    })
    .catch(error => {
      console.log(error);
      console.log(error.message);
    })
    console.log("sign out")
  }

  const handleBlur = (event) => {
    let isFieldValid = true;
  //  console.log(event.target.name,event.target.value);
    if (event.target.name === 'email') {
       isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
      // console.log(isEmailValid);
    }
    if (event.target.name === 'password') {
      const isPasswordValid = event.target.value.length>6;
      const passwordHasNumber =/\d{1}/.test (event.target.value)
      isFieldValid= isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value; //here name value is changeable
      setUser(newUserInfo); 
    }
  }

  const handleSubmit = (event) => {
    console.log(user.email,user.password);
    if (user.email && user.password) {
      // console.log("Submitting");
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(result => {
        // console.log(result);
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser (newUserInfo);
        updateUserName(user.name);
      })
      .catch(error => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        updateUserName(user.name);
      });
    }

    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(result => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser (newUserInfo);
        console.log('sign in user info',result.user);

        
      })
      .catch(function(error) {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }
    event.preventDefault();
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function(){
      console.log('User name updated successfully')
    }).catch(function(err){
      console.log(err);
    })
  }
  return (
    <div className="App">
    {
      user.isSignedIn ? <button onClick = { handleSignOut }>Sign Out</button> :
      <button onClick = {handleSignIn}>SignIn</button>
      }
      <br/>
      <button onClick = {handleFacebookLogin}>Sign in facebook</button> 
   {
      user.isSignedIn &&
      //  <h1>Display Name: {user.name}</h1> 
      <div>
        <h1>Display Name: {user.name}</h1>
        <h2>User Email: {user.email}</h2>
        <img src={user.photo} alt=""/>
     </div>
   } 
      <h1>Authentication Information</h1>
    <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
    <level html="newUser">New User sign Up.</level>

    <form onSubmit={handleSubmit} action="">
       {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your name"/>}
      <br/>
      <input type="text" name="email" onBlur={handleBlur} placeholder="Email" required/>
      <br/>
      <input type="password" name="password" onBlur={handleBlur} placeholder="Password" required/>
      <br/>
      <input type="submit" value="submit"/>
    </form>
        <p style={{color: 'red'}}>{user.error}</p>
      {user.success &&  <p style={{color: 'green'}}>User {newUser ? "created" : 'logged in'} Success</p>}
    </div>
  );
}

export default App;
