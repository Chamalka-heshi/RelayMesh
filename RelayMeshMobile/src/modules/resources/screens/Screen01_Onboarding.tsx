import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Colors, Typography } from '../../../shared';

interface Props {
  onComplete?: () => void;
}

export const Screen01_Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      emoji: '📱 ⇄ 📱',
      title: 'Stay Connected When It Matters Most',
      desc: 'RelayMesh keeps emergency communication moving even when cellular networks and internet connections are completely unavailable.',
    },
    {
      emoji: '🚨 ⚡ 📢',
      title: 'Send Help With One Tap',
      desc: 'Broadcast your emergency status, injury tags, and GPS coordinates to nearby users and rescue teams via mesh relays.',
    },
    {
      emoji: '🗺️ ⛺ 💧',
      title: 'Navigate & Find Resources Offline',
      desc: 'Discover verified shelters, clean drinking water, medical camps, and food distribution points without internet access.',
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

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <View style={styles.topRow}>
        <Text style={styles.stepBadge}>Step {currentStep + 1} of 3</Text>
        {currentStep < 2 && (
          <TouchableOpacity onPress={onComplete}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Illustration Box */}
      <View style={styles.illustrationCard}>
        <Text style={styles.bigEmoji}>{active.emoji}</Text>
      </View>

      {/* Text Info */}
      <View style={styles.infoSection}>
        <Text style={[Typography.h1, styles.title]}>{active.title}</Text>
        <Text style={[Typography.body, styles.description]}>{active.desc}</Text>
      </View>

      {/* Dots Indicator */}
      <View style={styles.dotsRow}>
        {steps.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, currentStep === idx && styles.dotActive]}
          />
        ))}
      </View>

      {/* Bottom Button */}
      <Button
        title={currentStep === 2 ? 'GET STARTED NOW' : 'NEXT'}
        variant="primary"
        onPress={handleNext}
        style={styles.actionBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  stepBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: Colors.accentGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  illustrationCard: {
    height: 220,
    backgroundColor: Colors.accentGreen,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.accentGreenBorder,
    marginVertical: 20,
  },
  bigEmoji: {
    fontSize: 60,
  },
  infoSection: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: Colors.textPrimary,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  actionBtn: {
    height: 52,
    borderRadius: 14,
  },
});
