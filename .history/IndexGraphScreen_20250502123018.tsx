import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, Image, Modal, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import DateUtils2 from './classes/DateUtils2';

const IndexGraphScreen = ({ route, navigation }) => {
  const { meter_id, type } = route.params || {};

  const [data, setData] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('hourly');
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    if (meter_id && type) {
      fetchData(filter);
    } else {
      console.error('Error: Missing meter_id or type');
    }
  }, [filter]);

  const fetchData = async (filter) => {
    setLoading(true);
    let apiUrl = '';

    switch (type) {
      case 'WATER':
      case 'GAS':
        switch (filter) {
          case 'hourly':
            apiUrl = `API${meter_id}`;
            break;
          case 'daily':
            apiUrl = `API${meter_id}`;
            break;
          case 'monthly':
            apiUrl = `API${meter_id}`;
            break;
          case 'qValue':
            apiUrl = `API${meter_id}`;
            break;
          default:
            apiUrl = '';
        }
        break;
      case 'ELECTRICITY':
        switch (filter) {
          case 'hourly':
            apiUrl = `API${meter_id}`;
            break;
          case 'daily':
            apiUrl = `API${meter_id}`;
            break;
          case 'monthly':
            apiUrl = 'API${meter_id}`;
            break;
          default:
            apiUrl = '';
        }
        break;
      default:
        apiUrl = '';
    }

    if (apiUrl) {
      try {
        const response = await axios.get(apiUrl);

        if (Array.isArray(response.data)) {
          const labels = response.data.map((item) => {
            switch (filter) {
              case 'hourly':
                return DateUtils2.formatHour(item.meter_time);
              case 'daily':
                return DateUtils2.formatFullDate(item.meter_time);
              case 'monthly':
                return DateUtils2.formatMonth(item.meter_time);
              default:
                return '';
            }
          });

          const values = response.data.map((item) => item.current_index);

          setData({ labels, values });
        } else {
          setData({ labels: [], values: [] });
        }
      } catch (error) {
        console.error('Axios request failed:', error);
        setData({ labels: [], values: [] });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const renderChart = () => {
    const { labels, values } = data;

    if (!labels || !values || labels.length === 0 || values.length === 0) {
      return <Text style={styles.noDataText}>No valid data available</Text>;
    }

    return (
      <LineChart
        data={{
          labels: labels.filter((_, index) => index % 2 === 0),
          datasets: [
            {
              data: values,
            },
          ],
        }}
        width={Dimensions.get('window').width - 32}
        height={320}
        verticalLabelRotation={90}
        yAxisLabel={getYAxisLabel(type)}
        chartConfig={{
          backgroundColor: '#ffd9ca', // Beige tone
          backgroundGradientFrom: '#c2cbd6',
          backgroundGradientTo: '#d7cdb7',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(20, 20, 20, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(20, 20, 20, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '2',
            strokeWidth: '4',
            stroke: '#8e827d', // Black color here, change to your desired color
            strokeLinecap: 'round',
          },
          propsForLabels: {
            fontSize: 12,
            color: '#f97454',
          },
        }}
        bezier
        style={styles.chartStyle}
      />
    );
  };

  const getYAxisLabel = (type) => {
    switch (type) {
      case 'WATER':
      case 'GAS':
        return 'M3';
      case 'ELECTRICITY':
        return 'kWh';
      default:
        return '';
    }
  };

  const renderTable = () => {
    const { labels, values } = data;

    if (!labels || !values || labels.length === 0 || values.length === 0) {
      return <Text style={styles.noDataText}>No data available for table</Text>;
    }

    return (
      <ScrollView>
        <View style={styles.table}>
          {labels.map((label, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{label}</Text>
              <Text style={styles.tableCell}>{values[index]}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  if (!meter_id || !type) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Eksik parametreler: meter_id veya type tanımlanmamış</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ImageBackground source={require('./assets/moree.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('./assets/back-icon.png')} style={styles.icon} />
          </TouchableOpacity>
          <Image source={require('./assets/manas.png')} style={styles.logo} />
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={require('./assets/home.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.filterContainer}>
          <TouchableOpacity onPress={() => setFilter('hourly')} style={[styles.filterButton, filter === 'hourly' && styles.activeFilter]}>
            <Text style={styles.filterText}>Saatlik</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('daily')} style={[styles.filterButton, filter === 'daily' && styles.activeFilter]}>
            <Text style={styles.filterText}>Günlük</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('monthly')} style={[styles.filterButton, filter === 'monthly' && styles.activeFilter]}>
            <Text style={styles.filterText}>Aylık</Text>
          </TouchableOpacity>
        </View>
        {renderChart()}
        <TouchableOpacity style={styles.tableButton} onPress={() => setShowTable(true)}>
          <Text style={styles.tableButtonText}>Show Table</Text>
        </TouchableOpacity>
        <Modal
          visible={showTable}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTable(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {renderTable()}
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowTable(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 70,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'black',

  },
  logo: {
    width: 300,
    height: 110,
    resizeMode: 'contain',
  
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterButton: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f4a261',
  },
  activeFilter: {
    backgroundColor: '#e76f51',
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
  },
  chartStyle: {
    borderRadius: 16,
    marginBottom: 10,
  },
  tableButton: {
    marginTop: 16,
    backgroundColor: '#f4a261',
    padding: 10,
    borderRadius: 5,
    marginBottom: 40,
  },
  tableButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#f4a261',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#333',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default IndexGraphScreen;
