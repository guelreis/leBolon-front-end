import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { style } from './styles';

type RootStackParamList = {
  Login: undefined;
  Atendente: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type LoginProps = {
  navigation: LoginScreenNavigationProp;
};

export default function Login({ navigation }: LoginProps) {
  const [id, setId] = useState('');

  const handleLogin = () => {
    if (id === '1') {
      Alert.alert('Atendente', 'Você é um atendente.');
      navigation.navigate('Atendente');
    } else if (id === '2') {
      Alert.alert('Garçom', 'Você é um garçom.');
      // navigation.navigate('Garcom'); // se existir
    } else if (id === '3') {
      Alert.alert('Gerente', 'Você é um gerente.');
      // navigation.navigate('Gerente'); // se existir
    } else {
      Alert.alert('Erro', 'ID inválido. Tente novamente.');
    }
  };

  return (
    <View style={style.container}>
      <Text style={style.logo}>Le Bolon</Text>
      <Text style={style.title}>Login</Text>
      <TextInput
        style={style.input}
        placeholder="Digite seu ID"
        value={id}
        onChangeText={setId}
        keyboardType="numeric"
      />
      <TouchableOpacity style={style.button} onPress={handleLogin}>
        <Text style={style.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
