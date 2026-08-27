import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Typography } from '../../../shared';

interface Props {
  onFinish?: () => void;
}

export const Screen00_Splash: React.FC<Props> = () => {
  return (
    <View style={styles.container}>
      {/* Centered Brand Content */}
      <View style={styles.centerContent}>
        {/* Connected Mesh Nodes Logo */}
        <View style={styles.logoWrapper}>
          <View style={styles.nodeTop} />
          <View style={styles.nodeLeft} />
          <View style={styles.nodeRight} />
          <View style={styles.nodeCenter} />
          <Text style={styles.logoEmoji}>📡</Text>
        </View>

        <Text style={[Typography.h1, styles.appTitle]}>RelayMesh</Text>
        <Text style={styles.tagline}>Offline. Connected. Together.</Text>
        <Text style={styles.subphrase}>Communication when the network is gone.</Text>
      </View>

      {/* Loading Indicator at Bottom */}
      <View style={styles.bottomLoader}>
        <ActivityIndicator color="#FFFFFF" size="small" />
        <Text style={styles.loadingText}>Initializing P2P Mesh Radios...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 44,
  },
  nodeTop: {
    position: 'absolute',
    top: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  nodeLeft: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  nodeRight: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  nodeCenter: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primaryLight,
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tagline: {
    color: '#E8F5EC',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  subphrase: {
    color: 'rgba(232, 245, 236, 0.75)',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  bottomLoader: {
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#E8F5EC',
    fontSize: 11,
    fontWeight: '500',
  },
});
