import React, { useState } from 'react'
import { Animated, ImageBackground, Pressable, StyleSheet, View } from 'react-native'
import { Text, Button } from 'react-native-paper'
import axios from 'axios'


const EmailTemporal = ({ navigation, route }) => {

  const { usuario, urlEmail, claveTemporal, correo, nombre, idMutual, idSucursal } = route.params;
  const [animacionboton] = useState(new Animated.Value(1));
  const [animacionboton2] = useState(new Animated.Value(1));



  const handleInicio = () => {
    navigation.navigate('Login');
  }

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

  const enviarDeNuevo = async () => {
    try {
      const response = await axios.post(urlEmail, {
        'Mutual_nombre': 'Billetera Mutual Central SC',
        'Mutual_logo': 'https://billetera.gruponeosistemas.com/logos/logoLoginSanCarlos.png',
        'Mutual_sender': 'billetera@mutualcentral.com.ar',
        'Plantilla_color': '#C14F5B',
        'Socio_nombre': `${nombre}`,
        'Socio_mail': `${correo}`,
        'Asunto_mail': 'Registro de Usuario BILLETERA Mutual Central SC',
        'Titulo': 'Clave de Acceso Provisoria',
        'Link': '',
        'Text1': 'Su nombre de usuario es',
        'Contenido1': `${usuario}`,
        'Text2': 'La clave provisoria es',
        'Contenido2': `${claveTemporal}`,
        'Text3': '',
        'Contenido3': '',
        'Text4': '',
        'Contenido4': '',
        'tipo': '1',
        'id_mutual': `${idMutual}`,
        'id_sucursal': `${idSucursal}`,
      })
      console.log(response);
    } catch (error) {
      console.log("Error", error)
    }
  }

  const estiloAnimacionInicio = {
    transform: [{ scale: animacionboton }]
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

  const estiloAnimacionInicio2 = {
    transform: [{ scale: animacionboton2 }]
  }

  return (
    <View style={styles.contenedor}>
      <ImageBackground
        source={require('../background.jpg')}
        style={styles.backgroundImage}
        resizeMode='cover'
      >
        <View>
          <View>
            <Text variant='headlineMedium' style={styles.titulo}>Usuario confirmado!</Text>
          </View>
          <View>
            <Text variant='headlineSmall' style={styles.titulo}>Tu nombre de usuario es:</Text>
          </View>
          <View>
            <Text variant='headlineMedium' style={[styles.texto, { color: '#023047' }]}>{usuario}</Text>
          </View>
          <Text variant='headlineSmall' style={styles.titulo}>Te enviamos tu clave provisoria para iniciar sesion a tu correo</Text>
        </View>

        <Animated.View style={[styles.vista, estiloAnimacionInicio]}>
          <Button
            mode="contained"
            buttonColor='#023047'
            style={[styles.boton]}
            onPress={handleInicio}
            onPressIn={pressBtn}
            onPressOut={soltarBtn}
          >
            <Text style={[styles.botonTexto]} variant='headlineSmall'>ir a Iniciar Sesión</Text>
          </Button>
        </Animated.View>


        <View style={{ alignContent: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 20 }}>¿No recibiste el correo?</Text>

          <Animated.View style={estiloAnimacionInicio2}>
            <Button
              mode="contained"
              buttonColor='#023047'
              style={[styles.boton, {marginTop: 10, borderRadius: 15}]}
              onPress={enviarDeNuevo}
              onPressIn={pressBtn2}
              onPressOut={soltarBtn2}
            >
              <Text style={[styles.botonTexto, { fontSize: 16 }]} variant='labelMedium'>Volver a enviar</Text>
            </Button>
          </Animated.View>
        </View>
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
  },
  titulo: {
    marginVertical: 25,
    fontWeight: '400',
    textAlign: 'center',

  },
  texto: {
    fontWeight: '700',
    textAlign: 'center',
  },
  botonTexto: {
    height: 20,
    marginVertical: 10,
    fontSize: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingVertical: 5,
    color: 'white'
  },

})


export default EmailTemporal