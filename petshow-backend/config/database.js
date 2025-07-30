// config/database.js

require("dotenv").config() // Carrega as variáveis de ambiente

const { Sequelize } = require("sequelize")

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql", // Informa ao Sequelize que estamos usando MySQL
    logging: false, // Desabilita o log de queries SQL no console (opcional, pode ser true para debug)
    define: {
      timestamps: true, // Adiciona automaticamente createdAt e updatedAt em todos os modelos
      underscored: true, // Usa snake_case para nomes de colunas gerados (ex: created_at)
    },
  }
)

// Função para testar a conexão com o banco de dados
const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log("Conexão com o banco de dados MySQL estabelecida com sucesso!")
  } catch (error) {
    console.error("Não foi possível conectar ao banco de dados:", error)
    process.exit(1) // Encerra o processo se a conexão falhar
  }
}

module.exports = { sequelize, connectDB }
