import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Animated, Alert } from 'react-native'
import { Button, HelperText, Snackbar, Text, TextInput, Icon } from 'react-native-paper';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spinner from 'react-native-loading-spinner-overlay';

const CambiarContrasena = ({ navigation, route }) => {

  const { nroPersona, usuario, urlDir, urlPuerto } = route.params;
  const [contraseña, setContraseña] = useState('');
  const [contraseñaRepetir, setContraseñaRepetir] = useState('');
  const [animacionboton] = useState(new Animated.Value(1));
  const [errorContra, setErrorContra] = useState(false);
  const [errorContraRepetir, setErrorContraRepetir] = useState(false);
  const [mostrarSnack, setMostrarSnack] = useState(false);
  const [mostrarSnackDistinto, setMostrarSnackDistinto] = useState(false);
  const [mostrarSnackError, setMostrarSnackError] = useState(false);
  const [urlTraductor, setUrlTraductor] = useState('');
  const [errorLongitud, setErrorLongitud] = useState(false);         //Debe contener al menos 8 caracteres
  const [errorEspeciales, setErrorEspeciales] = useState(false);     //No contener caracteres especiales
  const [errorMayusculas, setErrorMayusculas] = useState(false);     //Contener Mayúsculas y Minúsculas
  const [errorNumeros, setErrorNumeros] = useState(false);           //Contener Letras y Números
  const [errorRepetidos, setErrorRepetidos] = useState(false);       //Sin caracteres repetidos
  const [errorCorrelativos, setErrorCorrelativos] = useState(false); //Sin números repetidos
  const [errorPassRepetida, setErrorPassRepetida] = useState(false); //No repetir últimas 3 claves
  const [flagEffect, setFlagEffect] = useState(false)
  const [mostrarContraseña, setMostrarContraseña] = useState(true);
  const [mostrarContraseña2, setMostrarContraseña2] = useState(true);
  const [vistaSpinner, setVistaSpinner] = useState(false);


  useEffect(() => {
    const setUrl = async () => {
      const url_traductor = await AsyncStorage.getItem('url_traductor');
      setUrlTraductor(url_traductor);
    }
    setUrl();
  }, [])

  const cambiar = async () => {
    console.log(urlTraductor);
    console.log(nroPersona);
    console.log(usuario);
    console.log(contraseña);
    const response = await axios.post('https://traductor.gruponeosistemas.com/n_hbconfig', {
      'dir_url': 'http://201.216.239.83',
      'dir_puerto': '7846',
      'dir_api': '/homebanking/n_homebanking.asmx?WSDL',
      'metodo': 'login_reingreso',
      'data': '{"empresa": "NEOPOSTMAN", "nro_persona": "' + nroPersona + '", "usuario": "' + usuario + '", "password": "' + contraseña + '", "cant_pass_controla": 3}'
    }).then((response) => {
      console.log(response);
      if (response.data.data.success === 'FALSE') {
        console.error("Error de fecha de proceso??");
      }
      if (response.data.data.success === "TRUE") {
        setErrorLongitud(response.data.data.errorLongitud == 1);
        setErrorEspeciales(response.data.data.errorEspeciales == 1);
        setErrorMayusculas(response.data.data.errorMayusculas == 1);
        setErrorNumeros(response.data.data.errorNumeros == 1);
        setErrorRepetidos(response.data.data.errorRepetidos == 1);
        setErrorCorrelativos(response.data.data.errorCorrelativos == 1);
        setErrorPassRepetida(response.data.data.errorPassRepetida == 1);
        setFlagEffect(true);
      }
    }).catch((error) => {
      console.log("Error ", error);
    })
  }


  const handleCambiar = async () => {
    const llamado = await cambiar();
  }

  useEffect(() => {
    if (flagEffect) {
      console.log(errorLongitud);
      console.log(errorEspeciales);
      console.log(errorMayusculas);
      console.log(errorNumeros);
      console.log(errorRepetidos);
      console.log(errorCorrelativos);
      console.log(errorPassRepetida);
      if (!errorLongitud && !errorEspeciales && !errorMayusculas && !errorNumeros && !errorRepetidos && !errorCorrelativos && !errorPassRepetida) {
        navigation.navigate('Finalizado');
        spinnerStop();
      }
      else {
        snackHandlerError();
        setContraseña("");
        setContraseñaRepetir("");
        spinnerStop();
      }
    }
  }, [flagEffect])

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


  const handleInicio = () => {
    spinnerStart();
    if (contraseña.trim() === "" || contraseñaRepetir.trim() === "") {
      snackHandler();
    } else if (contraseña !== contraseñaRepetir) {
      snackHandlerDistinto();
    } else {
      handleCambiar();
    }
  }

  const snackHandler = () => {
    setMostrarSnack(true);
    setTimeout(() => {
      setMostrarSnack(false);
    }, 2000);
  };

  const snackHandlerDistinto = () => {
    setMostrarSnackDistinto(true);
    setTimeout(() => {
      setMostrarSnackDistinto(false);
    }, 2000);
  };

  const snackHandlerError = () => {
    setMostrarSnackError(true);
    setTimeout(() => {
      setMostrarSnackError(false);
    }, 5000);
  };


  const handleErrorContra = () => {
    if (contraseña.length > 0) {
      setErrorContra(false)
    } else {
      setErrorContra(true)
    }
  }

  const handleErrorContraRepetir = () => {
    if (contraseñaRepetir.length > 0) {
      setErrorContraRepetir(false)
    } else {
      setErrorContraRepetir(true)
    }
  }

  const handleInputChange = () => {
    setMostrarContraseña(!mostrarContraseña);
  }
  const handleInputChange2 = () => {
    setMostrarContraseña2(!mostrarContraseña2);
  }
  const estiloAnimacionInicio = {
    transform: [{ scale: animacionboton }]
  }

  const spinnerStart = () => {
    setVistaSpinner(true);
  };

  const spinnerStop = () => {
    setVistaSpinner(false);
  };

  return (
    <SafeAreaView style={styles.contenedor}>

      <Spinner
        visible={vistaSpinner}
      />

      <View style={styles.vistaAclaracion}>
        <Text style={styles.textoAclaracionTitulo} variant='headlineSmall'>Elija su nueva clave para iniciar sesión, recuerde que la clave debe cumplir con los siguientes requisitos: </Text>
        <Text style={styles.textoAclaracion} variant='titleMedium'>- Debe contener al menos 8 caracteres </Text>
        <Text style={styles.textoAclaracion} variant='titleMedium'>- No contener caracteres especiales </Text>
        <Text style={styles.textoAclaracion} variant='titleMedium'>- Contener Mayúsculas y Minúsculas </Text>
        <Text style={styles.textoAclaracion} variant='titleMedium'>- Contener Letras y Números </Text>
        <Text style={styles.textoAclaracion} variant='titleMedium'>- Sin caracteres repetidos </Text>
        <Text style={styles.textoAclaracion} variant='titleMedium'>- Sin números repetidos </Text>
        <Text style={styles.textoAclaracion} variant='titleMedium'>- No repetir últimas 3 claves </Text>
      </View>

      <View style={styles.vista}>
        <Text style={styles.texto} variant='titleLarge'>Nueva contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder='1234'
          label={'Nueva contraseña'}
          value={contraseña}
          onChangeText={(texto) => setContraseña(texto)}
          onBlur={handleErrorContra}
          secureTextEntry={mostrarContraseña2}
          right={
            <TextInput.Icon
              icon="eye"
              onPress={() => handleInputChange2()}
              iconSize={24}
            />
          }
          mode='outlined'

        >
        </TextInput>
        <HelperText type="error" visible={errorContra}>
          Este campo es obligatorio
        </HelperText>
      </View>

      <View style={styles.vistaAclaracion}>
        <Text style={styles.texto} variant='titleLarge'>Repetir nueva contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder='1234'
          label={'Repetir contraseña'}
          value={contraseñaRepetir}
          onChangeText={(texto) => setContraseñaRepetir(texto)}
          onBlur={handleErrorContraRepetir}
          secureTextEntry={mostrarContraseña}
          right={
            <TextInput.Icon
              icon="eye"
              onPress={() => handleInputChange()}
              iconSize={24}
            />
          }
          mode='outlined'

        >
        </TextInput>
        <HelperText type="error" visible={errorContraRepetir}>
          Este campo es obligatorio
        </HelperText>
      </View>

      <View style={styles.vistaAclaracion}>
        <Animated.View style={estiloAnimacionInicio}>
          <Button
            mode='elevated'
            style={styles.boton}
            onPressIn={() => pressBtn()}
            onPressOut={() => soltarBtn()}
            onPress={() => handleInicio()}
          >
            <Text style={styles.botonTexto} variant='labelMedium'>
              Cambiar contraseña
            </Text>
          </Button>
        </Animated.View>
      </View>


      <Snackbar
        visible={mostrarSnack}
      >
        No puede haber campos vacios.
      </Snackbar>
      <Snackbar
        visible={mostrarSnackDistinto}
      >
        Las contraseñas no coinciden.
      </Snackbar>
      <Snackbar
        visible={mostrarSnackError}

      >
        <Text style={styles.textoSnack}>No se cumplen todas las condiciones para la contraseña:</Text>
        {errorLongitud && <Text style={styles.textoSnack}>- Muy corta</Text>}
        {errorEspeciales && <Text style={styles.textoSnack}>-No usar caracteres especiales</Text>}
        {errorMayusculas && <Text style={styles.textoSnack}>-Debe tener minúsculas y mayúsculas</Text>}
        {errorNumeros && <Text style={styles.textoSnack}>-Debe tener letras y números</Text>}
        {errorRepetidos && <Text style={styles.textoSnack}>-No usar caracteres repetidos</Text>}
        {errorCorrelativos && <Text style={styles.textoSnack}>-No repetir números</Text>}
        {errorPassRepetida && <Text style={styles.textoSnack}>-No repetir las últimas 3 claves</Text>}

      </Snackbar>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#ddede7',
    padding: 20,
    paddingLeft: 30,
  },
  textoSnack: {
    color: '#FFF',
    fontSize: 16,
  },
  vistaTitulo: {
    width: '100%',
    height: '100%',
    maxHeight: 250,
  },
  vista: {
    width: '90%',
    marginBottom: 10,
    marginVertical: 20,
  },
  vistaAclaracion: {
    width: '90%',
    marginBottom: 10,
  },
  titulo: {
    marginVertical: 40,
    fontWeight: '700',
    textAlign: 'center'

  },
  texto: {
    fontWeight: '700',
  },
  textoAclaracionTitulo: {
    fontWeight: '700',
    color: '#545454',
  },
  textoAclaracion: {
    fontWeight: '700',
    color: '#545454',
    fontStyle: 'italic'
  },
  textoAclaracionError: {
    fontWeight: '700',
    color: '#b02033',
    fontStyle: 'italic'
  },
  boton: {
    marginBottom: 60,
    borderWidth: 1,
    width: '100%',
    height: 70,
    justifyContent: 'center',
  },
  botonTexto: {
    fontSize: 15,
    textAlign: 'center',
    textTransform: 'uppercase',
    height: '100%',
  },
  input: {
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 20,
  },
  imagen: {
    width: '100%',
    resizeMode: 'contain',
    flex: 1,
  },
}
)


export default CambiarContrasena