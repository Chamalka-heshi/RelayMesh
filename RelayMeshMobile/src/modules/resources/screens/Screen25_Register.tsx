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
  onRegisterSuccess?: () => void;
  onNavigateLogin?: () => void;
}

export const Screen25_Register: React.FC<Props> = ({
  onRegisterSuccess,
  onNavigateLogin,
}) => {
  const [name, setName] = useState('Sajura Niman');
  const [email, setEmail] = useState('sajura@relaymesh.local');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<'citizen' | 'volunteer'>('citizen');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.brandHeader}>
        <Text style={Typography.h1}>Create Your Account</Text>
        <Text style={[Typography.body, { marginTop: 4 }]}>
          Join the decentralized disaster response mesh.
        </Text>
      </View>

      <View style={styles.roleSelector}>
        <TouchableOpacity
          style={[styles.roleBtn, role === 'citizen' && styles.roleBtnActive]}
          onPress={() => setRole('citizen')}
        >
          <Text style={[styles.roleText, role === 'citizen' && styles.roleTextActive]}>
            👤 Citizen
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleBtn, role === 'volunteer' && styles.roleBtnActive]}
          onPress={() => setRole('volunteer')}
        >
          <Text style={[styles.roleText, role === 'volunteer' && styles.roleTextActive]}>
            🚤 Volunteer Rescuer
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={Typography.bodyBold}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter full name"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={[Typography.bodyBold, { marginTop: 10 }]}>Email / Phone</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email or phone"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={[Typography.bodyBold, { marginTop: 10 }]}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          placeholderTextColor={Colors.textMuted}
          secureTextEntry
        />
      </View>

      <Button
        title="SIGN UP & INITIALIZE MESH ID"
        variant="primary"
        onPress={onRegisterSuccess || (() => {})}
        style={{ height: 50, borderRadius: 14 }}
      />

      <View style={styles.footerRow}>
        <Text style={Typography.body}>Already have an account? </Text>
        <TouchableOpacity onPress={onNavigateLogin}>
          <Text style={[Typography.bodyBold, { color: Colors.primary }]}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  brandHeader: { marginVertical: 14 },
  roleSelector: { flexDirection: 'row', gap: 10, marginVertical: 10 },
  roleBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  roleBtnActive: { backgroundColor: Colors.accentGreen, borderColor: Colors.primary },
  roleText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  roleTextActive: { color: Colors.primary, fontWeight: '700' },
  formGroup: { marginVertical: 10 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginTop: 4, fontSize: 14, color: Colors.textPrimary },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
});
