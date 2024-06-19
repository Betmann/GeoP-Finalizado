import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const SensorList = () => {
  const navigation = useNavigation();
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/sensores/');
        setSensors(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchSensors();
  }, []);

  const handleNavigateToSensorDetails = (id) => {
    navigation.navigate('SensorDetails', { id });
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (error) {
    return <Text>Erro ao carregar os dados: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Sensores</Text>
      <FlatList
        data={sensors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.sensorItem}
            onPress={() => handleNavigateToSensorDetails(item.id)}
          >
            <Text>ID: {item.id}</Text>
            <Text>Tipo: {item.tipo}</Text>
            <Text>Localização: {item.localizacao}</Text>
            <Text>Responsável: {item.responsavel}</Text>
            <Text>Longitude: {item.longitude}</Text>
            <Text>Latitude: {item.latitude}</Text>
            <TouchableOpacity
              style={styles.alterButton}
              onPress={() => navigation.navigate('AlterarSensor', { id: item.id })}
            >
              <Text style={styles.buttonText}>Alterar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  sensorItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  alterButton: {
    backgroundColor: '#6200ea',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default SensorList;
