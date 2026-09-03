import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography } from '../../../shared';

interface Props {
  onComplete?: () => void;
}

const { width } = Dimensions.get('window');

export const Screen01_Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: 'Stay Connected When It Matters Most',
      desc: 'RelayMesh keeps emergency communication moving even when cellular networks and internet connections are completely unavailable.',
      buttonText: 'Next',
      showSkip: true,
    },
    {
      id: 2,
      title: 'Send SOS Alerts Instantly',
      desc: 'Broadcast your emergency status, injury tags, and GPS coordinates to nearby users and rescue teams via mesh relays.',
      buttonText: 'Next',
      showSkip: true,
    },
    {
      id: 3,
      title: 'Find Nearby Resources',
      desc: 'Discover verified shelters, clean drinking water, medical camps, and food distribution points without internet access.',
      buttonText: 'Get Started',
      showSkip: false,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const active = steps[currentStep];

  // Render vector graphic matching Figma design for each step
  const renderIllustration = () => {
    switch (currentStep) {
      case 0:
        // Step 1: Two Connected Devices Mesh Graphic
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.deviceRow}>
              {/* Left Device */}
              <View style={styles.device}>
                <View style={styles.antennaLeft} />
                <View style={styles.deviceScreen} />
                <View style={styles.speakerGrill}>
                  <View style={styles.speakerLine} />
                  <View style={styles.speakerLine} />
                </View>
              </View>

              {/* Connecting Signal Beam */}
              <View style={styles.signalBeam}>
                <View style={styles.beamLine} />
                <View style={styles.signalDot} />
                <View style={[styles.signalDot, styles.signalDotCenter]} />
                <View style={styles.signalDot} />
              </View>

              {/* Right Device */}
              <View style={styles.device}>
                <View style={styles.antennaRight} />
                <View style={styles.deviceScreen} />
                <View style={styles.speakerGrill}>
                  <View style={styles.speakerLine} />
                  <View style={styles.speakerLine} />
                </View>
              </View>
            </View>
          </View>
        );

      case 1:
        // Step 2: Radial SOS Mesh Graphic
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.sosMeshBox}>
              {/* Surrounding satellite nodes */}
              <View style={[styles.satelliteNode, styles.nodeTop]} />
              <View style={[styles.satelliteNode, styles.nodeBottom]} />
              <View style={[styles.satelliteNode, styles.nodeLeft]} />
              <View style={[styles.satelliteNode, styles.nodeRight]} />

              {/* Connecting ray lines */}
              <View style={styles.verticalRay} />
              <View style={styles.horizontalRay} />

              {/* Central Glowing SOS Beacon */}
              <View style={styles.sosHalo}>
                <View style={styles.sosCenterCircle}>
                  <Text style={styles.sosText}>SOS</Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 2:
        // Step 3: 4 Resource Nodes Matrix Graphic
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.resourceGridBox}>
              {/* Center connecting cross lines */}
              <View style={styles.gridCrossH} />
              <View style={styles.gridCrossV} />
              <View style={styles.centerHubDot} />

              {/* 4 Category Resource Nodes */}
              <View style={[styles.resourceDot, styles.resGreen]}>
                <Text style={styles.resEmoji}>💧</Text>
              </View>
              <View style={[styles.resourceDot, styles.resBlue]}>
                <Text style={styles.resEmoji}>🏥</Text>
              </View>
              <View style={[styles.resourceDot, styles.resRed]}>
                <Text style={styles.resEmoji}>⛺</Text>
              </View>
              <View style={[styles.resourceDot, styles.resYellow]}>
                <Text style={styles.resEmoji}>🍞</Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Top Graphic Card */}
        {renderIllustration()}

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{active.title}</Text>
          <Text style={styles.description}>{active.desc}</Text>
        </View>

        {/* Carousel Dots Indicator */}
        <View style={styles.dotsRow}>
          {steps.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                currentStep === idx ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Bottom Button & Skip Action */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>{active.buttonText}</Text>
        </TouchableOpacity>

        {active.showSkip ? (
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={onComplete}
            activeOpacity={0.7}
          >
            <Text style={styles.skipBtnText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.skipPlaceholder} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#EBF6F0',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D4ECE0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },

  // Step 1 Device Illustration Styles
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  device: {
    width: 52,
    height: 94,
    backgroundColor: '#1B7340',
    borderRadius: 14,
    padding: 6,
    alignItems: 'center',
    shadowColor: '#1B7340',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  antennaLeft: {
    position: 'absolute',
    top: -12,
    left: 8,
    width: 6,
    height: 14,
    backgroundColor: '#155E38',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  antennaRight: {
    position: 'absolute',
    top: -12,
    right: 8,
    width: 6,
    height: 14,
    backgroundColor: '#155E38',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  deviceScreen: {
    width: '100%',
    height: 44,
    backgroundColor: '#E8F5EC',
    borderRadius: 8,
    marginTop: 4,
  },
  speakerGrill: {
    marginTop: 10,
    gap: 3,
    alignItems: 'center',
  },
  speakerLine: {
    width: 18,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 1,
  },
  signalBeam: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 8,
  },
  beamLine: {
    position: 'absolute',
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: '#A3D9B9',
  },
  signalDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1B7340',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  signalDotCenter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
  },

  // Step 2 SOS Mesh Illustration Styles
  sosMeshBox: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosHalo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosCenterCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  satelliteNode: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1B7340',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 2,
  },
  nodeTop: { top: 0 },
  nodeBottom: { bottom: 0 },
  nodeLeft: { left: 0 },
  nodeRight: { right: 0 },
  verticalRay: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: '#A3D9B9',
  },
  horizontalRay: {
    position: 'absolute',
    height: 2,
    width: '100%',
    backgroundColor: '#A3D9B9',
  },

  // Step 3 Resource Grid Illustration Styles
  resourceGridBox: {
    width: 170,
    height: 170,
    position: 'relative',
    justifyContent: 'space-between',
    padding: 10,
  },
  gridCrossH: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#C6E7D2',
  },
  gridCrossV: {
    position: 'absolute',
    left: '50%',
    top: 20,
    bottom: 20,
    width: 2,
    backgroundColor: '#C6E7D2',
  },
  centerHubDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1B7340',
    marginLeft: -6,
    marginTop: -6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  resourceDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  resEmoji: {
    fontSize: 20,
  },
  resGreen: {
    backgroundColor: '#D1FAE5',
    alignSelf: 'flex-start',
  },
  resBlue: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#DBEAFE',
  },
  resRed: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    backgroundColor: '#FEE2E2',
  },
  resYellow: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#FEF3C7',
  },

  // Text Section
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Carousel Dots
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#1B7340',
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#D1D5DB',
  },

  // Footer Buttons
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    alignItems: 'center',
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#1B7340',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1B7340',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  skipBtn: {
    marginTop: 14,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  skipBtnText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  skipPlaceholder: {
    height: 38,
  },
});
