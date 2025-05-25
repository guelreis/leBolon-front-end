import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { styles } from "./styles";

export default function Atendente() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedMesa, setSelectedMesa] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mesasConfirmadas, setMesasConfirmadas] = useState<number[]>([]);

  const handleMesaPress = (mesa: number) => {
    setSelectedMesa(mesa);
    setModalVisible(true);
  };

  const isMesaConfirmada = (mesa: number) => mesasConfirmadas.includes(mesa);

  const confirmarOuCancelarMesa = () => {
    if (selectedMesa !== null) {
      if (isMesaConfirmada(selectedMesa)) {
        setMesasConfirmadas(mesasConfirmadas.filter(m => m !== selectedMesa));
      } else {
        setMesasConfirmadas([...mesasConfirmadas, selectedMesa]);
      }
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atendente</Text>

      <View style={styles.grid}>
        {[...Array(12)].map((_, index) => {
          const mesaNumero = index + 1;
          const confirmada = isMesaConfirmada(mesaNumero);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.mesa,
                confirmada && { backgroundColor: "#ccc" }, // Cor cinza se confirmada
              ]}
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
            <Text>Responsável: João da Silva</Text>
            <Text>Data: 19/05/2025</Text>
            <Text>Hora: 18:30</Text>
            <Text>Número de pessoas: 4</Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={confirmarOuCancelarMesa}
            >
              <Text style={{ color: "#fff" }}>
                {isMesaConfirmada(selectedMesa!) ? "Cancelar" : "Confirmar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Botão de voltar para a tela de login */}
      <TouchableOpacity
        style={styles.returnButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.returnButtonText}>Voltar para o Login</Text>
      </TouchableOpacity>
    </View>
  );
}
