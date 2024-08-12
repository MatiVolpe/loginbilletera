import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { HelperText, Snackbar, Text, TextInput } from 'react-native-paper'
import CountDownTimer from 'react-native-countdown-timer-hooks';
import axios from 'axios';
import { Button } from 'native-base';


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
      setMostrarSnackCorrecto(true);
      setTimeout(() => {
        setMostrarSnackCorrecto(false);
      }, 2000);
      setTimeout(() => {
        navigation.navigate('NombreUsuario')
      }, 2000);
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

      <View>
        <Text variant='headlineMedium' style={styles.titulo}>Te enviamos un código por SMS</Text>
        <View>
          <Text variant='headlineSmall' style={styles.texto}>Introducir código: </Text>
        </View>
      </View>
      <View style={styles.vista}>
        <TextInput
          style={[styles.input, { fontSize: 18 }]}
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

      </View>
      <Animated.View style={[styles.vista, estiloAnimacionInicio2]}>
        <Button
          onPress={handleClick}
          variant="subtle"
          size="sm"
          style={[styles.boton, { height: 70 }]}
          bg="#72ad8c"
          onPressIn={pressBtn2}
          onPressOut={soltarBtn2}
          disabled={!prueba}
        >
          <View>
            <Text style={[styles.botonTexto, { height: 35 }]}>confirmar</Text>
          </View>
        </Button>
      </Animated.View>

      <View style={[styles.vista, { alignItems: 'center', paddingLeft: 10 }]}>
        <View style={{ alignItems: 'center', paddingRight: 20, justifyContent: 'center' }}>
          <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: '500' }}>¿No recibiste el mensaje?</Text>
          <Animated.View style={[estiloAnimacionInicio]}>
            <Button
              variant="subtle"
              size="sm"
              style={[styles.boto, { height: 40 }]}
              bg="#72ad8c"
              onPressIn={pressBtn}
              onPressOut={soltarBtn}
              onPress={enviarDeNuevo}
              disabled={disabledd}
            >
              <View>
                <Text style={{ fontSize: 18 }}>Volver a enviar</Text>
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
              color: '#663399',
              fontWeight: '500',
              letterSpacing: 0.25,
            }}
          />
        </View>
      </View>

      <Snackbar
        visible={mostrarSnackCorrecto}
        style={{ zIndex: 999, bottom: 120, marginLeft: 35 }}
      >
        Código correcto.
      </Snackbar>
      <Snackbar
        visible={mostrarSnackErroneo}
        style={{ zIndex: 999, bottom: 120, marginLeft: 35 }}
      >
        El código no coincide.
      </Snackbar>
      <Snackbar
        visible={sinTiempo}
        style={{ zIndex: 999, bottom: 120, marginLeft: 35 }}
      >
        Se terminó el tiempo.
      </Snackbar>
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#e8e8d8',
    alignItems: 'center',
    padding: 20,
  },
  vista: {
    width: '100%',
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
    borderWidth: 1,
    width: '100%',
    height: 'auto',
    borderRadius: 15,
    borderColor: '#013d16',
  },
  botonTexto: {
    height: 20,
    marginVertical: 15,
    fontSize: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingVertical: 5,
    fontWeight: '500',
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