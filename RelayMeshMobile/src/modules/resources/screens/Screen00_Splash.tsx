import React, { useEffect } from 'react';
import {
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

interface Props {
  onFinish?: () => void;
}

const { width, height } = Dimensions.get('window');

export const Screen00_Splash: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    // Automatically transition to next screen after 2.5 seconds
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onFinish}
      style={styles.container}
    >
      <StatusBar hidden={true} />
      <Image
        source={require('../../../../assets/splash_figma.png')}
        style={styles.splashImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#155E38',
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
});
