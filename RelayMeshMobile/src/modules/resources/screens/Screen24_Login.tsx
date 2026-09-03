import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../shared';
import { useAuth } from '../../../context';

interface Props {
  onLoginSuccess?: () => void;
  onNavigateRegister?: () => void;
}

export const Screen24_Login: React.FC<Props> = ({
  onLoginSuccess,
  onNavigateRegister,
}) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Validation Error', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const result = await signIn(email.trim(), password);
    setLoading(false);

    if (result.error) {
      setErrorMessage(result.error);
      Alert.alert('Login Failed', result.error);
    } else {
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Figma Header with Brand */}
        <View style={styles.header}>
          <View style={styles.brandBadge}>
            <View style={styles.brandIconCircle}>
              <Text style={{ fontSize: 13, color: '#FFFFFF', fontWeight: '900' }}>▲</Text>
            </View>
            <Text style={styles.brandTitle}>RelayMesh</Text>
          </View>
          <Text style={styles.screenTitle}>Welcome Back!</Text>
          <Text style={styles.screenSubtitle}>Login to your mesh node</Text>
        </View>

        {/* Error Box */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        )}

        {/* Form Group */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(val) => {
                setEmail(val);
                setErrorMessage(null);
              }}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  setErrorMessage(null);
                }}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Login Button */}
        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.primaryBtnText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* Social SSO Buttons */}
        <View style={styles.ssoContainer}>
          <TouchableOpacity style={styles.ssoBtn} activeOpacity={0.7}>
            <Text style={styles.ssoIcon}>🌐</Text>
            <Text style={styles.ssoBtnText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ssoBtn} activeOpacity={0.7}>
            <Text style={styles.ssoIcon}></Text>
            <Text style={styles.ssoBtnText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Navigation */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onNavigateRegister}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 28,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  brandIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1B7340',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1B7340',
    letterSpacing: 0.5,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  eyeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  eyeText: {
    fontSize: 16,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1B7340',
  },
  primaryBtn: {
    height: 50,
    backgroundColor: '#1B7340',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1B7340',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '700',
  },
  ssoContainer: {
    gap: 10,
  },
  ssoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 10,
  },
  ssoIcon: {
    fontSize: 16,
  },
  ssoBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B7340',
  },
});
