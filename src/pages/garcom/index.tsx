import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { styles } from "./styles";
import { api } from "../../services/api";

type Reserva = {
  id: number;
  mesa_id: number;
  nome_responsavel: string;
  data: string;
  hora: string;
  qtd_pessoas: number;
};

export default function Garcom() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedMesa, setSelectedMesa] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null); 
  const [mesasAtendidas, setMesasAtendidas] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function carregarReservas() {
      try {
        const response = await api.get("/reservas");
        setReservas(response.data);
      } catch (error) {
        console.error("Erro ao carregar reservas:", error);
        Alert.alert("Erro", "Não foi possível carregar as reservas.");
      }
    }

    carregarReservas();
  }, []);

  const handleMesaPress = (mesa: number) => {
    setSelectedMesa(mesa);
    const reserva = reservas.find((r) => r.mesa_id === mesa);
    setReservaSelecionada(reserva || null);
    setModalVisible(true);
  };

  const isMesaReservada = (mesa: number) =>
    reservas.some((r) => r.mesa_id === mesa);

  const isMesaAtendida = (mesa: number) => mesasAtendidas.has(mesa);

  const clienteAtendido = () => {
    if (selectedMesa !== null) {
      setMesasAtendidas((prev) => new Set(prev).add(selectedMesa));
    }
    setModalVisible(false);
    Alert.alert("Informação", "Cliente marcado como atendido.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Garçom</Text>

      <View style={styles.grid}>
        {[...Array(10)].map((_, index) => {
          const mesaNumero = index + 1;
          const reservada = isMesaReservada(mesaNumero);
          const atendida = isMesaAtendida(mesaNumero);

          let backgroundColor = "#007bff"; 
          if (atendida) {
            backgroundColor = "#2ecc71"; 
          } else if (reservada) {
            backgroundColor = "#ccc"; 
          }

          return (
            <TouchableOpacity
              key={mesaNumero}
              style={[styles.mesa, { backgroundColor }]}
              onPress={() => handleMesaPress(mesaNumero)}
            >
              <Text style={styles.mesaText}>{mesaNumero}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

     <Modal
  visible={modalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Mesa {selectedMesa}</Text>

      {selectedMesa !== null && isMesaAtendida(selectedMesa) ? (

        <>
          {reservaSelecionada && (
            <>
              <Text>Responsável: {reservaSelecionada.nome_responsavel}</Text>
              <Text>
                Data:{" "}
                {new Date(reservaSelecionada.data).toLocaleDateString("pt-BR")}
              </Text>
              <Text>Hora: {reservaSelecionada.hora}</Text>
              <Text>Número de pessoas: {reservaSelecionada.qtd_pessoas}</Text>
            </>
          )}

          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: "#e74c3c", marginTop: 20 }]}
            onPress={async () => {
              if (reservaSelecionada) {
                try {
                  await api.delete(`/reservas/${reservaSelecionada.id}`);
                  setReservas((prev) =>
                    prev.filter((r) => r.id !== reservaSelecionada.id)
                  );
                  setMesasAtendidas((prev) => {
                    const novoSet = new Set(prev);
                    novoSet.delete(selectedMesa);
                    return novoSet;
                  });
                  setModalVisible(false);
                  Alert.alert("Cancelado", "Presença cancelada com sucesso.");
                } catch (error) {
                  Alert.alert("Erro", "Não foi possível cancelar a reserva.");
                }
              }
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Atendimento encerrado
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: "#8e44ad", marginTop: 10 }]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "#fff" }}>Fechar</Text>
          </TouchableOpacity>
        </>
      ) : reservaSelecionada ? (

        <>
          <Text>Responsável: {reservaSelecionada.nome_responsavel}</Text>
          <Text>
            Data:{" "}
            {new Date(reservaSelecionada.data).toLocaleDateString("pt-BR")}
          </Text>
         <Text>Hora: {reservaSelecionada.hora.slice(0, 5)}</Text>

          <Text>Número de pessoas: {reservaSelecionada.qtd_pessoas}</Text>

          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: "#2ecc71", marginTop: 20 }]}
            onPress={clienteAtendido}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Cliente atendido
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: "#e74c3c", marginTop: 10 }]}
            onPress={async () => {
              if (reservaSelecionada) {
                try {
                  await api.delete(`/reservas/${reservaSelecionada.id}`);
                  setReservas((prev) =>
                    prev.filter((r) => r.id !== reservaSelecionada.id)
                  );
                  setModalVisible(false);
                  Alert.alert("Cancelado", "Presença cancelada com sucesso.");
                } catch (error) {
                  Alert.alert("Erro", "Não foi possível cancelar a reserva.");
                }
              }
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Cancelar presença
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        // Mesa não reservada
        <>
          <Text style={{ marginTop: 10 }}>Esta mesa está sem reserva.</Text>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: "#e74c3c", marginTop: 20 }]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "#fff" }}>Fechar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  </View>
</Modal>


      <TouchableOpacity
        style={styles.returnButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.returnButtonText}>Voltar para o Login</Text>
      </TouchableOpacity>
    </View>
  );
}
