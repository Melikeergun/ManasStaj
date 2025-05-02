import React, { useState, useRef } from 'react';
import { TouchableOpacity, SafeAreaView, TextInput, View, Text, StyleSheet,
 ImageBackground, Image, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const LogIn = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

 
  const passwordInputRef = useRef();


  const handleLoginPress = async () => {
    console.log('User Name:', username);
    console.log('Password:', password);

    try {
      const response = await axios.post(
        'API',
        {
          username: username,
          password: password,
          lang: 'tr',
        },
      );
      const token = response.data;
      console.log('token', token);

      if (token.result === 'OK') {
        navigation.navigate('Home');
      } else {
        Alert.alert('Hata', 'Kullanıcı adı veya şifre hatalı.');
        console.log('Hataya düştü');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  
  const toggleSecurityEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./assets/giris.jpg')}
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.overlay}>
          <Image source={require('./assets/manas.png')} style={styles.logo} />

          {/* Username Input */}
          <TextInput
            style={styles.input}
            onChangeText={(text) => setUsername(text)}
            value={username}
            placeholder="Kullanıcı Adı"
            placeholderTextColor="white"
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current.focus()} 
            blurOnSubmit={false} 
          />

          <View style={styles.passwordContainer}>
            {/* Password Input */}
            <TextInput
              style={styles.passwordInput}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={secureTextEntry}
              placeholder="Şifre"
              placeholderTextColor="white"
              ref={passwordInputRef} 
              returnKeyType="done"
              onSubmitEditing={handleLoginPress} 
            />
            <TouchableOpacity onPress={toggleSecurityEntry} style={styles.eyeIcon}>
              <Icon name={secureTextEntry ? 'eye' : 'eye-slash'} size={24} color="#f1804b" />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLoginPress}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            <Text style={styles.textStyle}>Şifremi Unuttum</Text>
          </TouchableOpacity>

        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '50%',
  },
  logo: {
    width: 300,
    height: 115,
    marginBottom: 50,
  },
  input: {
    height: 50,
    marginVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1.5,
    borderColor: '#056f6f',
    width: '70%',
    color: '#056f6f',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#056f6f',
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    color: '#056f6f',
  },
  eyeIcon: {
    marginLeft: 10,
   
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    height: 45,
    marginVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#c18c73',
    width: '70%',
  },
  buttonText: {
    color: '#d7bdb7',
    fontSize: 18,
  },
  forgotPassword: {
    marginTop: 20,
  },
  textStyle: {
    color: '#f18b68',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LogIn;
