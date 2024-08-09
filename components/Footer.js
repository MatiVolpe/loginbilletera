import React from 'react'
import { Image } from 'react-native'
import { Box } from 'native-base'
const Footer = () => {
    return (
        <Box
            position="absolute"
            bottom={10}
            left={0}
            right={0}
            alignItems="center"
            backgroundColor="#e8e8d8"
            p={2}
        >
            <Image
                source={ require('../logoLogin.png') } 
                alt="Footer"
                resizeMode="contain"
                style={{ width: '100%', height: 50,  }}
            />
        </Box>
    )
}

export default Footer