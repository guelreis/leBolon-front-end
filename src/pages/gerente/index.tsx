import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import { api } from '../../services/api';

type Mesa = {
  id: string;
  numero: number;
  nome_responsavel?: string;
  data?: string;
  hora?: string;
  qtd_pessoas?: number;
};


type Garcom = {
  id: string;
  nome: string;
  mesasAtendidas: number[];
};

type Props = {
  navigation: any; 
};

export default function Gerente({ navigation }: Props) {
  const [mesasReservadas, setMesasReservadas] = useState<Mesa[]>([]);
  const [garcons, setGarcons] = useState<Garcom[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function carregarDados() {
    try {
      const responseMesas = await api.get<Mesa[]>('/mesas/reservadas');
      const responseReservas = await api.get<any[]>('/reservas');
      const responseGarcons = await api.get<{ id: number; nome: string }[]>('/garcons');

      // Juntando as reservas com as mesas reservadas
      const mesasComReservas: Mesa[] = responseMesas.data.map(mesa => {
        const reservaMesa = responseReservas.data.find(r => r.mesa_id === mesa.id);
        return {
          ...mesa,
          id: String(mesa.id),
          reservadoPor: reservaMesa?.nome_responsavel || 'Desconhecido',
          data: reservaMesa?.data,
          hora: reservaMesa?.hora,
          qtd_pessoas: reservaMesa?.qtd_pessoas
        };
      });

      // Gerar mesas atendidas aleatórias para garçons
      const numerosMesas = mesasComReservas.map(m => m.numero);
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

      const garconsComMesas: Garcom[] = responseGarcons.data.map(garcom => ({
        id: String(garcom.id),
        nome: garcom.nome,
        mesasAtendidas: sortearMesas(Math.floor(Math.random() * 2) + 1, numerosMesas),
      }));

      setMesasReservadas(mesasComReservas);
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
            {item.nome_responsavel && (
              <>
                <Text style={styles.mesaCliente}>Responsável: {item.nome_responsavel}</Text>
                <Text style={styles.mesaCliente}>Data: {item.data?.replace(/-/g, '/')}</Text>
                <Text style={styles.mesaCliente}>Hora: {item.hora}</Text>
                <Text style={styles.mesaCliente}>Pessoas: {item.qtd_pessoas}</Text>
              </>
            )}
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
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 6,
  },
  list: {
    marginBottom: 16,
  },
  mesaCard: {
    backgroundColor: '#ADD8E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  mesaNumero: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 6,
  },
  mesaCliente: {
    fontSize: 14,
    color: '#004766',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  garcomCard: {
    backgroundColor: '#e9f7ef',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  garcomNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 6,
  },
  garcomMesas: {
    fontSize: 14,
    color: '#388e3c',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 24,
    fontStyle: 'italic',
  },
});
  