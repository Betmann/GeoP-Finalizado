import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const AlterarSensor = ({ route }) => {
  const { id } = route.params;
  const [sensorData, setSensorData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/sensores/${id}/`);
        setSensorData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchSensorData();
  }, [id]);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (error) {
    return <Text>Erro ao carregar os dados: {error.message}</Text>;
  }

  const handleUpdateSensor = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/sensores/${id}/`, sensorData);
      alert('Sensor alterado com sucesso!');
    } catch (err) {
      console.error('Erro ao alterar o sensor:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alterar Sensor</Text>
      <Text>ID: {sensorData.id}</Text>
      <Text>Tipo: {sensorData.tipo}</Text>
      <Text>Localização: {sensorData.localizacao}</Text>
      <Text>Responsável: {sensorData.responsavel}</Text>
      <Text>Longitude: {sensorData.longitude}</Text>
      <Text>Latitude: {sensorData.latitude}</Text>
      <TextInput
        value={sensorData.novoCampo} 
        onChangeText={(text) => setSensorData({ ...sensorData, novoCampo: text })} 
        style={styles.input}
        placeholder="Novo Valor"
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateSensor}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default AlterarSensor;
