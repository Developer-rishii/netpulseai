import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, Switch, Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { authAPI } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
}

export default function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['token', 'user']);
            router.replace('/login');
          }
        },
      ]
    );
  };

  const openEditModal = () => {
    setEditName(user?.name || '');
    setEditCompany(user?.company || '');
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editName) {
      Alert.alert('Validation Error', 'Name is required.');
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await authAPI.updateProfile({ name: editName, company: editCompany });
      const updatedUser = res.data.user;
      
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (err: any) {
      Alert.alert('Update Failed', err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const openPasswordModal = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setIsPasswordModalVisible(true);
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Validation Error', 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Validation Error', 'New passwords do not match.');
      return;
    }

    setIsPasswordSaving(true);
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      setIsPasswordModalVisible(false);
      Alert.alert('Success', 'Password updated successfully.');
    } catch (err: any) {
      Alert.alert('Update Failed', err.response?.data?.message || 'Failed to update password.');
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const SettingItem = ({ icon, label, value, type = 'chevron', color = Colors.muted, onPress }: any) => (
    <TouchableOpacity 
      style={s.item} 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={type === 'switch'}
    >
      <View style={[s.iconWrap, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={s.itemLabel}>{label}</Text>
      
      {type === 'chevron' && (
        <Ionicons name="chevron-forward" size={18} color={Colors.muted} />
      )}
      {type === 'switch' && (
        <Switch 
          value={value} 
          onValueChange={onPress}
          trackColor={{ false: Colors.surface, true: Colors.cyan + '60' }}
          thumbColor={value ? Colors.cyan : Colors.muted}
        />
      )}
      {type === 'text' && (
        <Text style={s.itemValue}>{value}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={s.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={s.header}>
            <View style={s.profileHeader}>
              <LinearGradient
                colors={['#00e5ff', '#9c5cff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.avatar}
              >
                <Text style={s.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </LinearGradient>
              <View style={s.profileInfo}>
                <Text style={s.userName}>{user?.name || 'Operator'}</Text>
                <Text style={s.userEmail}>{user?.email || 'network.ops@netpulse.ai'}</Text>
                <View style={s.badge}>
                  <Text style={s.badgeText}>{user?.company?.toUpperCase() || 'EXTERNAL NODE'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Account Section */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>ACCOUNT SECURITY</Text>
            <BlurView intensity={10} tint="dark" style={s.sectionContent}>
              <SettingItem 
                icon="person-outline" 
                label="Edit Profile" 
                color={Colors.cyan}
                onPress={openEditModal}
              />
              <View style={s.sep} />
              <SettingItem 
                icon="shield-checkmark-outline" 
                label="Biometric Login" 
                type="switch"
                value={biometrics}
                onPress={() => setBiometrics(!biometrics)}
                color={Colors.neon}
              />
              <View style={s.sep} />
              <SettingItem 
                icon="key-outline" 
                label="Change Password" 
                color={Colors.violet}
                onPress={openPasswordModal}
              />
            </BlurView>
          </View>

          {/* Preferences Section */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>PREFERENCES</Text>
            <BlurView intensity={10} tint="dark" style={s.sectionContent}>
              <SettingItem 
                icon="notifications-outline" 
                label="Push Notifications" 
                type="switch"
                value={notifications}
                onPress={() => setNotifications(!notifications)}
                color={Colors.warning}
              />
              <View style={s.sep} />
              <SettingItem 
                icon="options-outline" 
                label="Network Thresholds" 
                color={Colors.cyan}
              />
              <View style={s.sep} />
              <SettingItem 
                icon="flask-outline" 
                label="Beta Features" 
                type="text"
                value="Active"
                color={Colors.neon}
              />
            </BlurView>
          </View>

          {/* App Info Section */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>SYSTEM INFO</Text>
            <BlurView intensity={10} tint="dark" style={s.sectionContent}>
              <SettingItem 
                icon="information-circle-outline" 
                label="App Version" 
                type="text"
                value="1.0.4-rc1"
              />
              <View style={s.sep} />
              <SettingItem 
                icon="document-text-outline" 
                label="Terms of Service" 
              />
            </BlurView>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={20} color={Colors.critical} />
            <Text style={s.logoutText}>LOGOUT</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={s.modalOverlay}
        >
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.muted} />
              </TouchableOpacity>
            </View>

            <View style={s.modalBody}>
              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>FULL NAME</Text>
                <TextInput
                  style={s.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your name"
                  placeholderTextColor={Colors.muted}
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>COMPANY (OPTIONAL)</Text>
                <TextInput
                  style={s.input}
                  value={editCompany}
                  onChangeText={setEditCompany}
                  placeholder="Enter your company"
                  placeholderTextColor={Colors.muted}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[s.saveBtn, isSaving && { opacity: 0.7 }]} 
              onPress={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color={Colors.background} size="small" />
              ) : (
                <Text style={s.saveBtnText}>SAVE CHANGES</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={isPasswordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={s.modalOverlay}
        >
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setIsPasswordModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.muted} />
              </TouchableOpacity>
            </View>

            <View style={s.modalBody}>
              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>CURRENT PASSWORD</Text>
                <TextInput
                  style={s.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor={Colors.muted}
                  secureTextEntry={!showPassword}
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>NEW PASSWORD</Text>
                <TextInput
                  style={s.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor={Colors.muted}
                  secureTextEntry={!showPassword}
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>CONFIRM NEW PASSWORD</Text>
                <TextInput
                  style={s.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter new password"
                  placeholderTextColor={Colors.muted}
                  secureTextEntry={!showPassword}
                />
              </View>
              
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ alignSelf: 'flex-start', marginTop: -4 }}>
                <Text style={{ color: Colors.cyan, fontSize: 12, fontFamily: 'SpaceMono' }}>
                  {showPassword ? 'HIDE PASSWORDS' : 'SHOW PASSWORDS'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[s.saveBtn, isPasswordSaving && { opacity: 0.7 }]} 
              onPress={handleSavePassword}
              disabled={isPasswordSaving}
            >
              {isPasswordSaving ? (
                <ActivityIndicator color={Colors.background} size="small" />
              ) : (
                <Text style={s.saveBtnText}>UPDATE PASSWORD</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xxxl,
    marginTop: Spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.foreground,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.muted,
  },
  badge: {
    backgroundColor: Colors.cyanDim,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.borderCyan,
  },
  badgeText: {
    fontFamily: 'SpaceMono',
    fontSize: 9,
    fontWeight: '700',
    color: Colors.cyan,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.muted,
    marginBottom: Spacing.md,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: Colors.surface + '40',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  itemLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.foreground,
    fontWeight: '500',
  },
  itemValue: {
    fontSize: 13,
    color: Colors.muted,
    fontFamily: 'SpaceMono',
  },
  sep: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: Spacing.lg,
    backgroundColor: Colors.criticalDim,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.critical + '30',
    marginTop: Spacing.md,
  },
  logoutText: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    fontWeight: '700',
    color: Colors.critical,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.cardElevated,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.foreground,
  },
  modalBody: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.muted,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.foreground,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: Colors.cyan,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  saveBtnText: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    fontWeight: '700',
    color: Colors.background,
    letterSpacing: 2,
  },
});
