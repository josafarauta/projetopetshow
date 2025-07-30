// controllers/animalController.js

const Animal = require("../models/Animal") // Importa o modelo Animal
const Veterinario = require("../models/Veterinario") // Necessário para incluir dados do veterinário
const { validationResult } = require("express-validator")

// Listar todos os animais (com informações do veterinário responsável)
exports.getAllAnimais = async (req, res) => {
  try {
    const animais = await Animal.findAll({
      include: [{ model: Veterinario, attributes: ["id", "nome", "crmv"] }], // Inclui dados do veterinário
    })
    res.status(200).json(animais)
  } catch (error) {
    console.error("Erro ao buscar animais:", error)
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao buscar animais." })
  }
}

// Buscar um animal por ID (com informações do veterinário responsável)
exports.getAnimalById = async (req, res) => {
  try {
    const { id } = req.params
    const animal = await Animal.findByPk(id, {
      include: [{ model: Veterinario, attributes: ["id", "nome", "crmv"] }],
    })

    if (!animal) {
      return res.status(404).json({ message: "Animal não encontrado." })
    }
    res.status(200).json(animal)
  } catch (error) {
    console.error("Erro ao buscar animal por ID:", error)
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao buscar animal." })
  }
}

// Criar um novo animal
exports.createAnimal = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const {
      nome,
      especie,
      raca,
      idade,
      peso,
      dataNascimento,
      observacoes,
      veterinarioId,
    } = req.body

    // Opcional: Verificar se o veterinarioId existe, caso seja fornecido
    if (veterinarioId) {
      const veterinarioExistente = await Veterinario.findByPk(veterinarioId)
      if (!veterinarioExistente) {
        return res
          .status(400)
          .json({ message: "Veterinário responsável não encontrado." })
      }
    }

    const novoAnimal = await Animal.create({
      nome,
      especie,
      raca,
      idade,
      peso,
      dataNascimento,
      observacoes,
      veterinarioId, // Sequelize automaticamente lida com a FK
    })
    res.status(201).json(novoAnimal)
  } catch (error) {
    console.error("Erro ao criar animal:", error)
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao criar animal." })
  }
}

// Atualizar um animal
exports.updateAnimal = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { id } = req.params
    const {
      nome,
      especie,
      raca,
      idade,
      peso,
      dataNascimento,
      observacoes,
      veterinarioId,
    } = req.body

    const animal = await Animal.findByPk(id)
    if (!animal) {
      return res.status(404).json({ message: "Animal não encontrado." })
    }

    // Opcional: Verificar se o novo veterinarioId existe, caso seja fornecido
    if (veterinarioId) {
      const veterinarioExistente = await Veterinario.findByPk(veterinarioId)
      if (!veterinarioExistente) {
        return res
          .status(400)
          .json({ message: "Veterinário responsável não encontrado." })
      }
    } else if (veterinarioId === null) {
      // Permite setar o veterinarioId para NULL explicitamente
      // (Se o campo veterinarioId não for fornecido no body, ele não será alterado)
    }

    await animal.update({
      nome,
      especie,
      raca,
      idade,
      peso,
      dataNascimento,
      observacoes,
      veterinarioId,
    })
    res.status(200).json(animal)
  } catch (error) {
    console.error("Erro ao atualizar animal:", error)
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao atualizar animal." })
  }
}

// Excluir um animal
exports.deleteAnimal = async (req, res) => {
  try {
    const { id } = req.params
    const result = await Animal.destroy({
      where: { id },
    })

    if (result === 0) {
      return res.status(404).json({ message: "Animal não encontrado." })
    }
    res.status(204).send()
  } catch (error) {
    console.error("Erro ao excluir animal:", error)
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao excluir animal." })
  }
}
