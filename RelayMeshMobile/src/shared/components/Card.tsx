import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'surface' | 'elevated' | 'danger';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'surface',
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'elevated':
        return Colors.surfaceLight;
      case 'danger':
        return 'rgba(220, 38, 38, 0.15)';
      default:
        return Colors.surface;
    }
  };

  const getBorderColor = () => {
    if (variant === 'danger') return Colors.sosRed;
    return Colors.border;
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
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});
