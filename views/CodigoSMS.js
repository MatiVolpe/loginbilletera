import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from 'react'
import { Animated, ImageBackground, StyleSheet, View } from 'react-native'
import { HelperText, Snackbar, Text, TextInput, Button } from 'react-native-paper'
import CountDownTimer from 'react-native-countdown-timer-hooks';
import axios from 'axios';


const CodigoSMS = ({ navigation, route }) => {

  const [datos, setDatos] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codigoComparar, setCodigoComparar] = useState('');
  const [animacionboton] = useState(new Animated.Value(1));
  const [animacionboton2] = useState(new Animated.Value(1));
  const [mostrarSnackErroneo, setMostrarSnackErroneo] = useState(false);
  const [sinTiempo, setSinTiempo] = useState(false);
  const [prueba, setPrueba] = useState(false);
  const [disabledd, setDisabledd] = useState(false);

  const { urlSms, telefono, codigoSeguridad } = route.params;

  useEffect(() => {
    console.log(urlSms);
    console.log(telefono);
    console.log(codigoSeguridad);
  })

  const pressBtn = () => {
    Animated.spring(animacionboton, {
      toValue: 0.8,
      useNativeDriver: true
    }).start();
  }

  const soltarBtn = () => {
    Animated.spring(animacionboton, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true
    }).start();
  }

  const pressBtn2 = () => {
    Animated.spring(animacionboton2, {
      toValue: 0.8,
      useNativeDriver: true
    }).start();
  }

  const soltarBtn2 = () => {
    Animated.spring(animacionboton2, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true
    }).start();
  }

  const estiloAnimacionInicio = {
    transform: [{ scale: animacionboton }]
  }
  const estiloAnimacionInicio2 = {
    transform: [{ scale: animacionboton2 }]
  }

  useEffect(() => {
    const getData = async () => {
      setDatos(await AsyncStorage.getItem('datos_persona'));
      setCodigoComparar(await AsyncStorage.getItem('codigo_seguridad'));
    }
    getData();
  }, [])

  const handleClick = () => {
    if (codigo === codigoComparar) {
      navigation.navigate('NombreUsuario')
    } else {
      setMostrarSnackErroneo(true);
      setTimeout(() => {
        setMostrarSnackErroneo(false);
      }, 2000);
    }
  }

  const enviarDeNuevo = async () => {
    setTimerEnd(false);
    setDisabledd(true);
    refTimer.current.resetTimer();
    try {
      console.log(urlSms);
      console.log(telefono);
      console.log(codigoSeguridad);
      const responseMensaje = await axios.post(urlSms, {
        'numero_celular': `+54${telefono}`,
        'mensaje': `Su código de verificación es ${codigoSeguridad}. Este es un mensaje de la BILLETERA Mutual Central SC  `,
        'categoria': 'MutualCentralSC',
        'tipo': 1,
      })
      console.log(responseMensaje);
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      setDisabledd(false);
    }, 10000);
  }

  // Timer References
  const refTimer = useRef();

  // For keeping a track on the Timer
  const [timerEnd, setTimerEnd] = useState(false);

  const timerCallbackFunc = () => {
    // Setting timer flag to finished
    setTimerEnd(true);
    setSinTiempo(true);
    setTimeout(() => {
      setSinTiempo(false);
    }, 2000);
  };

  const timerOnProgressFunc = (segundos) => {
    if (segundos) {
      setPrueba(true);
    } else {
      setPrueba(false);
    }
  }

  return (
    <View style={styles.contenedor}>
      <ImageBackground
        source={require('../background.jpg')}
        style={styles.backgroundImage}
        resizeMode='cover'
      >
        <View>
          <Text variant='headlineMedium' style={styles.titulo}>Te enviamos un código por SMS</Text>

        </View>
        <View style={styles.vista}>
          <TextInput
            style={[styles.input, { fontSize: 18 }]}
            placeholder=''
            label={'Código'}
            value={codigo}
            outlineColor='#219EBC'
            activeOutlineColor='#023047'
            onChangeText={(texto) => setCodigo(texto)}
            mode='outlined'
          />
          <HelperText type="error" visible={false}>
            Este campo es obligatorio
          </HelperText>

        </View>
        <Animated.View style={[styles.vista, estiloAnimacionInicio2]}>
          <Button
            onPress={handleClick}
            mode="contained"
            buttonColor='#023047'
            style={[styles.boton]}
            onPressIn={() => pressBtn2()}
            onPressOut={() => soltarBtn2()}
            disabled={!prueba}
          >
            <View>
              <Text style={[styles.botonTexto]} variant='titleMedium'>confirmar</Text>
            </View>
          </Button>
        </Animated.View>

        <View style={[styles.vista, { alignItems: 'center', paddingLeft: 10 }]}>
          <View style={[styles.vista, { alignItems: 'center', paddingRight: 20, justifyContent: 'center' }]}>
            <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: '500' }}>¿No recibiste el mensaje?</Text>
            <Animated.View style={[estiloAnimacionInicio, { alignItems: 'center', justifyContent: 'center' }]}>
              <Button
                mode="contained"
                buttonColor='#023047'
                style={[styles.boton]}
                onPressIn={pressBtn}
                onPressOut={soltarBtn}
                onPress={enviarDeNuevo}
                disabled={disabledd}
              >
                <View style={styles.vistaTextoBoton}>
                  <Text style={[styles.botonTexto]} variant='titleMedium'>Volver a enviar</Text>
                </View>
              </Button>
            </Animated.View>
          </View>
          <View style={[styles.countdownView, { display: !prueba ? "none" : "flex" }]}>
            <CountDownTimer
              ref={refTimer}
              timestamp={90}
              timerCallback={timerCallbackFunc}
              timerOnProgress={timerOnProgressFunc}
              containerStyle={{
                height: 50,
                width: 120,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                backgroundColor: '#FFF'
              }}
              textStyle={{
                fontSize: 25,
                color: '#023047',
                fontWeight: '500',
                letterSpacing: 0.25,
              }}
            />
          </View>
        </View>
        <Snackbar
          visible={mostrarSnackErroneo}
        >
          <Text style={{ fontSize: 16, color: 'white' }}>El código no coincide.</Text>
        </Snackbar>
        <Snackbar
          visible={sinTiempo}
        >
          <Text style={{ fontSize: 16, color: 'white' }}>Se terminó el tiempo.</Text>
        </Snackbar>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  vista: {
    width: '90%',
    marginVertical: 10,

  },
  titulo: {
    marginVertical: 40,
    fontWeight: '700',
    textAlign: 'center',

  },
  vistaTextoBoton: {
    width: '100%',
  },
  texto: {
    fontWeight: '600',
  },
  boton: {
    marginVertical: 20,
  },
  botonTexto: {
    height: 20,
    fontSize: 18,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: 'white'
  },
  input: {
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 20,
    textAlign: 'center',
    fontSize: 20,
  },
  countdownView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 25,
  },
})

export default CodigoSMS