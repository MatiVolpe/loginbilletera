import React, { useEffect, useState } from 'react'
import { Image, Animated, StyleSheet, View, ImageBackground } from 'react-native'
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const Splash = ({ navigation }) => {

    const [visible, setVisible] = useState(false);

    const [animacionLogo] = useState(new Animated.Value(0));
    const [animacionLogo2] = useState(new Animated.Value(.8));
    const [animacionLogo3] = useState(new Animated.Value(0));


    useEffect(() => {
        Animated.sequence([
            Animated.timing(
                animacionLogo, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.timing(
                animacionLogo2, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(
                animacionLogo2, {
                toValue: 1.01,
                duration: 3000,
                useNativeDriver: true,
            }
            ),
            Animated.parallel([
                Animated.timing(
                    animacionLogo2, {
                    toValue: 120,
                    duration: 1000,
                    useNativeDriver: true,
                }),
])
        ]).start();
        setTimeout(() => {
            setVisible(true);
        }, 2000);
        setTimeout(() => {
            setVisible(false);
        }, 5500);
        setTimeout(() => {
            navigation.navigate("Login")
        }, 6500);
    }, []);

    const estiloAnimacion = {
        transform: [
            { scale: animacionLogo2 },
            { translateY: animacionLogo3 }
        ]
    }


    return (
        <SafeAreaView>
            <ImageBackground
                source={require('../background.jpg')}
            >
                <Animated.View style={styles.contenedor}>
                    <View style={styles.vista}>
                        <Animated.Image
                            style={[{ opacity: animacionLogo }, estiloAnimacion, styles.imagenArriba]}
                            source={require('../logoSplash.png')}
                        />
                    </View>
                    <View style={styles.rueda}>
                        <ActivityIndicator
                            animating={visible}
                            color='#023047'
                            size={'large'}
                        />
                    </View>
                    <View style={styles.vistaAbajo}>
                        <Animated.Image
                            style={[styles.imagenAbajo]}
                            source={require('../logo-rectangular.png')}
                        />
                    </View>

                </Animated.View>
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    contenedor: {
        justifyContent: 'center',
    },
    rueda: {
        marginTop: 80,
    },
    vista: {
        marginHorizontal: 20,
        marginTop: 80,
        maxHeight: 200
    },
    vistaAbajo: {
        position: 'fixed',
        marginHorizontal: 20,
        marginTop: 20,

    },
    imagenArriba: {
        width: '100%',
        maxHeight: 250,
        resizeMode: 'contain',
        zIndex: 999,
    },
    imagenAbajo: {
        width: '100%',
        resizeMode: 'contain',
    },

})

export default Splash