import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Button, Colors, Typography } from '../../../shared';

interface Props {
  onLoginSuccess?: () => void;
  onNavigateRegister?: () => void;
}

export const Screen24_Login: React.FC<Props> = ({
  onLoginSuccess,
  onNavigateRegister,
}) => {
  const [email, setEmail] = useState('sajura.niman@relaymesh.local');
  const [password, setPassword] = useState('••••••••');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <View style={styles.logoBadge}>
          <Text style={{ fontSize: 24 }}>📡</Text>
        </View>
        <Text style={[Typography.h1, { marginTop: 12 }]}>Welcome Back!</Text>
        <Text style={[Typography.body, { textAlign: 'center', marginTop: 4 }]}>
          Stay connected when it matters most.
        </Text>
      </View>

      {/* Input Fields */}
      <View style={styles.formGroup}>
        <Text style={Typography.bodyBold}>Email or Emergency Phone</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email or phone..."
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={[Typography.bodyBold, { marginTop: 12 }]}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password..."
          placeholderTextColor={Colors.textMuted}
          secureTextEntry
        />

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={[Typography.caption, { color: Colors.primary, textAlign: 'right' }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Primary Login Button */}
      <Button
        title="LOGIN"
        variant="primary"
        onPress={onLoginSuccess || (() => {})}
        style={{ height: 50, borderRadius: 14 }}
      />

      {/* Social / SSO Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* Social SSO Buttons */}
      <View style={styles.ssoRow}>
        <TouchableOpacity style={styles.ssoBtn} activeOpacity={0.7}>
          <Text style={styles.ssoText}>🔴 Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ssoBtn} activeOpacity={0.7}>
          <Text style={styles.ssoText}> Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
      <View style={styles.footerRow}>
        <Text style={Typography.body}>Don't have an account? </Text>
        <TouchableOpacity onPress={onNavigateRegister}>
          <Text style={[Typography.bodyBold, { color: Colors.primary }]}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.privacyNote}>
        🔒 Your emergency communications are protected with end-to-end encryption.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  brandHeader: { alignItems: 'center', marginVertical: 20 },
  logoBadge: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.accentGreen, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.accentGreenBorder },
  formGroup: { marginVertical: 12 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginTop: 6, fontSize: 14, color: Colors.textPrimary },
  forgotBtn: { marginTop: 6 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { marginHorizontal: 10, color: Colors.textMuted, fontSize: 12, fontWeight: '700' },
  ssoRow: { gap: 10 },
  ssoBtn: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  ssoText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  privacyNote: { textAlign: 'center', color: Colors.textMuted, fontSize: 11, marginTop: 24, paddingHorizontal: 10 },
});
