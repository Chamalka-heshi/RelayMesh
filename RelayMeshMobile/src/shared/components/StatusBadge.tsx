import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface StatusBadgeProps {
  status: 'connected' | 'offline' | 'syncing' | 'emergency' | 'warning' | 'resolved';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'connected':
      case 'resolved':
        return {
          bg: Colors.accentGreen,
          border: Colors.accentGreenBorder,
          text: Colors.primary,
          defaultLabel: 'Connected',
        };
      case 'emergency':
        return {
          bg: Colors.sosRedLight,
          border: Colors.sosRedBorder,
          text: Colors.sosRed,
          defaultLabel: 'SOS Active',
        };
      case 'warning':
      case 'syncing':
        return {
          bg: Colors.warningLight,
          border: '#FDE68A',
          text: '#B45309',
          defaultLabel: 'Syncing',
        };
      case 'offline':
      default:
        return {
          bg: '#F1F5F9',
          border: '#CBD5E1',
          text: '#64748B',
          defaultLabel: 'Offline',
        };
    }
  };

  const styleConfig = getBadgeStyle();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: styleConfig.bg,
          borderColor: styleConfig.border,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: styleConfig.text },
        ]}
      />
      <Text style={[styles.text, { color: styleConfig.text }]}>
        {label || styleConfig.defaultLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
