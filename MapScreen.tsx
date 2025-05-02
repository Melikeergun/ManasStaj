import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const MapScreen = ({ route }) => {
  const { meter_id } = route.params;
  const [meterData, setMeterData] = useState([]);
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [region, setRegion] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchMeterData = async () => {
      try {
        const response = await axios.get(
          `API${meter_id}`
        );
        console.log('API Response:', response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setMeterData(response.data);

          const firstMeter = response.data[0];
          console.log('First Meter:', firstMeter);
          if (firstMeter.latitude && firstMeter.longitude) {
            const initialRegionData = {
              latitude: parseFloat(firstMeter.latitude),
              longitude: parseFloat(firstMeter.longitude),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
            setInitialRegion(initialRegionData);
            setRegion(initialRegionData);
          } else {
            setError('Koordinat verileri eksik.');
          }
        } else {
          setError('Sayaca ait veri bulunamadı.');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Veri alınırken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeterData();
  }, [meter_id]);
// Haritayı yakınlaştırma
  const handleZoomIn = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };
  // Haritayı uzaklaştırma
  const handleZoomOut = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }
  if (!initialRegion) {
    return (
      <View style={styles.noDataContainer}>
        <Text>Harita yükleniyor...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region} // Haritanın güncellenmesi için region state'i kullanılıyor
        onRegionChangeComplete={(region) => console.log('Region changed', region)}
        onMapError={(error) => console.error('Map Error:', error)}
      >
        {meterData.map((meter) => (
          <Marker
            key={meter.id}
            coordinate={{
              latitude: parseFloat(meter.latitude),
              longitude: parseFloat(meter.longitude),
            }}
            title={meter.customer_label}
            description={`Seri Numarası: ${meter.serial_nr}`}
            onPress={() => setSelectedMeter(meter)}
          />
        ))}
      </MapView>

      {/* Zoom In Button */}
      <TouchableOpacity style={styles.zoomInButton} onPress={handleZoomIn}>
        <Text style={styles.zoomText}>+</Text>
      </TouchableOpacity>

      {/* Zoom Out Button */}
      <TouchableOpacity style={styles.zoomOutButton} onPress={handleZoomOut}>
        <Text style={styles.zoomText}>-</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('./assets/back_icon.png')} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
        <Image source={require('./assets/home.png')} style={styles.icon} />
      </TouchableOpacity>

      {selectedMeter && (
        <ScrollView style={styles.detailsContainer}>
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>ID:</Text>
            <Text style={styles.detailValue}>{selectedMeter.id}</Text>
            <Text style={styles.detailTitle}>Serial Number:</Text>
            <Text style={styles.detailValue}>{selectedMeter.serial_nr}</Text>
            <Text style={styles.detailTitle}>Communication Address:</Text>
            <Text style={styles.detailValue}>{selectedMeter.communication_address}</Text>
            <Text style={styles.detailTitle}>Meter Type ID:</Text>
            <Text style={styles.detailValue}>{selectedMeter.meter_type_id}</Text>
            <Text style={styles.detailTitle}>Site ID:</Text>
            <Text style={styles.detailValue}>{selectedMeter.site_id}</Text>
            <Text style={styles.detailTitle}>Latitude:</Text>
            <Text style={styles.detailValue}>{selectedMeter.latitude}</Text>
            <Text style={styles.detailTitle}>Longitude:</Text>
            <Text style={styles.detailValue}>{selectedMeter.longitude}</Text>
            <Text style={styles.detailTitle}>Meter Profile ID:</Text>
            <Text style={styles.detailValue}>{selectedMeter.meter_profile_id}</Text>
            <Text style={styles.detailTitle}>Comm Unit ID:</Text>
            <Text style={styles.detailValue}>{selectedMeter.comm_unit_id}</Text>
            <Text style={styles.detailTitle}>Customer Label:</Text>
            <Text style={styles.detailValue}>{selectedMeter.customer_label}</Text>
            <Text style={styles.detailTitle}>Route ID:</Text>
            <Text style={styles.detailValue}>{selectedMeter.route_id}</Text>
            <Text style={styles.detailTitle}>Firmware Number:</Text>
            <Text style={styles.detailValue}>{selectedMeter.firmware_nr}</Text>
            <Text style={styles.detailTitle}>Meter Timezone:</Text>
            <Text style={styles.detailValue}>{selectedMeter.meter_timezone}</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 3,
    zIndex: 10,
  },
  homeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 3,
    zIndex: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  zoomInButton: {
    position: 'absolute',
    bottom: 100,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
    zIndex: 10,
  },
  zoomOutButton: {
    position: 'absolute',
    bottom: 50,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
    zIndex: 10,
  },
  zoomText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    maxHeight: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 10,
  },
  detailCard: {
    paddingVertical: 10,
  },
  detailTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default MapScreen;
