import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const MainScreen = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' }}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Welcome to Iot smart home</Text>
      </LinearGradient>

      {/* Nội dung */}
      <View style={styles.content}>
        <Text style={styles.appTitle}>Fast, Fresh & Reliable</Text>
        <Text style={styles.appSubtitle}>
          Get clean water delivered to your doorstep in 30 minutes.
        </Text>

        {/* Buttons */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.85}>
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>Log In</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.85}>
          <View style={styles.signupButton}>
            <Text style={styles.signupText}>Sign Up</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fbff',
  },
  header: {
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    elevation: 8,
    shadowColor: '#4facfe',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 80,
    lineHeight: 22,
  },
  loginButton: {
    width: 250,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  loginText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  signupButton: {
    width: 250,
    height: 50,
    borderWidth: 1.5,
    borderColor: '#4facfe',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 17,
    color: '#4facfe',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default MainScreen;
