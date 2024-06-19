import React, { useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const Filter = () => {
  const [filters, setFilters] = useState({
    responsavel: '',
    status_operacional: false,
    tipo: '',
    localizacao: '',
  });

  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/sensor_filter/', filters);
      setSensors(response.data);
    } catch (error) {
      console.error('Error fetching sensors:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (sensors.length === 0) {
      return <Text>Nenhum sensor encontrado.</Text>;
    }

    return (
      <View style={styles.table}>
        <View style={styles.row}>
          <Text>Tipo</Text>
          <Text>Localização</Text>
          <Text>Responsável</Text>
        </View>
        {sensors.map(sensor => (
          <View key={sensor.id} style={styles.row}>
            <Text>{sensor.tipo}</Text>
            <Text>{sensor.localizacao}</Text>
            <Text>{sensor.responsavel}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FILTROS</Text>

      <TextInput
        style={styles.input}
        placeholder="Responsável"
        value={filters.responsavel}
        onChangeText={text => handleChange('responsavel', text)}
      />

      <View style={styles.row}>
        <Text>Status Operacional</Text>
        <Switch
          value={filters.status_operacional}
          onValueChange={value => handleChange('status_operacional', value)}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Tipo"
        value={filters.tipo}
        onChangeText={text => handleChange('tipo', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Localização"
        value={filters.localizacao}
        onChangeText={text => handleChange('localizacao', text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Filtrar</Text>
      </TouchableOpacity>

      {loading && <Text>Carregando...</Text>}
      {error && <Text>Erro ao buscar sensores: {error.message}</Text>}

      <View style={styles.tableContainer}>
        {renderTable()}
      </View>
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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  tableContainer: {
    marginTop: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
});

export default Filter;
