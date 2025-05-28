import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import { api } from '../../services/api';

type Mesa = {
  id: string;
  numero: number;
  reservadoPor?: string;
};

type Garcom = {
  id: string;
  nome: string;
  mesasAtendidas: number[];
};

type Props = {
  navigation: any; // tipagem simples, você pode melhorar se quiser
};

export default function Gerente({ navigation }: Props) {
  const [mesasReservadas, setMesasReservadas] = useState<Mesa[]>([]);
  const [garcons, setGarcons] = useState<Garcom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const responseMesas = await api.get<Mesa[]>('/mesas/reservadas');
        const responseGarcons = await api.get<{ id: number; nome: string }[]>('/garcons');

        const mesas = responseMesas.data.map(mesa => ({
          ...mesa,
          id: String(mesa.id),
          reservadoPor: undefined,
        }));

        const garconsRaw = responseGarcons.data;

        function sortearMesas(n: number, disponiveis: number[]) {
          const sorteadas: number[] = [];
          const copia = [...disponiveis];

          for (let i = 0; i < n; i++) {
            if (copia.length === 0) break;
            const idx = Math.floor(Math.random() * copia.length);
            sorteadas.push(copia[idx]);
            copia.splice(idx, 1);
          }
          return sorteadas;
        }

        const numerosMesas = mesas.map(mesa => mesa.numero);

        const garconsComMesas: Garcom[] = garconsRaw.map(garcom => ({
          id: String(garcom.id),
          nome: garcom.nome,
          mesasAtendidas: sortearMesas(Math.floor(Math.random() * 2) + 1, numerosMesas),
        }));

        setMesasReservadas(mesas);
        setGarcons(garconsComMesas);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mesas Reservadas ({mesasReservadas.length})</Text>
      <FlatList
        data={mesasReservadas}
        keyExtractor={item => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.mesaCard}>
            <Text style={styles.mesaNumero}>Mesa {item.numero}</Text>
            {item.reservadoPor && <Text style={styles.mesaCliente}>Reservada por: {item.reservadoPor}</Text>}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma mesa reservada</Text>}
      />

      <Text style={styles.header}>Garçons</Text>
      <FlatList
        data={garcons}
        keyExtractor={item => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.garcomCard}>
            <Text style={styles.garcomNome}>{item.nome}</Text>
            <Text style={styles.garcomMesas}>
              Mesas atendidas: {item.mesasAtendidas.length > 0 ? item.mesasAtendidas.join(', ') : 'Nenhuma'}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum garçom cadastrado</Text>}
      />

      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
     paddingTop: 60
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 12,
    color: '#333',
  },
  list: {
    marginBottom: 24,
  },
  mesaCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  mesaNumero: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
  },
  mesaCliente: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  garcomCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#28a745',
  },
  garcomNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#28a745',
  },
  garcomMesas: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 12,
  },
});
