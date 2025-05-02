import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator, FlatList, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const HomeScreen = () => {
  const [filter, setFilter] = useState('hepsi');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://4com.manas.com.tr/definitions/meter/fetch?mobile=true');
      const fetchedData = response.data;
      const groupedData = groupByType(fetchedData);
      setData(groupedData);
    } catch (error) {
      console.error('Veri alınamadı:', error);
      Alert.alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const groupByType = (data) => {
    if (!data) return {};
    return data.reduce((acc, item) => {
      const type = item.meter_type.type.toLowerCase();
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(item);
      return acc;
    }, {});
  };

  const applyFilter = (type) => {
    setFilter(type);
  };

  const navigateToDetails = (item, type) => {
    navigation.navigate('MoreDetailScreen', { item, type });
  };

  const renderFilteredContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#ffffff" />;
    }

    if (!data || (filter !== 'hepsi' && !data[filter])) {
      return <Text style={styles.noDataText}>Veri bulunamadı.</Text>;
    }

    const dataList = filter === 'hepsi' ? Object.values(data).flat() : data[filter];

    if (dataList.length === 0) {
      return <Text style={styles.noDataText}>Seçilen filtreye uygun veri bulunamadı.</Text>;
    }

    return (
      <FlatList
        data={dataList}
        keyExtractor={(item) => `${item.id}-${item.communication_address}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigateToDetails(item, item.meter_type.type)}
          >
            <View style={styles.itemContent}>
              <Image source={getMeterImage(item.meter_type.type)} style={styles.meterImage} />
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemText}>ID: {item.id}</Text>
                <Text style={styles.itemText}>Cihaz Kimliği: {item.communication_address}</Text>
                <Text style={styles.itemText}>Tipi: {item.meter_type.type}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };

  const getMeterImage = (type) => {
    switch (type.toLowerCase()) {
      case 'water':
        return require('./assets/susayac.png');
      case 'electricity':
        return require('./assets/elektiriksyac.png');
      case 'gas':
        return require('./assets/dogalgas.png');
      default:
        return require('./assets/manas.png');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('./assets/moree.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <View style={styles.filterContainer}>
            <TouchableOpacity style={[styles.filterButton, filter === 'hepsi' && styles.activeFilter]} onPress={() => applyFilter('hepsi')}>
              <Text style={styles.filterText}>Hepsi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, filter === 'water' && styles.activeFilter]} onPress={() => applyFilter('water')}>
              <Text style={styles.filterText}>Su</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, filter === 'electricity' && styles.activeFilter]} onPress={() => applyFilter('electricity')}>
              <Text style={styles.filterText}>Elektrik</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, filter === 'gas' && styles.activeFilter]} onPress={() => applyFilter('gas')}>
              <Text style={styles.filterText}>Doğalgaz</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dataContainer}>{renderFilteredContent()}</View>
          <View style={styles.footerContainer}>
            <Image source={require('./assets/manas.png')} style={styles.footerImage} />
          </View>
        </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    backgroundColor: '#3e8574',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilter: {
    backgroundColor: '#dda388',
  },
  filterText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  dataContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
  item: {
    backgroundColor: 'rgba(200, 200, 200, 0.35)',
    marginVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    padding: 15,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meterImage: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemText: {
    color: 'black',
    fontSize: 16,
    marginBottom: 4,
  },
  noDataText: {
    color: '#ddd',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  footerImage: {
    width: 300,
    height: 115,
  },
});

export default HomeScreen;
