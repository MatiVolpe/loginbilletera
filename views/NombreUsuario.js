import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from 'react'
import { Animated, ImageBackground, StyleSheet, View } from 'react-native'
import { HelperText, Snackbar, Text, TextInput, Button } from 'react-native-paper'
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';

const NombreUsuario = ({ navigation }) => {


    const [datos, setDatos] = useState('');
    const [urlUsuario, setUrlUsuario] = useState('');
    const [urlEmail, setUrlEmail] = useState('');
    const [urlTraductor, setUrlTraductor] = useState('');
    const [idMutual, setIdMutual] = useState('');
    const [idSucursal, setIdSucursal] = useState('');
    const [nombre, setNombre] = useState('');
    const [nroPersona, setNroPersona] = useState('');
    const [correo, setCorreo] = useState('');
    const [usuario, setUsuario] = useState('');
    const [animacionboton] = useState(new Animated.Value(1));
    const [mostrarSnackLongitud, setMostrarSnackLongitud] = useState(false);
    const [mostrarSnackExistente, setMostrarSnackExistente] = useState(false);
    const [vistaSpinner, setVistaSpinner] = useState(false);
    const [claveTemporal, setClaveTemporal] = useState('');
    const [idTelefono, setIdTelefono] = useState('');
    const [llamado, setLlamado] = useState(false);




    useEffect(() => {
        const getData = async () => {
            try {
                const datos_persona = await AsyncStorage.getItem('datos_persona');
                const url_usuario = await AsyncStorage.getItem('url_usuario');
                const id_mutual = await AsyncStorage.getItem('id_mutual');
                const id_sucursal = await AsyncStorage.getItem('id_sucursal');
                const url_email = await AsyncStorage.getItem('url_email');
                const url_traductor = await AsyncStorage.getItem('url_traductor');
                DeviceInfo.getUniqueId().then((uniqueId) => {
                    setIdTelefono(uniqueId);
                })

                if (datos_persona !== null) {
                    const parsedDatos = JSON.parse(datos_persona);
                    setDatos(parsedDatos);
                    setNombre(parsedDatos.data.nombre);
                    setNroPersona(parsedDatos.data.nro_persona);
                    setCorreo(parsedDatos.data.email);

                    setUrlUsuario(url_usuario);
                    setUrlEmail(url_email);
                    setIdMutual(id_mutual);
                    setIdSucursal(id_sucursal);
                    setUrlTraductor(url_traductor);
                }

            } catch (error) {
                console.error(error);
            }

        }
        getData();
    }, [])


    const validarUsuario = async () => {
        const response = await axios.post(urlUsuario, {
            'encriptado': 'NEOPOSTMAN',
            'id_mutual': `${idMutual}`,
            'id_sucursal': `${idSucursal}`,
            'usuario': `${usuario}`,
            'nro_persona': `${nroPersona}`,
            'correo': `${correo}`,
        }).then((response) => {
            return !response.data.error;
        }).catch((error) => {
            console.log("Error en validación de usuario..", error);
        })
    }


    const registroUsuario = async () => {
        const response = await axios.post(urlTraductor, {
            'dir_url': 'http://201.216.239.83',
            'dir_puerto': '7846',
            'dir_api': '/homebanking/n_homebanking.asmx?WSDL',
            'metodo': 'registrar_usuario',
            'data': `{"empresa": "NEOPOSTMAN", "nro_persona": ${nroPersona}, "usuario": "${usuario}","password": "${claveTemporal}", "id_telefono": "${idTelefono}"}`
        }).then((response) => {
            console.log("Registrar usuario: ", response);
            return response.data.data.success === 'TRUE';
        }).catch((error) => {
            console.log("Error en registro de usuario..", error)
        })
    }

    const emailUsuario = async () => {
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
        }).then((response) => {
            return JSON.stringify(response.data.success) === 'true';
        }).catch((error) => {
            console.log("Error en envio de email..", error);
        })
    }

    useEffect(() => {
        spinnerStart();
        if (claveTemporal !== '') {
            console.log("validar:");
            const valido = validarUsuario();
            console.log("registro:");
            const registrado = registroUsuario();
            if (valido && registrado) {
                console.log("email:");
                const emailEnviado = emailUsuario();
                if (emailEnviado) {
                    spinnerStop();
                    navigation.navigate('EmailTemporal', { usuario, urlEmail, claveTemporal, correo, nombre, idMutual, idSucursal });
                }
            }
        }
        spinnerStop();
    }, [claveTemporal])

    const generarCodigo = () => {
        const min = 100000;
        const max = 999999;
        const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
        return randNum;
    };

    const handleSiguiente = () => {
        spinnerStart();
        if (usuario.trim().length < 8) {
            snackHandlerLongitud();
            spinnerStop();
        } else {
            setClaveTemporal(generarCodigo());
        }
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


    const estiloAnimacionInicio = {
        transform: [{ scale: animacionboton }]
    }


    const snackHandlerLongitud = () => {
        setMostrarSnackLongitud(true);
        setTimeout(() => {
            setMostrarSnackLongitud(false);
        }, 3000);
    };

    const snackHandlerExistente = () => {
        setMostrarSnackExistente(true);
        setTimeout(() => {
            setMostrarSnackExistente(false);
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
            <Spinner
                visible={vistaSpinner}
            />
            <ImageBackground
                source={require('../background.jpg')}
                style={styles.backgroundImage}
                resizeMode='cover'
            >
                <View>
                    <Text variant='headlineMedium' style={styles.titulo}>Hola {nombre}!</Text>
                    <View>
                        <Text variant='headlineSmall' style={styles.texto}>Elegí un nombre de usuario:</Text>
                    </View>
                </View>
                <View style={styles.vista}>
                    <TextInput
                        style={styles.input}
                        placeholder='Ej. nombre'
                        label='Usuario'
                        value={usuario}
                        outlineColor='#219EBC'
                        activeOutlineColor='#023047'
                        onChangeText={(texto) => setUsuario(texto.trim())}
                        mode='outlined'
                    />
                    <View style={[styles.vista, { flexDirection: 'row', alignItems: 'center' }]}>
                        <Text style={{ marginVertical: 15, fontSize: 16 }}>Debe tener más de 8 caracteres</Text>
                    </View>
                    <HelperText type="error" visible={false}>
                        Este campo es obligatorio
                    </HelperText>

                </View>
                <Animated.View style={[styles.vista, estiloAnimacionInicio]}>
                    <Button
                        onPress={handleSiguiente}
                        onPressIn={pressBtn}
                        onPressOut={soltarBtn}
                        mode="contained"
                        buttonColor='#023047'
                        style={styles.boton}
                    >
                        <Text style={styles.botonTexto} variant='titleMedium'>Siguiente</Text>
                    </Button>
                </Animated.View>

                <Snackbar
                    visible={mostrarSnackLongitud}
                    style={{ zIndex: 999, bottom: 120, marginLeft: 35 }}
                >
                    <Text style={{ fontSize: 16, color: 'white' }}>El nombre de usuario debe tener al menos 8 caracteres.</Text>
                </Snackbar>
                <Snackbar
                    visible={mostrarSnackExistente}
                    style={{ zIndex: 999, bottom: 120, marginLeft: 35 }}
                >
                    <Text style={{ fontSize: 16, color: 'white' }}>El nombre de usuario ya existe.</Text>
                </Snackbar>
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
        marginVertical: 40,
        fontWeight: '700',
        textAlign: 'center',

    },
    texto: {
        fontWeight: '700',
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
        textAlign: 'left',
        fontSize: 20,
    },
    countdownView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 25,

    }
})

export default NombreUsuario