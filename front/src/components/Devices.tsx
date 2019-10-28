import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import { useObject, useObjectVal } from 'react-firebase-hooks/database'
//import EditForm from './EditForm';

import './Devices.css';

const firebaseConfig = {
  apiKey: "AIzaSyCc0omLy_FecUPTNrghJRPwPsysKdbsl6U",
  authDomain: "iot-service-d3338.firebaseapp.com",
  databaseURL: "https://iot-service-d3338.firebaseio.com",
  projectId: "iot-service-d3338",
  storageBucket: "iot-service-d3338.appspot.com",
  messagingSenderId: "408382735005",
  appId: "1:408382735005:web:7ad90c0c2fb5b403fa0a74"
};

firebase.initializeApp(firebaseConfig);

const Device =() => {

  const getInitialState =() => ({
    led: false,
    pot: 0,
    time: 0,
  });

  const [snapshots={...getInitialState()}, loading, error] = useObjectVal(firebase.database().ref());
  // const [state, setState] = useState({...getInitialState()})
  
  console.log('snapshots', snapshots);
  console.log('error',error);
  console.log('loading', loading);
  

  

  
      return (
          <div>
              <h1> Devices !!</h1>
              <p> led: {snapshots.led ? 'encendido': 'apagado'}</p>
              <p>ADC: {snapshots.pot} </p>
              <p> time: {snapshots.time}</p>
          </div>
        );
  }
export default (Device);