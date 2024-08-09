import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Image} from 'react-native'
import { Text } from 'react-native-paper';


const Finalizado = (navigation) => {

  return (
    <View style={styles.contenedor}>
      <View style={styles.vistaTitulo}>
        <Image
          source={require('../logoLogin.png')}
          style={styles.imagen}
        />
      </View>
      <View style={styles.vista}>
        <Text style={styles.texto} variant='titleLarge'>Bienvenido a Cash Mutual ..</Text>
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
    resizeMode: 'contain',
    flex: 1,
    
  },
}
)

export default Finalizado