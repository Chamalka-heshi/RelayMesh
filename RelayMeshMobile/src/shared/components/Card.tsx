import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'accentGreen' | 'emergencyRed' | 'outline';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'accentGreen':
        return Colors.accentGreen;
      case 'emergencyRed':
        return Colors.sosRedLight;
      default:
        return Colors.surface;
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'accentGreen':
        return Colors.accentGreenBorder;
      case 'emergencyRed':
        return Colors.sosRedBorder;
      default:
        return Colors.borderLight;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
