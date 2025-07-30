// src/services/veterinarioService.js
import axios from "axios"

// URL base para a API de veterinários. Ajuste a porta se necessário.
const API_URL = "http://localhost:3001/api/veterinarios"

// Função para obter todos os veterinários
export const getVeterinarios = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error("Erro ao buscar veterinários:", error)
    // Propaga o erro para o componente que chamou, para que ele possa exibir uma mensagem de erro.
    throw error
  }
}

// Função para adicionar um novo veterinário (POST)
export const addVeterinario = async (veterinarioData) => {
  try {
    const response = await axios.post(API_URL, veterinarioData)
    return response.data // Retorna o veterinário recém-criado/adicionado
  } catch (error) {
    console.error("Erro ao adicionar veterinário:", error)
    throw error
  }
}

// Função para obter um veterinário por ID (GET)
export const getVeterinarioById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar veterinário ${id}:`, error)
    throw error
  }
}

// Função para atualizar um veterinário (PUT)
export const updateVeterinario = async (id, veterinarioData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, veterinarioData)
    return response.data // Retorna o veterinário atualizado
  } catch (error) {
    console.error(`Erro ao atualizar veterinário ${id}:`, error)
    throw error
  }
}

// Função para deletar um veterinário (DELETE)
export const deleteVeterinario = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`)
    console.log(`Veterinário ${id} excluído com sucesso.`)
    return true // Indica que a operação foi bem-sucedida
  } catch (error) {
    console.error(`Erro ao excluir veterinário ${id}:`, error)
    throw error
  }
}
