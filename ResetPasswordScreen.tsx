import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, SafeAreaView } from 'react-native';
import axios from 'axios';

const ResetPasswordScreen = ({ route }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = route.params || {};

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler uyuşmuyor!');
      return;
    }

    try {
      const response = await axios.post('http://4com.manas.com.tr/reset-password', {
        token,
        newPassword,
      });

      if (response.status === 200) {
        Alert.alert('Başarı', 'Şifre başarıyla sıfırlandı!');
      } else {
        Alert.alert('Hata', 'Şifre sıfırlama işlemi başarısız oldu.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <ImageBackground
      source={require('./assets/sifre.jpg')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Şifre Yeniden Oluştur</Text>
        <Text style={styles.subtitle}>Yeni şifrenizi oluşturun ve onaylayın.</Text>
        <TextInput
          style={styles.input}
          placeholder="Yeni şifre"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Şifreyi onaylayın"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Şifreyi Sıfırla</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(128, 128, 128, 0.6)',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'rgba(5, 75, 65, 0.6)',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'rgba(77, 149, 132, 0.7)',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#f4a261',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;
