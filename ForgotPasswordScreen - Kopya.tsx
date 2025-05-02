import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, SafeAreaView } from 'react-native';
import axios from 'axios';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://4com.manas.com.tr/login?ajax=true', {
        email,
      });

      if (response.status === 200) {
        Alert.alert('Başarı', 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!');
        navigation.navigate('ResetPassword', { token: response.data.token });
      } else {
        Alert.alert('Hata', 'Bir sorun oluştu, lütfen tekrar deneyin.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen e-posta adresinizi kontrol edin ve tekrar deneyin.');
    }
  };

  return (
    <ImageBackground
      source={require('./assets/sifre.jpg')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Şifre Unuttum</Text>
        <Text style={styles.subtitle}>E-posta adresinizi girin ve şifre sıfırlama bağlantısı gönderelim.</Text>
        <TextInput
          style={styles.input}
          placeholder="E-posta adresi"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Gönder</Text>
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
    fontSize: 36,
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
    borderColor: 'white',
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
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
