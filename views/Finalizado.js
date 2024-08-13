import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Image, ImageBackground } from 'react-native'
import { Text } from 'react-native-paper';


const Finalizado = (navigation) => {

  return (
    <View style={styles.contenedor}>
      <ImageBackground
        source={require('../background.jpg')}
        style={styles.backgroundImage}
        resizeMode='cover'
      >
        <View style={styles.vistaTitulo}>
          <Image
            source={require('../logoLogin.png')}
            style={styles.imagen}
          />
        </View>
        <View style={styles.vista}>
          <Text style={styles.titulo} variant='titleLarge'>Bienvenido a Cash Mutual</Text>
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
    justifyContent: 'flex-start',
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
  vistaTitulo: {
    width: '100%',
    height: '100%',
    maxHeight: 200,
    marginTop: 30,
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
  },
  input: {
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 20,
  },
  imagen: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',

  },
}
)

export default Finalizado