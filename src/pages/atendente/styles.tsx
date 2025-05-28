import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 80, 
    alignItems: "center", 


  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
    paddingHorizontal: 20,
  },
  mesa: {
    width: 60,
    height: 60,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
  },
  mesaText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
 closeButton: {
  marginTop: 15,
  backgroundColor: "#27ae60",  // verde
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
},

cancelButton: {
  marginTop: 15,
  backgroundColor: "#e74c3c",  // vermelho
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
},
 returnButton: {
  marginTop: 70,
  backgroundColor: "#333",
  padding: 12,
  borderRadius: 8,
  alignItems: "center",
  alignSelf: "center",
},

returnButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
},
input: {
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 10,
  borderRadius: 5,
  marginBottom: 10,
  backgroundColor: "#fff",
},
});