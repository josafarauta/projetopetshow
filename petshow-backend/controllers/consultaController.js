// controllers/consultaController.js

const Consulta = require("../models/Consulta")
const Animal = require("../models/Animal") // Para incluir informações do animal
const Veterinario = require("../models/Veterinario") // Para incluir informações do veterinário
const { validationResult } = require("express-validator")

// Listar todas as consultas (com informações do animal e veterinário)
exports.getAllConsultas = async (req, res) => {
  try {
    const consultas = await Consulta.findAll({
      include: [
        { model: Animal, attributes: ["id", "nome", "especie"] },
        { model: Veterinario, attributes: ["id", "nome", "crmv"] },
      ],
    })
    res.status(200).json(consultas)
  } catch (error) {
    console.error("Erro ao buscar consultas:", error)
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao buscar consultas." })
  }
}

// Buscar uma consulta por ID (com informações do animal e veterinário)
exports.getConsultaById = async (req, res) => {
  try {
    const { id } = req.params
    const consulta = await Consulta.findByPk(id, {
      include: [
        { model: Animal, attributes: ["id", "nome", "especie"] },
        { model: Veterinario, attributes: ["id", "nome", "crmv"] },
      ],
    })

    if (!consulta) {
      return res.status(404).json({ message: "Consulta não encontrada." })
    }
    res.status(200).json(consulta)
  } catch (error) {
    console.error("Erro ao buscar consulta por ID:", error)
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao buscar consulta." })
  }
}

// Criar uma nova consulta
exports.createConsulta = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { data, hora, descricao, status, animalId, veterinarioId } = req.body

    // Verificar se animalId existe e é válido
    const animalExistente = await Animal.findByPk(animalId)
    if (!animalExistente) {
      return res.status(400).json({ message: "Animal não encontrado." })
    }

    // Verificar se veterinarioId existe e é válido (se fornecido)
    if (veterinarioId) {
      const veterinarioExistente = await Veterinario.findByPk(veterinarioId)
      if (!veterinarioExistente) {
        return res.status(400).json({ message: "Veterinário não encontrado." })
      }
    }

    const novaConsulta = await Consulta.create({
      data,
      hora,
      descricao,
      status,
      animalId,
      veterinarioId,
    })
    res.status(201).json(novaConsulta)
  } catch (error) {
    console.error("Erro ao criar consulta:", error)
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao criar consulta." })
  }
}

// Atualizar uma consulta
exports.updateConsulta = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { id } = req.params
    const { data, hora, descricao, status, animalId, veterinarioId } = req.body

    const consulta = await Consulta.findByPk(id)
    if (!consulta) {
      return res.status(404).json({ message: "Consulta não encontrada." })
    }

    // Verificar se animalId existe e é válido, se estiver sendo alterado
    if (animalId && animalId !== consulta.animalId) {
      const animalExistente = await Animal.findByPk(animalId)
      if (!animalExistente) {
        return res.status(400).json({ message: "Novo Animal não encontrado." })
      }
    }

    // Verificar se veterinarioId existe e é válido, se estiver sendo alterado (ou null)
    if (
      veterinarioId !== undefined &&
      veterinarioId !== null &&
      veterinarioId !== consulta.veterinarioId
    ) {
      const veterinarioExistente = await Veterinario.findByPk(veterinarioId)
      if (!veterinarioExistente) {
        return res
          .status(400)
          .json({ message: "Novo Veterinário não encontrado." })
      }
    }

    await consulta.update({
      data,
      hora,
      descricao,
      status,
      animalId,
      veterinarioId,
    })
    res.status(200).json(consulta)
  } catch (error) {
    console.error("Erro ao atualizar consulta:", error)
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao atualizar consulta." })
  }
}

// Excluir uma consulta
exports.deleteConsulta = async (req, res) => {
  try {
    const { id } = req.params
    const result = await Consulta.destroy({
      where: { id },
    })

    if (result === 0) {
      return res.status(404).json({ message: "Consulta não encontrada." })
    }
    res.status(204).send()
  } catch (error) {
    console.error("Erro ao excluir consulta:", error)
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao excluir consulta." })
  }
}
