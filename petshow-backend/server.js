// server.js

// Carrega as variáveis de ambiente do arquivo .env
require("dotenv").config()

const express = require("express")
const cors = require("cors") // Já está importado, mas reforçando
// Importa a função de conexão com o banco de dados e a instância do Sequelize
const { connectDB, sequelize } = require("./config/database")

// --- Importar os Modelos ---
// É importante importar os modelos ANTES de chamar sequelize.sync()
// para que o Sequelize os reconheça e crie as tabelas no DB.
require("./models/Veterinario")
require("./models/Animal")
require("./models/Consulta")
// --- Fim da importação dos Modelos ---

// --- Importar as Rotas ---
const veterinarioRoutes = require("./routes/veterinarioRoutes")
const animalRoutes = require("./routes/animalRoutes")
const consultaRoutes = require("./routes/consultaRoutes")
// --- Fim da importação das Rotas ---

const app = express()
// Define a porta, pegando do .env ou usando 3000 como padrão
const PORT = process.env.PORT || 3000

// Middlewares
// Habilita o Express a parsear JSON do corpo das requisições
app.use(express.json())

// --- Configuração do CORS ---
// Habilita o CORS para permitir requisições de outras origens (frontend)
// Definimos a origem específica do nosso frontend React com Vite.
// Se seu frontend rodar em outra porta, ou em produção, esta URL precisará ser ajustada.
app.use(
  cors({
    origin: "http://localhost:5173", // Permite requisições APENAS do seu frontend React
  })
)
// --- Fim da configuração do CORS ---

// Rota de teste
app.get("/", (req, res) => {
  res.send("API PetShow funcionando!")
})

// --- Usar as Rotas da API ---
// Monta as rotas para cada entidade sob o prefixo /api/
app.use("/api/veterinarios", veterinarioRoutes)
app.use("/api/animais", animalRoutes)
app.use("/api/consultas", consultaRoutes)
// --- Fim do uso das Rotas da API ---

// Inicializa o servidor e conecta ao banco de dados
const startServer = async () => {
  try {
    // Tenta conectar ao DB antes de iniciar o servidor
    await connectDB()

    // Sincroniza os modelos com o banco de dados.
    // `alter: true` tenta fazer alterações incrementais nas tabelas
    // sem perder dados existentes.
    // CUIDADO: Usar `force: true` APAGA todas as tabelas e dados existentes
    // e as recria. Use SOMENTE em desenvolvimento e com cautela.
    await sequelize.sync({ alter: true })
    console.log("Modelos sincronizados com o banco de dados!")

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`)
      console.log(`Acesse: http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("Erro ao iniciar o servidor ou conectar ao DB:", error)
    // Em caso de erro na conexão ou sincronização, encerra o processo
    process.exit(1)
  }
}

// Chama a função para iniciar o servidor
startServer()
