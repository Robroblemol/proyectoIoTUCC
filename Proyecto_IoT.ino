#include <ESP8266WiFi.h>
// #include "FirebaseESP32.h"
#include <FirebaseArduino.h>
#include <Ticker.h>  //Ticker Library

// FirebaseData firebaseData;
// Set these to run example.

// install arduinoJSON version 5.13

#define PIN_LED 2
bool flag_Read_ADC = false;
bool statusFBLed = false; // variable for store status led in firebase
bool flag_enableInterruption = true; //variable for toggle interrupts enable
const float SENSIBILITY = 0.100; // Modelo 20A


float sensorValue;
int i = 0;
String dataIn;


Ticker triggerCheckFirebase;

void ICACHE_RAM_ATTR checkFirebase(){
  if(statusFBLed){
    digitalWrite(PIN_LED, LOW);
  }
  else{
    digitalWrite(PIN_LED, HIGH);

  }

  flag_Read_ADC = true;
  timer1_write(900000); //120000 us
}

void toggleEnableInterruptions(){
  if(flag_enableInterruption)
    noInterrupts();//disable Interrupts while getting firebase data
  else
    interrupts(); //Enable Interrupts after getting firebase data
  flag_enableInterruption = !flag_enableInterruption;
}

void setup() {
  pinMode(PIN_LED,OUTPUT);
  
  Serial.begin(9600);

  // connect to wifi.
  WiFi.begin(getWifi_SSID(), getWifi_Password());
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());

  Firebase.begin(getFirebaseHost(), getFirebaseAuth());

  //Initialize Ticker every 0.5s
  timer1_attachInterrupt(checkFirebase);
  timer1_enable(TIM_DIV16, TIM_EDGE, TIM_SINGLE);
  timer1_write(600000); //120000 us

  Firebase.setFloat("pot", analogRead(A0));
  // handle error
  if (Firebase.failed()) {
      Serial.print("setting /number failed:");
      Serial.println(Firebase.error());  
      return;
  }
  // triggerCheckFirebase.attach(0.5, checkFirebase);

}

void loop() {
  //get value
delay(3000);
toggleEnableInterruptions();
statusFBLed = Firebase.getBool("led");
toggleEnableInterruptions();

if(flag_Read_ADC){

  float dataADC = getCurrent(100);
  Firebase.setFloat("pot", dataADC);
  // handle error
  if (Firebase.failed()) {
      Serial.print("setting /number failed:");
      Serial.println(Firebase.error());  
      return;
  }
  // delay(1000);
  float arr [10];
  Firebase.setArray("array_adc",arr)
  Firebase.push("logs_adc", dataADC);
  // handle error
  if (Firebase.failed()) {
      Serial.print("pushing /logs failed:");
      Serial.println(Firebase.error());  
      return;
  }
  Serial.println(sensorValue);
}

if(Serial.available()) {
  // dataIn = Serial.readString();
  int inChar = Serial.read();
  Serial.println(inChar);
  Serial.print("data in: ");

  if (isDigit(inChar)) {
      // convert the incoming byte to a char and add it to the string:
      dataIn += (char)inChar;
      Serial.println(dataIn);
    }


  if(inChar == 13){
   toggleEnableInterruptions(); 
   Firebase.setFloat("time", dataIn.toInt());
  // handle error
    if (Firebase.failed()) {
      Serial.print("setting /number failed:");
      Serial.println(Firebase.error());  
      return;
    }
    Serial.println(">: dato enviado");
    dataIn = ""; 
  }
  toggleEnableInterruptions();
}

}

float getCurrent(int samplesNumber)
{
   float voltage;
   float corrienteSum = 0;
   for (int i = 0; i < samplesNumber; i++)
   {
      voltage = analogRead(A0) * 5.0 / 1023.0;
      corrienteSum += (voltage - 2.5) / SENSIBILITY;
   }
   return(corrienteSum / samplesNumber);
}
