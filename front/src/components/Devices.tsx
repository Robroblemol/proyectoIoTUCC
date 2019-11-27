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

  const arrayDataformated = snapshots.logs_adc ?
  [
    ['id','current'],
    ... Object.values(snapshots.logs_adc).map((d, i:number) => [i++, d])
  ]:[['id','current'],[0,0],];
  
  console.log('dataLog', arrayDataformated);
  
  
  

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
          <div className= "container">
              <div className= "item">

              <div className= "card">
                
                <h1> Smart Socket UCC</h1>

                <div className="container-card">
                  <p> Relé: {snapshots.led ? 'encendido': 'apagado'}</p>
                  <p> Amperios consumidos: {snapshots.pot} </p>
                  <p> tiempo programado: {snapshots.time}</p>
                </div>

              </div>


                <Select
                  id = "time"
                  name = "time"
                  options = {options}
                  onClick = {handleTime}

                />

                <button 
                  onClick = {handleLed}
                  name= 'led'
                  id= 'led'>
                  {!snapshots.led ? 'Encender relé': 'Apagar relé'}
                </button>

              </div>
              <div className= "chart">
                <h2>Historial mediciones</h2>
              <Chart
                width={'250px'}
                height={'150px'}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={arrayDataformated}
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
          </div>
        );
  }
export default (Device);