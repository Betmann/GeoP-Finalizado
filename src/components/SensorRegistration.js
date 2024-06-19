import React from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


const schemaSensor = z.object({
    tipo: z.string().nonempty('Tipo é obrigatório'),
    mac_address: z.string().max(20, 'Máximo de 20 caracteres').nullable(),
    latitude: z.string().refine(val => !isNaN(parseFloat(val)), 'Latitude inválida'),
    longitude: z.string().refine(val => !isNaN(parseFloat(val)), 'Longitude inválida'),
    localizacao: z.string().max(100, 'Máximo de 100 caracteres'),
    responsavel: z.string().max(100, 'Máximo de 100 caracteres'),
    unidade_medida: z.string().max(20, 'Máximo de 20 caracteres').nullable(),
    status_operacional: z.boolean(),
    observacao: z.string().nullable(),
});

const SensorRegistration = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schemaSensor)
    });

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/sensores/', data);
            alert('Sensor cadastrado com sucesso!');
            
        } catch (error) {
            console.error('Erro no cadastro de sensor', error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro de Sensor</Text>

            <TextInput {...register('tipo')} style={styles.input} placeholder="Tipo" />
            {errors.tipo && <Text style={styles.error}>{errors.tipo.message}</Text>}

            <TextInput {...register('mac_address')} style={styles.input} placeholder="MAC Address" />
            {errors.mac_address && <Text style={styles.error}>{errors.mac_address.message}</Text>}

            <TextInput {...register('latitude')} style={styles.input} placeholder="Latitude" />
            {errors.latitude && <Text style={styles.error}>{errors.latitude.message}</Text>}

            <TextInput {...register('longitude')} style={styles.input} placeholder="Longitude" />
            {errors.longitude && <Text style={styles.error}>{errors.longitude.message}</Text>}

            <TextInput {...register('localizacao')} style={styles.input} placeholder="Localização" />
            {errors.localizacao && <Text style={styles.error}>{errors.localizacao.message}</Text>}

            <TextInput {...register('responsavel')} style={styles.input} placeholder="Responsável" />
            {errors.responsavel && <Text style={styles.error}>{errors.responsavel.message}</Text>}

            <TextInput {...register('unidade_medida')} style={styles.input} placeholder="Unidade de Medida" />
            {errors.unidade_medida && <Text style={styles.error}>{errors.unidade_medida.message}</Text>}

            <View style={styles.checkboxContainer}>
                <Text>Status Operacional:</Text>
                <Switch {...register('status_operacional')} />
            </View>

            <TextInput {...register('observacao')} style={styles.input} placeholder="Observação" />
            {errors.observacao && <Text style={styles.error}>{errors.observacao.message}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
        </View>
    );
}

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
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#6200ea',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default SensorRegistration;
