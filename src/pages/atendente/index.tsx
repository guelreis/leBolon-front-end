import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { styles } from "./styles";
import { api } from "../../services/api";

type InfoMesa = {
  nome_responsavel: string;
  data: string;
  hora: string;
  qtd_pessoas: string;
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const datePart = dateStr.split("T")[0].split(" ")[0];
  return datePart.replace(/-/g, "/");
}

function formatHour(hourStr: string): string {
  if (!hourStr) return "";
  return hourStr.substring(0, 5);
}

export default function Atendente() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [selectedMesa, setSelectedMesa] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mesasConfirmadas, setMesasConfirmadas] = useState<number[]>([]);

  const [info, setInfo] = useState<InfoMesa>({
    nome_responsavel: "",
    data: "",
    hora: "",
    qtd_pessoas: "",
  });

  useEffect(() => {
    async function carregarMesasReservadas() {
      try {
        const response = await api.get("/reservas");
        const reservas = response.data;
        const mesasReservadasIds = reservas.map((reserva: any) => reserva.mesa_id);
        setMesasConfirmadas(mesasReservadasIds);
      } catch (error) {
        console.error("Erro ao carregar mesas reservadas:", error);
      }
    }

    carregarMesasReservadas();
  }, []);

  const isMesaConfirmada = (mesa: number) => mesasConfirmadas.includes(mesa);

  const handleMesaPress = async (mesa: number) => {
    setSelectedMesa(mesa);

    if (isMesaConfirmada(mesa)) {
      try {
        const response = await api.get("/reservas");
        const reserva = response.data.find((r: any) => r.mesa_id === mesa);

        if (reserva) {
          setInfo({
            nome_responsavel: reserva.nome_responsavel,
            data: formatDate(reserva.data),
            hora: formatHour(reserva.hora),
            qtd_pessoas: reserva.qtd_pessoas.toString(),
          });
        }
      } catch (error) {
        console.error("Erro ao buscar reserva:", error);
      }
    } else {
      setInfo({
        nome_responsavel: "",
        data: "",
        hora: "",
        qtd_pessoas: "",
      });
    }

    setModalVisible(true);
  };

  const confirmarOuCancelarMesa = async () => {
    if (selectedMesa === null) return;

    if (isMesaConfirmada(selectedMesa)) {
    
      try {
        const response = await api.get("/reservas");
        const reservas = response.data;
        const reserva = reservas.find((r: any) => r.mesa_id === selectedMesa);

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
      if (!info.nome_responsavel || !info.data || !info.hora || !info.qtd_pessoas) {
        Alert.alert("Atenção", "Preencha todos os campos.");
        return;
      }
const dataFormatada = info.data.replace(/\//g, "-")
      try {
        await api.post("/reservas", {
          mesa_id: selectedMesa,
          data: dataFormatada,
          hora: info.hora,
          nome_responsavel: info.nome_responsavel,
          qtd_pessoas: parseInt(info.qtd_pessoas, 10),
          garcom_id: null,
        });

        setMesasConfirmadas((prev) => [...prev, selectedMesa]);
        Alert.alert("Sucesso", "Reserva criada com sucesso!");
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
              style={[styles.mesa, confirmada && { backgroundColor: "#ccc" }]}
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
            {selectedMesa !== null && (
              <>
                <Text style={styles.modalTitle}>Mesa {selectedMesa}</Text>

                {isMesaConfirmada(selectedMesa) ? (
                  <>
                    <Text>Responsável: {info.nome_responsavel}</Text>
                    <Text>Data: {info.data}</Text>
                    <Text>Hora: {info.hora}</Text>
                    <Text>Pessoas: {info.qtd_pessoas}</Text>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={confirmarOuCancelarMesa}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Cancelar Reserva
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TextInput
                      placeholder="Nome do responsável"
                      value={info.nome_responsavel}
                      onChangeText={(text) =>
                        setInfo({ ...info, nome_responsavel: text })
                      }
                      style={styles.input}
                    />
                    <TextInput
  placeholder="Data (AAAA/MM/DD)"
  value={info.data}
  onChangeText={(text) => {
    let cleaned = text.replace(/\D/g, ""); 
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    let masked = cleaned;
    if (cleaned.length > 6) {
      masked = `${cleaned.slice(0, 4)}/${cleaned.slice(4, 6)}/${cleaned.slice(6)}`;
    } else if (cleaned.length > 4) {
      masked = `${cleaned.slice(0, 4)}/${cleaned.slice(4)}`;
    }

    setInfo({ ...info, data: masked });
  }}
  maxLength={10}
  keyboardType="numeric"
  style={styles.input}
/>

                    <TextInput
                      placeholder="Hora (HH:MM)"
                      value={info.hora}
                      onChangeText={(text) => {
                        let cleaned = text.replace(/\D/g, "");
                        if (cleaned.length > 4) {
                          cleaned = cleaned.slice(0, 4);
                        }
                        if (cleaned.length > 2) {
                          cleaned = cleaned.slice(0, 2) + ":" + cleaned.slice(2);
                        }
                        setInfo({ ...info, hora: cleaned });
                      }}
                      maxLength={5}
                      keyboardType="numeric"
                      style={styles.input}
                    />
                    <TextInput
                      placeholder="Quantidade de pessoas"
                      keyboardType="numeric"
                      value={info.qtd_pessoas}
                      onChangeText={(text) => {
                        if (/^\d*$/.test(text)) {
                          setInfo({ ...info, qtd_pessoas: text });
                        }
                      }}
                      style={styles.input}
                    />
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={confirmarOuCancelarMesa}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Criar Reserva
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
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
