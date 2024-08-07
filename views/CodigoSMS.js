import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { Button, HelperText, Snackbar, Text, TextInput } from 'react-native-paper'
import CountDownTimer from 'react-native-countdown-timer-hooks';
import axios from 'axios';


const CodigoSMS = ({ navigation, route }) => {

  const [datos, setDatos] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codigoComparar, setCodigoComparar] = useState('');
  const [animacionboton] = useState(new Animated.Value(1));
  const [animacionboton2] = useState(new Animated.Value(1));
  const [mostrarSnackCorrecto, setMostrarSnackCorrecto] = useState(false);
  const [mostrarSnackErroneo, setMostrarSnackErroneo] = useState(false);
  const [sinTiempo, setSinTiempo] = useState(false);
  const [prueba, setPrueba] = useState(false);
  const [disabledd, setDisabledd] = useState(false);
  
  const { urlSms, telefono, codigoGenerado } = route.params;

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
      setMostrarSnackCorrecto(true);
      setTimeout(() => {
        setMostrarSnackCorrecto(false);
      }, 2000);
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
      console.log(codigoGenerado);
      const responseMensaje = await axios.post(urlSms, {
        'numero_celular': `+54${telefono}`,
        'mensaje': `Su código de verificación es ${codigoGenerado}. Este es un mensaje de la BILLETERA Mutual Central SC  `,
        'categoria': 'MutualCentralSC',
        'tipo': 1,
      })
      console.log(responseMensaje);
    } catch(error) {
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
    if(segundos){
      setPrueba(true);
    } else {
      setPrueba(false);
    }
  }

  return (
    <View style={styles.contenedor}>
      
      <View>
        <Text variant='headlineMedium' style={styles.titulo}>Te enviamos un código por SMS</Text>
        <View>
          <Text variant='headlineSmall' style={styles.texto}>Introducir código: </Text>
        </View>
      </View>
      <View style={styles.vista}>
        <TextInput
          style={styles.input}
          placeholder=''
          label={'Código'}
          value={codigo}
          onChangeText={(texto) => setCodigo(texto)}
          // onBlur={handleErrorDocumento}
          mode='outlined'
        />
        <HelperText type="error" visible={false}>
          Este campo es obligatorio
        </HelperText>
        <View style={[styles.vista, { flexDirection: 'row', alignItems: 'center', paddingLeft: 20 }]}>
        <View>
            <Text style={{ marginBottom: 5 }}>¿No recibiste el mensaje?</Text>
            <Animated.View style={estiloAnimacionInicio}>
              <Button
                mode='elevated'
                style={{ borderRadius: 5, backgroundColor:'#FFF' }}
                onPressIn={pressBtn}
                onPressOut={soltarBtn}
                onPress={enviarDeNuevo}
                disabled={disabledd}
              >
                <Text>Volver a enviar</Text>
              </Button>
            </Animated.View>
          </View>
          <View style={[styles.countdownView, {display: !prueba ? "none" : "flex"}]}>
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
                color: '#663399',
                fontWeight: '500',
                letterSpacing: 0.25,
              }}
            />
          </View>
        </View>
      </View>
      <Animated.View style={[styles.vista, estiloAnimacionInicio2]}>
        <Button
          onPress={handleClick}
          style={styles.boton}
          mode='elevated'
          onPressIn={pressBtn2}
          onPressOut={soltarBtn2}
          disabled= {!prueba}
        >
          <Text style={styles.botonTexto}>confirmar</Text>
        </Button>
      </Animated.View>
              
      <Snackbar
        visible={mostrarSnackCorrecto}
      >
        Código correcto.
      </Snackbar>
      <Snackbar
        visible={mostrarSnackErroneo}
      >
        El código no coincide.
      </Snackbar>
      <Snackbar
        visible={sinTiempo}
      >
        Se terminó el tiempo.
      </Snackbar>
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#ddede7',
    alignItems: 'center',
    padding: 20,
  },
  vista: {
    width: '100%',

  },
  titulo: {
    marginVertical: 40,
    fontWeight: '700',
    textAlign: 'center',

  },
  texto: {
    fontWeight: '700',
  },
  boton: {
    marginVertical: 30,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    borderRadius: 10,
  },
  botonTexto: {
    marginVertical: 10,
    fontSize: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  input: {
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 20,
    textAlign: 'center',
    fontSize: 20,
  },
  countdownView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 25,
  },
})

export default CodigoSMS