import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ImageBackground, 
  StatusBar,
  TouchableWithoutFeedback
} from 'react-native';
import { Typography } from '../../../shared';

interface Props {
  onFinish?: () => void;
}

export const Screen00_Splash: React.FC<Props> = ({ onFinish }) => {
  // Auto-transition after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleScreenTap = () => {
    if (onFinish) {
      onFinish();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require('../../../../assets/splash_bg.png')} 
          style={styles.background}
          resizeMode="cover"
        >
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
          
          <View style={styles.centerContent}>
            <Image
              source={require('../../../../assets/splash_logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            
            <Text style={[Typography.h1, styles.appTitle]}>RelayMesh</Text>
            <Text style={styles.tagline}>Offline. Connected. Together.</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40, 
  },
  logo: {
    width: 130, 
    height: 130,
    marginBottom: 20,
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
    marginTop: 8,
    letterSpacing: 0.2,
  },
});