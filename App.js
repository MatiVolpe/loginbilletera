import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { DefaultTheme, PaperProvider, Button, Text } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from './views/Splash';
import Login from './views/Login';
import Documento from './views/Documento';
import CodigoSMS from './views/CodigoSMS';
import NombreUsuario from './views/NombreUsuario';
import EmailTemporal from './views/EmailTemporal';
import CambiarContrasena from './views/CambiarContrasena';
import Finalizado from './views/Finalizado';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1774F2',
    accent: '#0655BF',
  }
}


const App = () => {

  useEffect(() => {
    const datosMutual = async () => {
      try {
        await AsyncStorage.setItem('id_mutual', '6');
        await AsyncStorage.setItem('id_sucursal', '1');
        await AsyncStorage.setItem('url_traductor', 'https://traductor.gruponeosistemas.com/n_hbconfig');
        await AsyncStorage.setItem('url_sms', 'https://billetera.gruponeosistemas.com/sms');
        await AsyncStorage.setItem('url_usuario', 'https://billetera.gruponeosistemas.com/registroUsuario');
        await AsyncStorage.setItem('url_email', 'https://billetera.gruponeosistemas.com/mail');
        await AsyncStorage.setItem('url_login', 'https://billetera.gruponeosistemas.com/consultaUsuarioLoginNewp');
      }
      catch {
        console.error(error);
      }
    }
    datosMutual();
  }, [])

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"

        >
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
              headerBackTitleVisible: false,
              headerLeft: null
            }}
          />
          <Stack.Screen
            name="Documento"
            component={Documento}
            options={{
              headerStyle: {
                backgroundColor: '#ddede7'
              },
              headerBackTitle: 'Atrás',
              headerTitle: '',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 24
              }
            }}
          />
          <Stack.Screen
            name="CodigoSMS"
            component={CodigoSMS}
            options={{
              headerStyle: {
                backgroundColor: '#ddede7'
              },
              headerBackTitle: 'Atrás',
              headerTitle: '',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 24
              }
            }}
          />
          <Stack.Screen
            name="NombreUsuario"
            component={NombreUsuario}
            options={{
              headerStyle: {
                backgroundColor: '#ddede7'
              },
              headerBackTitle: 'Atrás',
              headerTitle: '',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 24
              }
            }}
          />
          <Stack.Screen
            name="EmailTemporal"
            component={EmailTemporal}
            options={{
              headerStyle: {
                backgroundColor: '#ddede7'
              },
              headerBackTitle: 'Atrás',
              headerTitle: '',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 24
              }
            }}
          />
          <Stack.Screen
            name="CambiarContrasena"
            component={CambiarContrasena}
            options={{
              headerShown: false,
              headerBackTitleVisible: false,
              headerLeft: null
            }}
          />
          <Stack.Screen
            name="Finalizado"
            component={Finalizado}
            options={({navigation}) => ({
              headerStyle: {
                backgroundColor: '#ddede7'
              },
              headerTitle: '',
              headerBackTitleVisible: false,
              headerLeft: null,
              headerRight: () => <Button style={{borderRadius: 10, marginRight: 10}} buttonColor='#739488' title="Cerrar Sesión" onPress={() => navigation.navigate('Login')}><Text>Cerrar Sesión</Text></Button>
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({

});

export default App;
