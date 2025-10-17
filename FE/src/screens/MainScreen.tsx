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
      {/* Header với gradient */}
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
        <Text style={styles.headerTitle}>Main Screen</Text>
      </LinearGradient>

      {/* Nội dung */}
      <View style={styles.content}>
        <Text style={styles.appTitle}>Water Delivery App</Text>
        <Text style={styles.appSubtitle}>
          We deliver water anywhere on Earth in just 30 minutes 
        </Text>

        {/* Nút Login với gradient */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.8}>
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>Log in</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Nút Signup bo viền */}
        <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.8}>
          <View style={styles.signupButton}>
            <Text style={styles.signupText}>Sign up</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF6FF',
  },
  header: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 4,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  appSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 50,
  },
  loginButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 15,
    elevation: 3,
  },
  loginText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  signupButton: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#4facfe',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    color: '#4facfe',
    fontWeight: '600',
  },
});

export default MainScreen;
