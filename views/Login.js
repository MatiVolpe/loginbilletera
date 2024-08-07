import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Animated, Image, Alert, SectionList } from 'react-native'
import { Button, HelperText, Snackbar, Text, TextInput } from 'react-native-paper';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';


const Login = ({ navigation }) => {

  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [nroPersona, setNroPersona] = useState('');
  const [animacionboton] = useState(new Animated.Value(1));
  const [errorUsuario, setErrorUsuario] = useState(false);
  const [errorContra, setErrorContra] = useState(false);
  const [animacionRegistro] = useState(new Animated.Value(1));
  const [mostrarSnack, setMostrarSnack] = useState(false);
  const [urlLogin, setUrlLogin] = useState('');
  const [idMutual, setIdMutual] = useState('');
  const [urlTraductor, setUrlTraductor] = useState('');
  const [urlDir, setUrlDir] = useState('');
  const [urlPuerto, setUrlPuerto] = useState('');
  const [resetear, setResetear] = useState('');
  const [success, setSuccess] = useState('');
  const [encontrado, setEncontrado] = useState('');
  const [vistaSpinner, setVistaSpinner] = useState(false);
  const [mostrarContraseña, setMostrarContraseña] = useState(true);



  useEffect(() => {
    const setUrl = async () => {
      const url_login = await AsyncStorage.getItem('url_login');
      const id_mutual = await AsyncStorage.getItem('id_mutual');
      const url_traductor = await AsyncStorage.getItem('url_traductor');
      setUrlLogin(url_login);
      setIdMutual(id_mutual);
      setUrlTraductor(url_traductor);
      setUsuario("");
      setContraseña("");
      setSuccess('');
      setEncontrado('');
      setResetear('');
    }
    setUrl();
  }, [])

  const guardarDatos = async (urlDir, urlPuerto) => {
    try {
      await AsyncStorage.setItem('url_dir', urlDir);
      await AsyncStorage.setItem('url_puerto', urlPuerto);
    } catch (error) {
      console.error("No se pudieron guardar los datos", error);
    }
  }


  const segundoInicio = async () => {
    const response2 = await axios.post('https://traductor.gruponeosistemas.com/n_hbconfig', {
      'dir_url': 'http://201.216.239.83',
      'dir_puerto': '7846',
      'dir_api': '/homebanking/n_homebanking.asmx?WSDL',
      'metodo': 'login_gral',
      'data': '{"empresa": "NEOPOSTMAN", "usuario": "' + usuario + '", "password": "' + contraseña + '", "nro_adicional": 0, "origen": 1}'
    }).then((response2) => {
      setNroPersona(response2.data.data.data.nro_persona);
      setResetear(response2.data.data.data.resetear);
      setEncontrado(response2.data.data.data.encontrado);
      console.log(response2.data);
    }).catch((error) => {
      console.log('res2', error);
    })
  }

  const inicioSesion = async () => {
    const response = await axios.post(urlLogin, {
      'encriptado': `NEOPOSTMAN`,
      'usuario': `${usuario}`,
      'mutual': `${idMutual}`
    }).then((response) => {
      setUrlDir(response.data.urlDir);
      setUrlPuerto(response.data.urlPuerto);
      setSuccess(response.data.success === "TRUE");
    }).catch((error) => {
      console.log('res1', error);
    })
  }

  const main = async () => {
    spinnerStart();
    const llamado2 = await segundoInicio();
    const llamado1 = await inicioSesion();
    spinnerStop();
  }


  useEffect(() => {
    console.log("Resetear: ", resetear);
    console.log("Success :", success);
    console.log("Encontrado: ", encontrado);
    if(success && encontrado === 0){
      Alert.alert(
        'Error de inicio de sesión',
        'No se encontró esa combinación de usuario y contraseña',
      )
      console.log("Usuario no encontrado");
      setContraseña('');
      setUsuario('');
      setSuccess(false);
    }
    if(resetear === 1 && success && encontrado === 1){
      guardarDatos(urlDir, urlPuerto);
      navigation.navigate('CambiarContrasena', { nroPersona, usuario, urlDir, urlPuerto });
    }
    if(resetear === 0 && success && encontrado === 1){
      guardarDatos(urlDir, urlPuerto);
      navigation.navigate('Finalizado', {usuario});
    }
    if(!success){
      console.log("No hay success");
    }
  }, [resetear, success, encontrado, navigation])

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


  const pressBtnReg = () => {
    Animated.spring(animacionRegistro, {
      toValue: 0.8,
      useNativeDriver: true
    }).start();
  }

  const soltarBtnReg = () => {
    Animated.spring(animacionRegistro, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true
    }).start();
  }
  const handleInicio = () => {
    if (usuario.trim() === "" || contraseña.trim() === "") {
      snackHandler();
    } else {
      main();
    }
  }

  const snackHandler = () => {
    setMostrarSnack(true);
    setTimeout(() => {
      setMostrarSnack(false);
    }, 2000);
  };

  const handleRegistro = () => {
    setUsuario('');
    setContraseña('');
    navigation.navigate("Documento")
  }

  const handleErrorUsuario = () => {
    if (usuario.length > 0) {
      setErrorUsuario(false)
    } else {
      setErrorUsuario(true)
    }
  }

  const handleErrorContra = () => {
    if (contraseña.length > 0) {
      setErrorContra(false)
    } else {
      setErrorContra(true)
    }
  }

  const estiloAnimacionInicio = {
    transform: [{ scale: animacionboton }]
  }


  const estiloAnimacionRegistro = {
    transform: [{ scale: animacionRegistro }]
  }

  const spinnerStart = () => {
    setVistaSpinner(true);
  };

  const spinnerStop = () => {
    setVistaSpinner(false);
  };
  const handleInputChange = () => {
    setMostrarContraseña(!mostrarContraseña);
  }

  return (
    <View style={styles.contenedor}>
      <Spinner
        visible={vistaSpinner}
      />
      <View style={styles.vistaTitulo}>
        <Image
          source={require('../logoLogin.png')}
          style={styles.imagen}
        />
      </View>


      <View style={styles.vista}>
        <Text style={styles.texto} variant='titleLarge'>Nombre de usuario</Text>
        <TextInput
          style={styles.input}
          placeholder='Nombre de usuario'
          label={'Usuario'}
          value={usuario}
          onChangeText={(texto) => setUsuario(texto)}
          onBlur={handleErrorUsuario}
          mode='outlined'
        />
        <HelperText type="error" visible={errorUsuario}>
          Este campo es obligatorio
        </HelperText>
      </View>

      <View style={styles.vista}>
        <Text style={styles.texto} variant='titleLarge'>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder='Contraseña'
          label={'Contraseña'}
          value={contraseña}
          onChangeText={(texto) => setContraseña(texto)}
          onBlur={handleErrorContra}
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
        <HelperText type="error" visible={errorContra}>
          Este campo es obligatorio
        </HelperText>
      </View>

      <View style={styles.vista}>
        <Animated.View style={estiloAnimacionInicio}>
          <Button
            mode='elevated'
            style={styles.boton}
            onPressIn={() => pressBtn()}
            onPressOut={() => soltarBtn()}
            onPress={() => handleInicio()}
          >
            <Text style={styles.botonTexto} variant='labelMedium'>
              Ingresar
            </Text>
          </Button>
        </Animated.View>
      </View>

      <View style={styles.vista}>
        <Text style={styles.texto} variant='titleMedium'>¿No estás registrado?</Text>
        <Animated.View style={estiloAnimacionRegistro}>
          <Button
            mode='elevated'
            style={styles.boton}
            onPressIn={() => pressBtnReg()}
            onPressOut={() => soltarBtnReg()}
            onPress={() => handleRegistro()}
          >
            <Text style={styles.botonTexto} variant='labelMedium'>
              Registrarse
            </Text>
          </Button>
        </Animated.View>
      </View>
      <Snackbar
        visible={mostrarSnack}
      >
        No puede haber campos vacios.
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
  vistaTitulo: {
    width: '100%',
    height: '100%',
    maxHeight: 250,
  },
  vista: {
    width: '90%',
  },
  titulo: {
    marginVertical: 40,
    fontWeight: '700',
    textAlign: 'center'

  },
  texto: {

    fontWeight: '700',
  },
  boton: {
    marginVertical: 20,
    borderWidth: 1,
    marginHorizontal: 10,
    padding: 10,
    width: '100%'
  },
  botonTexto: {
    marginVertical: 20,
    fontSize: 15,
    textAlign: 'center',
    textTransform: 'uppercase',

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


export default Login