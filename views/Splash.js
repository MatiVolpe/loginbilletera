import React, { useEffect, useState } from 'react'
import { Image, Animated, StyleSheet, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const Splash = ({ navigation }) => {

    const [visible, setVisible] = useState(false);

    const [animacionLogo] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(
            animacionLogo, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }
        ).start();
        setTimeout(() => {
            setVisible(true);
        }, 1500);
        setTimeout(() => {
            navigation.navigate("Login")
        }, 3000);
    }, []);



    return (
        <SafeAreaView>
            <Animated.View style={styles.contenedor}>
                <View style={styles.vista}>
                    <Animated.Image
                        style={[{ opacity: animacionLogo }, styles.imagenArriba]}
                        source={require('../logoSplash.png')}
                    />
                </View>
                <View style={styles.rueda}>
                    <ActivityIndicator
                        animating={visible}
                        color='#cfe8a7'
                        size={'large'}
                    />
                </View>
                <View style={styles.vistaAbajo}>
                    <Animated.Image
                        style={[{ opacity: animacionLogo }, styles.imagenAbajo]}
                        source={require('../logo-rectangular.png')}
                    />
                </View>

            </Animated.View>
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
    },
    imagenAbajo: {
        width: '100%',
        resizeMode: 'contain',
    },

})

export default Splash