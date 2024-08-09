import React, { useState } from 'react'
import { Animated, Pressable, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import axios from 'axios'
import { Button } from 'native-base';


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
      <View>
        <View>
          <Text variant='headlineMedium' style={styles.titulo}>Usuario confirmado!</Text>
        </View>
        <View>
          <Text variant='headlineSmall' style={styles.texto}>Tu nombre de usuario es:</Text>
        </View>
        <View>
          <Text variant='headlineSmall' style={[styles.titulo, style = { color: '#663399' }]}>{usuario}</Text>
        </View>
        <Text variant='headlineSmall' style={styles.texto}>Te enviamos tu clave provisoria para iniciar sesion a tu casilla de correo</Text>
      </View>

      <Animated.View style={[styles.vista, estiloAnimacionInicio]}>
        <Button
          onPress={handleInicio}
          onPressIn={pressBtn}
          onPressOut={soltarBtn}
          variant="subtle"
          size="sm"
          style={[styles.boton, {height: 60}]}
          bg="#b2d6bf"

        >
          <Text style={[styles.botonTexto, {height: 30}]}>ir a Iniciar Sesión</Text>
        </Button>
      </Animated.View>


      <View style={{ alignContent: 'center', marginTop: 20 }}>
        <Text style={{fontSize: 20}}>¿No recibiste el correo?</Text>

        <Animated.View style={estiloAnimacionInicio2}>
          <Pressable 
            style={{borderWidth: 1, borderRadius: 10, padding: 5, margin: 5, backgroundColor: '#FFF'}}
            onPress={enviarDeNuevo}
            onPressIn={pressBtn2}
            onPressOut={soltarBtn2}
          >
            <Text style={{ color: 'blue100', textAlign:'center', fontSize: 20 }}>Volver a enviar</Text>
          </Pressable>
        </Animated.View>
      </View>

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
    marginVertical: 20,
    borderWidth: 1,
    width: '100%',
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
    fontWeight: '600',
  },

})


export default EmailTemporal