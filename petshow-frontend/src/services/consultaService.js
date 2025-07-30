// src/services/consultaService.js
import axios from "axios"

// URL base para a API de consultas. Ajuste a porta se necessário.
const API_URL = "http://localhost:3001/api/consultas"

// Função para obter todas as consultas
export const getConsultas = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error("Erro ao buscar consultas:", error)
    throw error
  }
}

// Função para adicionar uma nova consulta (POST)
export const addConsulta = async (consultaData) => {
  try {
    const response = await axios.post(API_URL, consultaData)
    return response.data
  } catch (error) {
    console.error("Erro ao adicionar consulta:", error)
    throw error
  }
}

// Função para obter uma consulta por ID (GET)
export const getConsultaById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar consulta ${id}:`, error)
    throw error
  }
}

// Função para atualizar uma consulta (PUT)
export const updateConsulta = async (id, consultaData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, consultaData)
    return response.data
  } catch (error) {
    console.error(`Erro ao atualizar consulta ${id}:`, error)
    throw error
  }
}

// Função para deletar uma consulta (DELETE)
export const deleteConsulta = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`)
    console.log(`Consulta ${id} excluída com sucesso.`)
    return true
  } catch (error) {
    console.error(`Erro ao excluir consulta ${id}:`, error)
    throw error
  }
}
