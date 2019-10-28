import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import { useObject, useObjectVal } from 'react-firebase-hooks/database'
import { firebaseConfig } from '../firebaseConfig'
//import EditForm from './EditForm';

import './Devices.css';


firebase.initializeApp(firebaseConfig);

const Device =() => {

  const getInitialState =() => ({
    led: false,
    pot: 0,
    time: 0,
  });

  const [snapshots={...getInitialState()}, loading, error] = useObjectVal(firebase.database().ref());
  // const [state, setState] = useState({...getInitialState()})
  // console.log('snapshots', snapshots);
  // console.log('error',error);
  // console.log('loading', loading);

  const handleLed = (event:any) => {
    // console.log('envent click: ',event);
    firebase.database().ref('led').set( !snapshots.led );
    
  }
  
  // const snapshots = {...getInitialState()}

  

  
      return (
          <div>
              <h1> Devices !!</h1>
              <p> led: {snapshots.led ? 'encendido': 'apagado'}</p>
              <p>ADC: {snapshots.pot} </p>
              <p> time: {snapshots.time}</p>
              <button 
              onClick = {handleLed}
              name= 'led'
              id= 'led'>
                {!snapshots.led ? 'Encender led': 'Apagar led'}
              </button>
          </div>
        );
  }
export default (Device);