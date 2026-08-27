import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface HeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, badge }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, Typography.h1]}>{title}</Text>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      {subtitle && <Text style={[styles.subtitle, Typography.body]}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.textPrimary,
  },
  subtitle: {
    color: Colors.textSecondary,
    marginTop: 4,
  },
  badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: Colors.primaryLight,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: Colors.primaryLight,
    fontSize: 12,
    fontWeight: '600',
  },
});
