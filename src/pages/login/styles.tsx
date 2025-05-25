import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 80, 
    alignItems: "center", 
  },

  
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 250, // espaço entre logo e título
    textAlign: "center",
    color: "#333",
  },

  // Texto Login (abaixo do logo)
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#555",
  },

  // Campo de texto para digitar ID
  input: {
    width: "80%", 
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 30,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },

  // Botão personalizado
  button: {
    backgroundColor: "#007bff",
    width: "80%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  // Texto dentro do botão
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

});
