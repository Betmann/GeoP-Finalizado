import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
 
const { width, height } = Dimensions.get('window');
 
const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
 
  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
 
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);
 
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
 
  return R * c * 1000;
};
 
const Map = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [nearbyPoints, setNearbyPoints] = useState([]);
 
  const fixedPoints = [
    { id: 1, latitude: -22.9141396, longitude: -47.0681575 },
    { id: 2, latitude: -22.9141585, longitude: -47.0681317 },
    { id: 3, latitude: -22.9141236, longitude: -47.0681981 },
    { id: 4, latitude: -22.914118, longitude: -47.0681733 },
    { id: 5, latitude: -22.914102, longitude: -47.0681967 },
    { id: 6, latitude: -22.9141437, longitude: -47.068242 },
    { id: 7, latitude: -22.9142107, longitude: -47.0683976 },
    { id: 8, latitude: -22.9141952, longitude: -47.0683711 },
    { id: 9, latitude: -22.9141335, longitude: -47.0681984 },
    { id: 10, latitude: -22.9141909, longitude: -47.0683617 },
    { id: 11, latitude: -22.9141952, longitude: -47.0683845 },
    { id: 12, latitude: -22.9142085, longitude: -47.0684187 },
    { id: 13, latitude: -22.9141838, longitude: -47.0683573 },
    { id: 14, latitude: -22.9141971, longitude: -47.0683788 },
    { id: 15, latitude: -22.9141971, longitude: -47.0683788 },
  ];
 
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
 
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );
 
      return () => {
        locationSubscription.remove();
      };
    })();
  }, []);
 
  useEffect(() => {
    if (location) {
      const newNearbyPoints = fixedPoints
        .map((point) => {
          const distance = haversineDistance(location, point);
          return { ...point, distance };
        })
        .filter((point) => point.distance < 10); 
      setNearbyPoints(newNearbyPoints);
    }
  }, [location]);
 
  const getTemperature = async (latitude, longitude) => {
    const API_KEY = 'd11951cdea0f208d5643baf7104a83d7';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
 
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.main && data.main.temp) {
        setTemperature(data.main.temp);
      } else {
        setTemperature('Temperatura não disponível');
      }
    } catch (error) {
      console.error('Erro ao buscar temperatura:', error);
      setTemperature('Erro ao buscar temperatura');
    }
  };
 
  const handleMarkerPress = async (point) => {
    setSelectedPoint(point);
    await getTemperature(point.latitude, point.longitude);
  };
 
  let text = 'Esperando...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.latitude.toFixed(6)}, Longitude: ${location.longitude.toFixed(6)}`;
  }
 
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -22.9140639,
          longitude: -47.068686,
          latitudeDelta: 0.004,
          longitudeDelta: 0.004,
        }}
      >
        {fixedPoints.map((point) => (
          <Marker
            key={point.id}
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            pinColor="#9b59b6"
            onPress={() => handleMarkerPress(point)}
          />
        ))}
        {location && (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            pinColor="#e74c3c"
          />
        )}
      </MapView>
      {nearbyPoints.length > 0 && (
        <View style={styles.distancesContainer}>
          {nearbyPoints.map((point) => (
            <Text key={point.id} style={styles.distanceText}>
             Distância até o ponto {point.id}: {point.distance.toFixed(2)} metros
            </Text>
          ))}
        </View>
      )}
      {selectedPoint && (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherText}>
           Temperatura no ponto {selectedPoint.id}: {temperature}°C
          </Text>
        </View>
      )}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  map: {
    width: width - 20,
    height: height / 1.5,
    borderRadius: 20,
    overflow: 'hidden',
    margin: 10,
  },
  text: {
    fontSize: 18,
    color: '#ffffff',
    marginTop: 10,
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  distancesContainer: {
    position: 'absolute',
    top: 40,
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  distanceText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  weatherContainer: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  weatherText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
 
export default Map;