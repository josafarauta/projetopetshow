// src/services/animalService.js
import axios from "axios"

// Define a URL base para a API de animais.
// É crucial que esta URL corresponda à URL do seu backend e à porta correta.
const API_URL = "http://localhost:3001/api/animais"

// Função para obter todos os animais
export const getAnimais = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error("Erro ao buscar animais:", error)
    // Propaga o erro para o componente que chamou, para que ele possa exibir uma mensagem de erro.
    throw error
  }
}

// Função para adicionar um novo animal (requisição POST)
export const addAnimal = async (animalData) => {
  try {
    const response = await axios.post(API_URL, animalData)
    return response.data // Retorna o animal recém-criado/adicionado
  } catch (error) {
    console.error("Erro ao adicionar animal:", error)
    throw error
  }
}

// Função para obter um animal por ID (requisição GET para um único item)
export const getAnimalById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar animal ${id}:`, error)
    throw error
  }
}

// Função para atualizar um animal (requisição PUT)
export const updateAnimal = async (id, animalData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, animalData)
    return response.data // Retorna o animal atualizado
  } catch (error) {
    console.error(`Erro ao atualizar animal ${id}:`, error)
    throw error
  }
}

// Função para deletar um animal (requisição DELETE)
export const deleteAnimal = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`)
    console.log(`Animal ${id} excluído com sucesso.`)
    return true // Indica que a operação foi bem-sucedida
  } catch (error) {
    console.error(`Erro ao excluir animal ${id}:`, error)
    throw error
  }
}
