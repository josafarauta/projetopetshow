// models/Animal.js

const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/database")
const Veterinario = require("./Veterinario") // Importa o modelo Veterinario

const Animal = sequelize.define(
  "Animal",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "O nome do animal é obrigatório.",
        },
      },
    },
    especie: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "A espécie do animal é obrigatória.",
        },
      },
    },
    raca: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    idade: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "A idade deve ser um número inteiro.",
        },
        min: 0,
        max: 30, // Um limite razoável para a idade de animais em uma clínica
      },
    },
    peso: {
      type: DataTypes.DECIMAL(10, 2), // 10 dígitos no total, 2 após a vírgula
      allowNull: true,
      validate: {
        isDecimal: {
          msg: "O peso deve ser um número decimal.",
        },
        min: 0.1, // Peso mínimo razoável
      },
    },
    dataNascimento: {
      type: DataTypes.DATEONLY, // Apenas a data, sem hora
      allowNull: true,
      validate: {
        isDate: {
          msg: "Formato de data de nascimento inválido.",
        },
      },
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // veterinarioId será adicionado automaticamente pelo Sequelize na relação
  },
  {
    tableName: "animais",
  }
)

// Relacionamento: Um Veterinario pode ter muitos Animais
// Quando um veterinário é excluído, o 'veterinarioId' do Animal é definido como NULL
Animal.belongsTo(Veterinario, {
  foreignKey: "veterinarioId",
  onDelete: "SET NULL",
})

// Um Veterinario pode ter muitos Animais
Veterinario.hasMany(Animal, {
  foreignKey: "veterinarioId",
  onDelete: "SET NULL",
})

module.exports = Animal
