// controllers/veterinarioController.js

const Veterinario = require("../models/Veterinario") // Importa o modelo Veterinario
const { validationResult } = require("express-validator") // Para lidar com os resultados da validação

// Função para listar todos os veterinários
exports.getAllVeterinarios = async (req, res) => {
  try {
    const veterinarios = await Veterinario.findAll()
    res.status(200).json(veterinarios)
  } catch (error) {
    console.error("Erro ao buscar veterinários:", error)
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao buscar veterinários." })
  }
}

// Função para buscar um veterinário por ID
exports.getVeterinarioById = async (req, res) => {
  try {
    const { id } = req.params
    const veterinario = await Veterinario.findByPk(id) // Busca pela chave primária

    if (!veterinario) {
      return res.status(404).json({ message: "Veterinário não encontrado." })
    }
    res.status(200).json(veterinario)
  } catch (error) {
    console.error("Erro ao buscar veterinário por ID:", error)
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao buscar veterinário." })
  }
}

// Função para criar um novo veterinário
exports.createVeterinario = async (req, res) => {
  // Validação dos dados de entrada
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { nome, crmv, especialidade, telefone, email } = req.body
    const novoVeterinario = await Veterinario.create({
      nome,
      crmv,
      especialidade,
      telefone,
      email,
    })
    res.status(201).json(novoVeterinario)
  } catch (error) {
    console.error("Erro ao criar veterinário:", error)
    // Verifica se é um erro de validação do Sequelize (ex: CRMV ou E-mail duplicado)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "CRMV ou E-mail já cadastrado." })
    }
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao criar veterinário." })
  }
}

// Função para atualizar um veterinário
exports.updateVeterinario = async (req, res) => {
  // Validação dos dados de entrada
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { id } = req.params
    const { nome, crmv, especialidade, telefone, email } = req.body

    const veterinario = await Veterinario.findByPk(id)
    if (!veterinario) {
      return res.status(404).json({ message: "Veterinário não encontrado." })
    }

    // Atualiza os dados
    await veterinario.update({ nome, crmv, especialidade, telefone, email })
    res.status(200).json(veterinario) // Retorna o veterinário atualizado
  } catch (error) {
    console.error("Erro ao atualizar veterinário:", error)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "CRMV ou E-mail já cadastrado." })
    }
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao atualizar veterinário." })
  }
}

// Função para excluir um veterinário
exports.deleteVeterinario = async (req, res) => {
  try {
    const { id } = req.params
    const result = await Veterinario.destroy({
      where: { id },
    })

    if (result === 0) {
      // Nenhum registro foi excluído
      return res.status(404).json({ message: "Veterinário não encontrado." })
    }
    res.status(204).send() // 204 No Content - Sucesso sem retorno de corpo
  } catch (error) {
    console.error("Erro ao excluir veterinário:", error)
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao excluir veterinário." })
  }
}
