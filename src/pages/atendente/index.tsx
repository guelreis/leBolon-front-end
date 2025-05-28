import React, { useState, useEffect } from "react";
import {View, Text, TouchableOpacity, Modal, Alert,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { styles } from "./styles";
import { api } from "../../services/api";



type InfoMesa = {
  nome_responsavel: string;
  data: string;
  hora: string;
  qtd_pessoas: number;
};

const infoDasMesas: Record<number, InfoMesa> = {
  2: {
    nome_responsavel: "Maria Oliveira",
    data: "2025-05-19",
    hora: "18:00",
    qtd_pessoas: 2,
  },
  5: {
    nome_responsavel: "Carlos Souza",
    data: "2025-05-19",
    hora: "19:00",
    qtd_pessoas: 4,
  },
  8: {
    nome_responsavel: "Ana Paula",
    data: "2025-05-19",
    hora: "20:00",
    qtd_pessoas: 6,
  },
};

export default function Atendente() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedMesa, setSelectedMesa] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mesasConfirmadas, setMesasConfirmadas] = useState<number[]>([]);

   useEffect(() => {
  async function carregarMesasReservadas() {
    try {
      const response = await api.get('/reservas');
      const reservas = response.data; 

      const mesasReservadasIds = reservas.map((reserva: any) => reserva.mesa_id);

      setMesasConfirmadas(mesasReservadasIds);
    } catch (error) {
      console.error("Erro ao carregar mesas reservadas:", error);
    }
  }

  carregarMesasReservadas();
}, []);

const handleMesaPress = (mesa: number) => {
  setSelectedMesa(mesa);
  setModalVisible(true);
};

  const isMesaConfirmada = (mesa: number) => mesasConfirmadas.includes(mesa);

  const confirmarOuCancelarMesa = async () => {
  if (selectedMesa === null) return;

  if (isMesaConfirmada(selectedMesa)) {
    try {
  
      const response = await api.get("/reservas");
      const reservas = response.data;

      const reserva = reservas.find(
        (r: any) => r.mesa_id === selectedMesa
      );

      if (!reserva) {
        Alert.alert("Erro", "Reserva não encontrada.");
        return;
      }


      await api.delete(`/reservas/${reserva.id}`);

    
     const novasReservas = await api.get("/reservas");
const mesasReservadasIds = novasReservas.data.map((r: any) => r.mesa_id);
setMesasConfirmadas(mesasReservadasIds);

      Alert.alert("Sucesso", "Reserva cancelada com sucesso!");
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      Alert.alert("Erro", "Não foi possível cancelar a reserva.");
    }
  } else {
    const info = infoDasMesas[selectedMesa];
    try {
      await api.post("/reservas", {
        mesa_id: selectedMesa,
        data: info.data,
        hora: info.hora,
        nome_responsavel: info.nome_responsavel,
        qtd_pessoas: info.qtd_pessoas,
        garcom_id: null,
      });

      setMesasConfirmadas((prev) => [...prev, selectedMesa]);

      Alert.alert("Sucesso", "Reserva confirmada com sucesso!");
    } catch (error) {
      console.error("Erro ao reservar mesa:", error);
      Alert.alert("Erro", "Não foi possível reservar a mesa.");
    }
  }

  setModalVisible(false);
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atendente</Text>

      <View style={styles.grid}>
        {[...Array(10)].map((_, index) => {
          const mesaNumero = index + 1;
          const confirmada = isMesaConfirmada(mesaNumero);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.mesa,
                confirmada && { backgroundColor: "#ccc" }, 
              ]}
              onPress={() => handleMesaPress(mesaNumero)}
            >
              <Text style={styles.mesaText}>{mesaNumero}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modal com informações da mesa */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMesa && infoDasMesas[selectedMesa] ? (
              <>
                <Text style={styles.modalTitle}>Mesa {selectedMesa}</Text>
                <Text>Responsável: {infoDasMesas[selectedMesa].nome_responsavel}</Text>
                <Text>Data: {infoDasMesas[selectedMesa].data}</Text>
                <Text>Hora: {infoDasMesas[selectedMesa].hora}</Text>
                <Text>Pessoas: {infoDasMesas[selectedMesa].qtd_pessoas}</Text>

       <TouchableOpacity
        style={
        isMesaConfirmada(selectedMesa)
         ? styles.cancelButton 
          : styles.closeButton   
        }
         onPress={confirmarOuCancelarMesa}
       >
  <Text style={{ color: "#fff", fontWeight: "bold" }}>
    {isMesaConfirmada(selectedMesa) ? "Cancelar Reserva" : "Confirmar Reserva"}
  </Text>
</TouchableOpacity>

              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Mesa {selectedMesa}</Text>
                <Text style={{ marginTop: 10 }}>Nao possui reserva no momento.</Text>
                <TouchableOpacity
                  style={[styles.closeButton, { backgroundColor: "#e74c3c" }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "#fff" }}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Botão de voltar */}
      <TouchableOpacity
        style={styles.returnButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.returnButtonText}>Voltar para o Login</Text>
      </TouchableOpacity>
    </View>
  );
}
