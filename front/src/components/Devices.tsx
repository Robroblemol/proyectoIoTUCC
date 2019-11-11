import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import { useObjectVal } from 'react-firebase-hooks/database'
import Chart from 'react-google-charts';
import { firebaseConfig } from '../firebaseConfig'
import  Select  from './Select/index'
//import EditForm from './EditForm';

import './Devices.css';

firebase.initializeApp(firebaseConfig);

const options = [ 10, 15, 30 ,60]

const Device =() => {

  const getInitialState =() => ({
    led: false,
    pot: 0,
    time: 0,
    logs_adc: {},
  });

  const [snapshots={...getInitialState()}, loading, error] = useObjectVal(firebase.database().ref());
  // const [state, setState] = useState({...getInitialState()})
  // console.log('snapshots', snapshots);
  // console.log('error',error);
  // console.log('loading', loading);

 
  const dataLog = Object.values(snapshots.logs_adc);

  const arrDataformated = [
    ['id','current'],
    ...dataLog.map((d, i:number) => [i++, d])
  ]
  
  console.log('dataLog', arrDataformated);
  
  
  

  const handleLed = (event:any) => {
    // console.log('envent click: ',event);
    firebase.database().ref('led').set( !snapshots.led );
    
  }

  const handleTime = (event:any) => {
    console.log('envent click: ',event.target.value);
    firebase.database().ref('time').set( +event.target.value );
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
              <div className = 'chart'>
              <Chart
                width={'350px'}
                height={'250px'}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={arrDataformated}
                options={{
                  hAxis: {
                    title: 'Tiempo',
                  },
                  vAxis: {
                    title: 'Corriente',
                  },
                }}
                rootProps={{ 'data-testid': '1' }}
                />

              </div>
              <div>
                <Select
                  id = 'time'
                  name = 'time'
                  options = {options}
                  onClick = {handleTime}

                />
              </div>
          </div>
        );
  }
export default (Device);