import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { weatherConditions } from '../utils/WeatherConditions';

const Weather = ({ weather, temperature }) => {
  return (
    <View
      style={[
        styles.weatherContainer,
        { backgroundColor: weatherConditions[weather].color }
      ]}
    >
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons
          size={60}
          name={weatherConditions[weather].icon}
          color={'#fff'}
        />
        <View>
          <Text style={styles.tempText}>{temperature}˚ F</Text>
          <View>
            <Text style={styles.title}>{weatherConditions[weather].title}</Text>
            <Text style={styles.subtitle}>
              {weatherConditions[weather].subtitle}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

Weather.propTypes = {
  temperature: PropTypes.number.isRequired,
  weather: PropTypes.string
};

const styles = StyleSheet.create({
  weatherContainer: {
    flex: 1
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20
  },
  tempText: {
    fontSize: 25,
    color: '#fff',
  },
  title: {
    fontSize: 30,
    color: '#fff'
  },
  subtitle: {
    fontSize: 20,
    color: '#fff'
  }
});

export default Weather;
