import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Animated, ImageBackground, StyleSheet, View } from 'react-native';
import { HelperText, Text, TextInput, Snackbar, Button } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';

const Olvidada = ({ navigation }) => {
  const [documento, setDocumento] = useState('');
  const [errorDocumento, setErrorDocumento] = useState(false);
  const [animacionboton] = useState(new Animated.Value(1));
  const [tipoDoc, setTipoDoc] = useState("1"); //1 si es dni o 2 si es cuit
  const [urlTraductor, setUrlTraductor] = useState('');
  const [urlSms, setUrlSms] = useState('');
  const [mostrarSnack, setMostrarSnack] = useState(false);
  const [telefono, setTelefono] = useState('');
  const [codigoSeguridad, setCodigoSeguridad] = useState('');
  const [vistaSpinner, setVistaSpinner] = useState(false);
  const [flagNavigate, setFlagNavigate] = useState(false);

  useEffect(() => {
    const setIds = async () => {
      const urlTraductorValue = await AsyncStorage.getItem('url_traductor');
      const urlSmsValue = await AsyncStorage.getItem('url_sms');
      setUrlTraductor(urlTraductorValue);
      setUrlSms(urlSmsValue);
    };

    setIds();
  }, []);

  const guardarDatos = async (datos, codigoGenerado) => {
    try {
      console.log(JSON.stringify(datos));
      await AsyncStorage.setItem('datos_persona', JSON.stringify(datos));
      await AsyncStorage.setItem('codigo_seguridad', String(codigoGenerado));
    } catch {
      console.error("Error guardar datos");
    }
  };


  const generarCodigo = () => {
    const min = 100000;
    const max = 999999;
    const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    setCodigoSeguridad(randNum);
    return randNum;
  };


  const enviarMensaje = async (telefono, codigoSeguridad) => {
    try {
      const responseMensaje = await axios.post(urlSms, {
        'numero_celular': `+54${telefono}`,
        'mensaje': `Su código de verificación es ${codigoSeguridad}. Este es un mensaje de la BILLETERA Mutual Central SC  `,
        'categoria': 'MutualCentralSC',
        'tipo': 1,
      });
    } catch (error) {
      console.error("Error al enviar el mensaje", error);
    }
  };

  const validarDoc = async () => {
    try {
      spinnerStart();
      const responseValidar = await axios.post(urlTraductor, {
        'dir_url': 'http://201.216.239.83',
        'dir_puerto': '7846',
        'dir_api': '/homebanking/n_homebanking.asmx?WSDL',
        'metodo': 'validar_documento',
        'data': `{"empresa": "NEOPOSTMAN", "tipodoc": ${tipoDoc}, "nrodoc": ${documento}}`,
      })
      const respuesta = responseValidar.data.data;
      if (respuesta.success === 'TRUE' && respuesta.data.encontrado === 1) {
        const telefonoValue = responseValidar.data.data.data.telefono_celular;
        const codigoGenerado = generarCodigo();
        setTelefono(telefonoValue);
        // setCodigoSeguridad(generarCodigo());
        guardarDatos(respuesta, codigoGenerado);
        enviarMensaje(telefonoValue, codigoGenerado).then(() => {
          spinnerStop();
          setFlagNavigate(true);
        }).catch(() => {
          spinnerStop();
          console.error("No pudo enviarse el SMS");
        });
      } else {
        spinnerStop();
        console.error("No se encuetra a la persona");
      }
    } catch {
      console.error("Hubo un error al consultar los datos");
      spinnerStop();
    }
  };

  useEffect(() => {
    if (flagNavigate && telefono && codigoSeguridad !== undefined) {
      navigation.navigate('CodigoSMS', { urlSms, telefono, codigoSeguridad });
    }
  }, [flagNavigate])

  const pressBtn = () => {
    Animated.spring(animacionboton, {
      toValue: 0.8,
      useNativeDriver: true
    }).start();
  };

  const soltarBtn = () => {
    Animated.spring(animacionboton, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true
    }).start();
  };

  const handleErrorDocumento = () => {
    if (documento.length > 0) {
      setErrorDocumento(false);
    } else {
      setErrorDocumento(true);
    }
  };

  const estiloAnimacionInicio = {
    transform: [{ scale: animacionboton }]
  };

  const handleBotonSMS = () => {
    if (documento.trim() === "") {
      snackHandler();
    } else {
      validarDoc();
    }
  };

  const snackHandler = () => {
    setMostrarSnack(true);
    setTimeout(() => {
      setMostrarSnack(false);
    }, 2000);
  };

  const spinnerStart = () => {
    setVistaSpinner(true);
  };

  const spinnerStop = () => {
    setVistaSpinner(false);
  };

  return (
    <View style={styles.contenedor}>
      <ImageBackground
        source={require('../background.jpg')}
        style={styles.backgroundImage}
        resizeMode='cover'
      >
        <Spinner
          visible={vistaSpinner}
        />

        <View>
          <Text variant='headlineLarge' style={styles.titulo}>Reestablecer contraseña</Text>
        </View>

        <View style={styles.vista}>
          <Text style={styles.texto} variant='titleLarge'>Seleccione tipo de documento</Text>
          <View style={styles.dropdown}>
            <Dropdown
              mode='outlined'
              label="Tipo de documento"
              placeholder="Elija documento o CUIT"
              options={[
                { label: 'DNI', value: "1" },
                { label: 'CUIT', value: "2" }
              ]}
              value={tipoDoc}
              onSelect={setTipoDoc}
            />
          </View>
        </View>
        <View style={styles.vista}>
          <Text style={styles.texto} variant='titleLarge'>Ingrese su {tipoDoc === "1" ? "documento" : "CUIT"}</Text>
          <TextInput
            style={[styles.input, { fontSize: 18 }]}
            placeholder=' Ej: 123456789'
            label={'Documento'}
            outlineColor='#219EBC'
            activeOutlineColor='#023047'
            value={documento}
            onChangeText={(texto) => setDocumento(texto)}
            onBlur={handleErrorDocumento}
            mode='outlined'
          />
          <HelperText type="error" visible={errorDocumento}>
            Este campo es obligatorio
          </HelperText>
        </View>


        <Animated.View style={estiloAnimacionInicio}>
          <Button
            mode="contained"
            buttonColor='#023047'
            style={styles.boton}
            onPressIn={() => pressBtn()}
            onPressOut={() => soltarBtn()}
            onPress={handleBotonSMS}
          >
            <View style={styles.vistaTextoBoton}>
              <Text style={styles.botonTexto} variant='titleMedium'>
                Enviar SMS
              </Text>
            </View>
          </Button>
        </Animated.View>
        <View style={styles.vista}>
          <Snackbar
            visible={mostrarSnack}
          >
            No puede haber campos vacios.
          </Snackbar>
        </View>
      </ImageBackground>
    </View>
  );
};

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
  },
  vistaTextoBoton: {
    width: '100%',
  },
  titulo: {
    marginVertical: 40,
    fontWeight: '600',
    textAlign: 'center',
    color: '#023047'
  },
  texto: {
    marginTop: 10,
    fontWeight: '600',
  },
  boton: {
    marginVertical: 20,
    width: '100%',
    height: 40,
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
  },
  dropdown: {
    marginTop: 20,
    marginBottom: 10
  },
});

export default Olvidada;
