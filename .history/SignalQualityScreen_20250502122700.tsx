import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, ImageBackground, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import DateUtils3 from './classes/DateUtils3';

const SignalQualityScreen = ({ route, navigation }) => {
  const { meter_id, type } = route.params || {};

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    if (meter_id && (type === 'WATER' || type === 'GAS')) {
      fetchData();
    } else {
      console.error('Error: Missing meter_id or type is not supported');
      setLoading(false);
    }
  }, [meter_id, type]);

  const fetchData = () => {
    setLoading(true);
    const apiUrl = `API${meter_id}`;

    axios
      .get(apiUrl)
      .then((response) => {
        const labels = response.data.map((item) => DateUtils3.formatFullDate(item.meter_time));
        const values = response.data.map((item) => item.signal_quality);

        setData({ labels, values });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

 
  const getYAxisLabel = (type) => {
    switch (type) {
      case 'WATER':
        return 'Water Signal';
      case 'GAS':
        return 'Gas Signal';
      default:
        return '';
    }
  };

  const renderChart = () => {
    if (!data) return null;

    return (
      <LineChart
        data={{
          labels: data.labels,
          datasets: [
            {
              data: data.values,
            },
          ],
        }}
        width={Dimensions.get('window').width - 32}
        height={350}
        verticalLabelRotation={100}
        yAxisLabel={getYAxisLabel(type)}
        chartConfig={{
          backgroundColor: '#ffd9ca', 
          backgroundGradientFrom: '#c2cbd6',
          backgroundGradientTo: '#d7cdb7',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(20, 20, 20, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(20, 20, 20, ${opacity})`,
          style: {
            borderRadius: 5,
          },
          propsForDots: {
            r: '',
            strokeWidth: '4',
            stroke: '#8e827d', 
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

  const renderTable = () => {
    if (!data) return <Text style={styles.noDataText}>No data available for table</Text>;

    return (
      <ScrollView>
        <View style={styles.table}>
          {data.labels.map((label, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{label}</Text>
              <Text style={styles.tableCell}>{data.values[index]}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  if (!meter_id || !type || (type !== 'WATER' && type !== 'GAS')) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Eksik parametreler: meter_id tanımlanmamış veya geçersiz tip</Text>
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
        
        {data && (
          <View style={styles.chartContainer}>
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
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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

  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  chartStyle: {
    borderRadius: 16,
    marginHorizontal: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  tableButton: {
    backgroundColor: '#f4a261',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
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
    borderRadius: 1,
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
});

export default SignalQualityScreen;
