import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Modal,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import DateUtils from './classes/DateUtils';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ConsumptionGraphScreen = ({ route }) => {
  const { meter_id, type } = route.params || {};
  const [data, setData] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('hourly');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (meter_id && type) {
      fetchData(filter);
    } else {
      console.error('Error: Missing meter_id or type');
    }
  }, [filter]);

  const fetchData = async (filter) => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl(type, filter);

      if (!apiUrl) {
        throw new Error('Invalid API URL');
      }

      const response = await axios.get(apiUrl);

      if (filter === 'qValue') {
        handleQValueResponse(response.data);
      } else {
        handleConsumptionResponse(response.data);
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Failed to fetch data');
      setData({ labels: [], values: [] });
    } finally {
      setLoading(false);
    }
  };

  const getApiUrl = (type, filter) => {
    let apiUrl = '';

    switch (type) {
      case 'WATER':
      case 'GAS':
        apiUrl = getWaterGasApiUrl(filter);
        break;
      case 'ELECTRICITY':
        apiUrl = getElectricityApiUrl(filter);
        break;
      default:
        apiUrl = '';
    }

    return apiUrl;
  };

  const getWaterGasApiUrl = (filter) => {
    switch (filter) {
      case 'hourly':
        return `http://4com.manas.com.tr/analyze/water_gas_hourly_consumption/fetch?meter_id=${meter_id}&orderby={"meter_time":"asc"}&mobile=true`;
      case 'daily':
        return `http://4com.manas.com.tr/analyze/water_gas_daily_consumption/fetch?meter_id=${meter_id}&orderby={"meter_time":"asc"}&mobile=true`;
      case 'monthly':
        return `http://4com.manas.com.tr/analyze/water_gas_monthly_consumption/fetch?meter_id=${meter_id}&orderby={"meter_time":"asc"}&mobile=true`;
      case 'qValue':
        return `http://4com.manas.com.tr/history/meter_history_info/show/${meter_id}?last_history=1&render_method=json&mobile=true`;
      default:
        return '';
    }
  };

  const getElectricityApiUrl = (filter) => {
    switch (filter) {
      case 'hourly':
        return `http://4com.manas.com.tr/analyze/electricity_consumption/fetch?meter_id=${meter_id}&mobile=true`;
      case 'daily':
        return `http://4com.manas.com.tr/analyze/electricity_consumption/fetch?meter_id=${meter_id}&mobile=true&daily=true`;
      case 'monthly':
        return `http://4com.manas.com.tr/analyze/electricity_consumption/fetch?meter_id=${meter_id}&mobile=true&monthly=true`;
      default:
        return '';
    }
  };

  const handleQValueResponse = (data) => {
    const qValues = {
      q0Consumption: data.q0Consumption,
      q1Consumption: data.q1Consumption,
      q2Consumption: data.q2Consumption,
      q3Consumption: data.q3Consumption,
      q4Consumption: data.q4Consumption,
      q5Consumption: data.q5Consumption,
    };

    const filteredQValues = Object.entries(qValues).reduce((acc, [key, value]) => {
      if (!isNaN(value) && value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});

    setData({
      labels: Object.keys(filteredQValues),
      values: Object.values(filteredQValues),
    });
  };

  const handleConsumptionResponse = (data) => {
    const dataArray = Array.isArray(data) ? data : data.data;

    if (dataArray && dataArray.length > 0) {
      const labels = dataArray.map((item) => {
        const formattedDate = DateUtils.formatFullDate(item.meter_time);
        return formattedDate;
      });

      const values = dataArray.map((item) => item.consumption);

      setData({ labels, values });
    } else {
      setData({ labels: [], values: [] });
    }
  };

  const getYAxisLabel = (type) => {
    switch (type) {
      case 'WATER':
      case 'GAS':
        return 'm³';
      case 'ELECTRICITY':
        return 'kWh';
      default:
        return '';
    }
  };

  const renderChart = () => {
    const { labels, values } = data;
  
    if (filter === 'qValue') {
      if (!labels || !values || labels.length === 0 || values.length === 0) {
        return <Text style={styles.noDataText}>No valid Q values available</Text>;
      }
  
      return (
        <BarChart
          data={{
            labels: labels,
            datasets: [
              {
                data: values,
              },
            ],
          }}
          width={Dimensions.get('window').width - 32}
          height={320}
          verticalLabelRotation={90}
          yAxisLabel=""
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
              r: '6',
              strokeWidth: '2',
              stroke: '#403e3d',
            },
            propsForLabels: {
              fontSize: 12,
              color: '#3e8574',
            },
          }}
          style={styles.chartStyle}
        />
      );
    }
  
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
        yAxisLabel=""
        yAxisSuffix={getYAxisLabel(type)}
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
        style={styles.chartStyle}
        onDataPointClick={(data) => setSelectedData(data)}
      />
    );
  };
  
  return (
    <ImageBackground source={require('./assets/moree.jpg')} style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('./assets/back-icon.png')} style={styles.icon} />
          </TouchableOpacity>
        <Image source={require('./assets/manas.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('./assets/home.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setFilter('hourly')}>
          <Text style={styles.buttonText}>Hourly</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setFilter('daily')}>
          <Text style={styles.buttonText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setFilter('monthly')}>
          <Text style={styles.buttonText}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setFilter('qValue')}>
          <Text style={styles.buttonText}>Q Values</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chartContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          renderChart()
        )}
      </View>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.modalButtonText}>Show Data Table</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={data.labels.map((label, index) => ({
                time : label,
                value: data.values[index],
              }))}
              renderItem={({ item }) => (
                <View style={styles.modalItem}>
                  <Text style={styles.modalItemText}>
                    {item.time}: {item.value}
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {selectedData && (
        <View style={styles.selectedDataContainer}>
          <Text style={styles.selectedDataText}>
            {selectedData.x}: {selectedData.value}
          </Text>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#f4a261',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  chartContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  chartStyle: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalButton: {
    marginTop: 16,
    backgroundColor: '#f4a261',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#3e8574',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
    marginVertical: 20,
  },
  selectedDataContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: '#ffffffaa',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  selectedDataText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ConsumptionGraphScreen;
