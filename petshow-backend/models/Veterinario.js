// models/Veterinario.js

const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/database")

const Veterinario = sequelize.define(
  "Veterinario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false, // Campo obrigatório
      validate: {
        notEmpty: {
          msg: "O nome do veterinário é obrigatório.",
        },
      },
    },
    crmv: {
      type: DataTypes.STRING(50),
      allowNull: false, // Campo obrigatório
      unique: true, // Deve ser único
      validate: {
        notEmpty: {
          msg: "O CRMV é obrigatório.",
        },
        isUnique: async (value) => {
          const existingVeterinario = await Veterinario.findOne({
            where: { crmv: value },
          })
          if (existingVeterinario) {
            throw new Error("Este CRMV já está cadastrado.")
          }
        },
      },
    },
    especialidade: {
      type: DataTypes.STRING(255),
      allowNull: true, // Campo opcional
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true, // Campo opcional
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true, // Campo opcional
      unique: true,
      validate: {
        isEmail: {
          msg: "Formato de e-mail inválido.",
        },
        isUnique: async (value) => {
          if (value) {
            // Só valida se houver um valor
            const existingVeterinario = await Veterinario.findOne({
              where: { email: value },
            })
            if (existingVeterinario) {
              throw new Error("Este e-mail já está cadastrado.")
            }
          }
        },
      },
    },
  },
  {
    tableName: "veterinarios", // Nome da tabela no banco de dados
  }
)

module.exports = Veterinario
