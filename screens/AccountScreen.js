import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../components/TopBar';

export default function AccountScreen({ user, onUpdateProfile, settings = {}, onUpdateSettings, onLogout, onBack }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [studentID, setStudentID] = useState(user?.studentID || '');
  const [compactLayout, setCompactLayout] = useState(Boolean(settings.compactLayout));
  const [notify, setNotify] = useState(Boolean(settings.notify));
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
  const [bgColor, setBgColor] = useState(settings.backgroundColor || 'white');

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setStudentID(user?.studentID || '');
    setProfilePhoto(user?.profilePhoto || '');
    setBgColor(settings.backgroundColor || 'white');
  }, [user]);

  const saveProfile = () => {
    if (!name || !email) return Alert.alert('Validation', 'Name and email are required');
    const next = { ...user, name: name.trim(), email: email.trim(), studentID: user?.role === 'student' ? (studentID.trim() || undefined) : undefined, profilePhoto };
    if (onUpdateProfile) onUpdateProfile(next);
    Alert.alert('Saved', 'Profile updated');
  };

  const saveSettings = () => {
    const next = { compactLayout: !!compactLayout, notify: !!notify, backgroundColor: bgColor };
    if (onUpdateSettings) onUpdateSettings(next);
    Alert.alert('Saved', 'Settings updated');
  };

  const tryPickImage = async () => {
    // Attempt to use expo-image-picker if available. If not, provide a fallback to paste a URL.
    let ImagePicker = null;
    try {
      // dynamic require to avoid crash when module not installed
      // eslint-disable-next-line global-require
      ImagePicker = require('expo-image-picker');
    } catch (e) {
      ImagePicker = null;
    }

    if (!ImagePicker) {
      return Alert.alert('Image picker unavailable', 'Paste an image URL into the field below instead.');
    }

    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return Alert.alert('Permission denied', 'Permission to access media library is required.');
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
      if (!result.cancelled) {
        setProfilePhoto(result.uri);
      }
    } catch (e) {
      console.log('Image pick failed', e);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // URL paste removed per request; only upload picker and remove remain

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }} edges={['top']}>
      <TopBar title="Account" showBack={true} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.section, { alignItems: 'center', marginTop: 14 }] }>
        {profilePhoto ? (
          <Image source={{ uri: profilePhoto }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: '#e2e8f0' }]}>
            <Text style={{ color: '#2d3748', fontWeight: '700' }}>{(user?.name || '').split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.nameText}>{user?.name || ''}</Text>
        <TouchableOpacity style={[styles.saveBtn, { marginTop: 10, paddingHorizontal: 18 }]} onPress={tryPickImage}><Text style={styles.saveText}>Upload / Choose Photo</Text></TouchableOpacity>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={[styles.saveBtn, { marginLeft: 6 }]} onPress={() => { setProfilePhoto(''); if (onUpdateProfile) onUpdateProfile({ ...user, profilePhoto: undefined }); }}><Text style={styles.saveText}>Remove</Text></TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />

        <Text style={styles.label}>Email</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />

        {user?.role === 'student' && (
          <>
            <Text style={styles.label}>Student ID</Text>
            <TextInput value={studentID} onChangeText={setStudentID} onBlur={() => {
              // Auto-save student ID when user leaves the field
              const next = { ...user, name: name.trim(), email: email.trim(), studentID: studentID.trim() || undefined, profilePhoto };
              if (onUpdateProfile) onUpdateProfile(next);
            }} style={styles.input} />
          </>
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}><Text style={styles.saveText}>Save Profile</Text></TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.row}><Text style={styles.settingLabel}>Compact layout</Text><Switch value={compactLayout} onValueChange={setCompactLayout} /></View>
        <View style={styles.row}><Text style={styles.settingLabel}>Enable notifications</Text><Switch value={notify} onValueChange={setNotify} /></View>

        <Text style={[styles.label, { marginTop: 10 }]}>App background color</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 }}>
          {[
            { name: 'White', color: '#FFFFFF' },
            { name: 'Red', color: '#FF0000' },
            { name: 'Orange', color: '#FF7F00' },
            { name: 'Yellow', color: '#FFFF00' },
            { name: 'Green', color: '#00FF00' },
            { name: 'Blue', color: '#0000FF' },
            { name: 'Indigo', color: '#4B0082' },
            { name: 'Violet', color: '#8B00FF' },
            { name: 'Tan', color: '#E6D7C4' },
          ].map((c) => (
            <TouchableOpacity key={c.name} onPress={() => setBgColor(c.color)} style={[styles.colorSwatch, { backgroundColor: c.color, borderWidth: bgColor === c.color ? 3 : 0, borderColor: '#2b6cb0' }]} />
          ))}
        </View>

        <TouchableOpacity style={[styles.saveBtn, { marginTop: 12 }]} onPress={saveSettings}><Text style={styles.saveText}>Save Settings</Text></TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'transparent', padding: 16, paddingBottom: 90 },
  section: { marginTop: 12, backgroundColor: 'transparent', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  label: { fontSize: 13, color: '#4a5568', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 10, backgroundColor: 'transparent', marginBottom: 12 },
  saveBtn: { backgroundColor: '#2b6cb0', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveText: { color: 'white', fontWeight: '700' },
  sectionTitle: { fontWeight: '700', marginBottom: 10, fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingLabel: { color: '#1a202c', fontWeight: '600' },
  logoutBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#fed7d7', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  logoutText: { color: '#c53030', fontWeight: '700' }
  ,
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 8 },
  avatarPlaceholder: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  colorSwatch: { width: 36, height: 36, borderRadius: 18 }
});
