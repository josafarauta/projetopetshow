// models/Consulta.js

const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/database")
const Animal = require("./Animal") // Importa o modelo Animal
const Veterinario = require("./Veterinario") // Importa o modelo Veterinario

const Consulta = sequelize.define(
  "Consulta",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Formato de data da consulta inválido.",
        },
        notEmpty: {
          msg: "A data da consulta é obrigatória.",
        },
      },
    },
    hora: {
      type: DataTypes.TIME, // Apenas a hora (HH:MM:SS)
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "A hora da consulta é obrigatória.",
        },
        // CORREÇÃO AQUI: 'msg' não é uma propriedade direta do 'validate' para 'is'.
        // A mensagem de erro para o 'is' (regex) deve ser uma string diretamente.
        is: {
          args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, // Regex para formato de hora HH:MM ou HH:MM:SS
          msg: "Formato de hora inválido. Use HH:MM ou HH:MM:SS.", // Esta é a forma correta de passar a mensagem para 'is'
        },
      },
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "agendada", // Valor padrão para novas consultas
      validate: {
        isIn: {
          args: [["agendada", "concluida", "cancelada"]], // Status permitidos
          msg: 'Status da consulta inválido. Use "agendada", "concluida" ou "cancelada".',
        },
      },
    },
    // animalId e veterinarioId serão adicionados automaticamente pelas relações
  },
  {
    tableName: "consultas",
  }
)

// Relacionamento: Uma Consulta pertence a um Animal
// Quando um Animal é excluído, suas Consultas são excluídas (CASCADE)
Consulta.belongsTo(Animal, {
  foreignKey: "animalId",
  allowNull: false, // Uma consulta sempre deve ter um animal
  onDelete: "CASCADE",
})

// Relacionamento: Uma Consulta pertence a um Veterinario
// Quando um Veterinario é excluído, o 'veterinarioId' da Consulta é definido como NULL
Consulta.belongsTo(Veterinario, {
  foreignKey: "veterinarioId",
  allowNull: true, // Uma consulta pode não ter mais um veterinário associado se ele for excluído
  onDelete: "SET NULL",
})

// Relacionamentos inversos para facilitar consultas
Animal.hasMany(Consulta, {
  foreignKey: "animalId",
  onDelete: "CASCADE",
})

Veterinario.hasMany(Consulta, {
  foreignKey: "veterinarioId",
  onDelete: "SET NULL",
})

module.exports = Consulta
