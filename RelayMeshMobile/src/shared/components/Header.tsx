import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface HeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  variant?: 'green' | 'white';
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  badge,
  variant = 'white',
  onBackPress,
  rightAction,
}) => {
  const isGreen = variant === 'green';

  return (
    <View style={[styles.container, isGreen && styles.greenContainer]}>
      <View style={styles.topRow}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={[styles.backText, { color: isGreen ? '#FFFFFF' : Colors.textPrimary }]}>
              ←
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.titleWrapper}>
          <Text
            style={[
              Typography.h2,
              styles.title,
              { color: isGreen ? '#FFFFFF' : Colors.textPrimary },
            ]}
          >
            {title}
          </Text>
        </View>
        {badge && (
          <View style={[styles.badge, isGreen && styles.greenBadge]}>
            <Text style={[styles.badgeText, isGreen && styles.greenBadgeText]}>
              {badge}
            </Text>
          </View>
        )}
        {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
      </View>
      {subtitle && (
        <Text
          style={[
            Typography.caption,
            styles.subtitle,
            { color: isGreen ? '#E8F5EC' : Colors.textSecondary },
          ]}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  greenContainer: {
    backgroundColor: Colors.primary,
    borderBottomColor: Colors.primaryDark,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backText: {
    fontSize: 22,
    fontWeight: '700',
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.accentGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.accentGreenBorder,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  greenBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  greenBadgeText: {
    color: '#FFFFFF',
  },
  rightAction: {
    marginLeft: 8,
  },
});
