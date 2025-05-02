import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

// API'den veri çeker
const fetchApiData = async (meter_id) => {
  try {
    if (!meter_id) {
      throw new Error('Hata: meter_id parametresi tanımsız.');
    }
    const response = await axios.get(
      `API${meter_id}`
    );
    return response.data;
  } catch (error) {
    console.error('Veri yüklenirken hata:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('Request:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    if (error.message === 'Network Error') {
      throw new Error(
        `Ağ hatası. İnternet bağlantınızı kontrol edin ve tekrar deneyin. (meter_id: ${meter_id})`
      );
    } else {
      throw new Error(
        `Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyiniz. (meter_id: ${meter_id})`
      );
    }
  }
};

const MoreDetailScreen = ({ route }) => {
  const { item, type } = route.params ?? {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [alarmModalVisible, setAlarmModalVisible] = useState(false);
  const [confirmExitModalVisible, setConfirmExitModalVisible] = useState(false);
  const [region, setRegion] = useState(null);
  const navigation = useNavigation();
  

  useEffect(() => {
    if (item && item.id && type) {
      const loadData = async () => {
        try {
          const fetchedData = await fetchApiData(String(item.id)); // API'den veri çekerim
          setData(fetchedData); // Veriyi state'e kaydederim
          if (fetchedData.latitude && fetchedData.longitude) {
            setRegion({
              latitude: fetchedData.latitude,
              longitude: fetchedData.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
        } catch (error) {
          console.error('Veri alınırken hata oluştu!', error);
          setError(error.message); // Hata mesajını state'e kaydederim
        } finally {
          setLoading(false); // Yükleniyor sonlanır
        }
      };

      loadData(); // Veri çekme işlemini başlatırım 
    } else {
      console.log('Hata: Gerekli parametreler eksik veya geçersiz.');
      setError('Hata: Gerekli parametreler eksik veya geçersiz.'); // Hata mesajını state'e kaydederim 
      setLoading(false); // Yükleniyor durumunu kapatır
    }
    return () => {
      setData(null); // Bileşeni temizlerim 
    };
  }, [item, type]); // item ve type değiştiğinde useEffect e gider uyarılır yani

  const getSignalQualityDescription = (signalQuality) => {
    if (signalQuality < 5) {
      return 'Kötü';
    } else if (signalQuality >= 5 && signalQuality <= 15) {
      return 'İyi';
    } else {
      return 'Çok İyi';
    }
  };

 
  const getBackgroundImage = () => {
    switch (type) {
      case 'WATER':
      case 'GAS':
      case 'ELECTRICITY':
        return require('./assets/moree.jpg');
      default:
        return require('./assets/moree.jpg');
    }
  };
  const renderDetails = () => {
    if (!data) {
      return null;
    }

    return (
      <ScrollView contentContainerStyle={styles.dataContainer}>
        <View style={styles.dataBox}>
          <Text style={styles.detail}>Sayaç Numarası: {data.meterId}</Text>
          {/*detaylar için */}
          {type !== 'ELECTRICITY' && (
            <Text style={styles.detail}>
              Sıcaklık: {data.batteryTempature} &#8451;
            </Text>
          )}
          <Text style={styles.detail}>Son Endeks: {data.lastIndex}</Text>
          <Text style={styles.detail}>
            Günlük Tüketim: {dailyTest(data)} m³
          </Text>
          {data.monthlylog &&
            data.monthlylog.map((log) => (
              <Text key={log.id} style={styles.detail}>
                Aylık Son Tüketim: {log.consumption} m³
              </Text>
            ))}
          <Text style={styles.detail}>
            Sinyal Kalitesi: {getSignalQualityDescription(data.signalQuality)}
          </Text>
          <Text style={styles.detail}>Okuma Tarihi: {data.readDate}</Text>
          <Text style={styles.detail}>
            Ortalama Tüketim: {data.averageConsumption} m³
          </Text>
        </View>
      </ScrollView>
    );
  };
  const navigateToMapScreen = () => {
    if (data && item.id && type) {
        navigation.navigate('MapScreen', { meter_id: item.id });
    } else {
        console.error('Hata: Gerekli parametreler eksik veya geçersiz.');
    }
};

  
  
  const dailyTest = (data) => {
    if (data.dailylog) {
      return data.dailylog.map((log) => log.consumption);
    } else if (data.dailyIndex) {
      return data.dailyIndex;
    } else {
      return '-';
    }
  };

  const warnings = (data) => {
    if (data && data.flags && data.flags.length > 0) {
      return data.flags.map((flag) => (
        <Text key={flag.id} style={styles.textModal}>
          {flag.decodedFlagType}: {flag.decodedName} /Tarih:{' '}
          {flag.activationDate}
        </Text>
      ));
    } else {
      return <Text style={styles.textModal}>Alarm Bulunamadı.</Text>;
    }
  };

  const navigateToConsumptionGraph = () => {
    if (item.id && type) {
      console.log('Navigating to ConsumptionGraphScreen with:', item.id, type);
      navigation.navigate('ConsumptionGraphScreen', {
        meter_id: item.id,
        type: type,
      });
    } else {
      console.error('Error: Missing item.id or type');
    }
  };

  const navigateToIndexGraph = () => {
    if (item.id && type) {
      console.log('Navigating to IndexGraphScreen with:', item.id, type);
      navigation.navigate('IndexGraphScreen', {
        meter_id: item.id,
        type: type,
      });
    } else {
      console.error('Error: Missing item.id or type');
    }
  };

  const navigateToSignalQuality = () => {
    if (item.id && type) {
      console.log('Navigating to SignalQualityScreen with:', item.id, type);
      navigation.navigate('SignalQualityScreen', {
        meter_id: item.id,
        type: type,
      });
    } else {
      console.error('Error: Missing item.id or type');
    }
  };

  const navigateToTemperatureData = () => {
    if (item.id && type) {
      console.log('Navigating to TemperatureDataScreen with:', item.id, type);
      navigation.navigate('TemperatureDataScreen', {
        meter_id: item.id,
        type: type,
      });
    } else {
      console.error('Error: Missing item.id or type');
    }
  };

  const navigateHome = () => {
    setConfirmExitModalVisible(true);
  };

  const confirmNavigateHome = () => {
    setConfirmExitModalVisible(false);
    navigation.navigate('LogIn');
  };

  return (
    <ImageBackground source={getBackgroundImage()} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() =>
                navigation.navigate('Home', {type: {meter_id: item.id}})}
>
            <Image
              source={require('./assets/home.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Image
            source={require('./assets/manas.png')}
            style={styles.titleImage}
          />
          <TouchableOpacity onPress={() => setConfirmExitModalVisible(true)}>
            <MaterialIcons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FFF" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.contentContainer}>
            {renderDetails()}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={navigateToConsumptionGraph}>
                <Text style={styles.buttonText}>Tüketim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={navigateToIndexGraph}>
                <Text style={styles.buttonText}>Endeks</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={navigateToSignalQuality}>
                <Text style={styles.buttonText}>Sinyal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={navigateToTemperatureData}>
                <Text style={styles.buttonText}>Sıcaklık</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity
                style={styles.bottomButton}
                onPress={() => setAlarmModalVisible(true)}>
                <FontAwesomeIcon name="bell" size={30} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
  style={styles.bottomButton}
  onPress={navigateToMapScreen}>
  <FontAwesomeIcon name="map" size={30} color="#FFF" />
</TouchableOpacity>
</View>
          </View>
        )}
      </View>

      

      {/* Alarm Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={alarmModalVisible}
        onRequestClose={() => setAlarmModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>{warnings(data)}</ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setAlarmModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirm Exit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmExitModalVisible}
        onRequestClose={() => setConfirmExitModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Anasayfaya dönmek istediğinizden emin misiniz?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={confirmNavigateHome}>
                <Text style={styles.modalButtonText}>Evet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setConfirmExitModalVisible(false)}>
                <Text style={styles.modalButtonText}>Hayır</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 40,
    paddingBottom: 10,
    width: '100%',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'black',
  },
  titleImage: {
    width: 300,
    height: 110,
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  dataBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
  },
  detail: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#3e8574',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    paddingBottom: 20,
  },
  bottomButton: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#f69262',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  modalCloseButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#f18b68',
    borderRadius: 10,
    padding: 10,
    width: '40%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  textModal: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  map: {
    width: '100%',
    height: 200,
  },
});

export default MoreDetailScreen;
