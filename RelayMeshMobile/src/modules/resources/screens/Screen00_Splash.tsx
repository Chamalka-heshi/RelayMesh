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
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ImageBackground
          source={require('../../../../assets/splash_bg.png')} 
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.centerContent}>
            <Image
              source={require('../../../../assets/splash_logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            
            <Text style={styles.appTitle}>RelayMesh</Text>
            <Text style={styles.tagline}>Offline. Connected. Together.</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0F172A',
  },
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
    width: 120, 
    height: 120,
    marginBottom: 24,
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 16,
    fontWeight: '400',
    marginTop: 10,
    letterSpacing: 0.2,
  },
});