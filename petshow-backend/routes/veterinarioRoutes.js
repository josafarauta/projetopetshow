// routes/veterinarioRoutes.js

const express = require("express")
const { body } = require("express-validator") // Para validações de corpo de requisição
const veterinarioController = require("../controllers/veterinarioController")

const router = express.Router()

// Validações para criação e atualização de veterinário
const veterinarioValidationRules = [
  body("nome")
    .notEmpty()
    .withMessage("O nome do veterinário é obrigatório.")
    .isString()
    .withMessage("O nome deve ser uma string."),
  body("crmv")
    .notEmpty()
    .withMessage("O CRMV é obrigatório.")
    .isString()
    .withMessage("O CRMV deve ser uma string."),
  body("especialidade")
    .optional({ nullable: true, checkFalsy: true }) // Permite ser nulo, mas se fornecido, valida
    .isString()
    .withMessage("A especialidade deve ser uma string."),
  body("telefone")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("O telefone deve ser uma string."),
  body("email")
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage("Formato de e-mail inválido."),
]

// Rotas para Veterinários
router.get("/", veterinarioController.getAllVeterinarios)
router.get("/:id", veterinarioController.getVeterinarioById)
router.post(
  "/",
  veterinarioValidationRules,
  veterinarioController.createVeterinario
)
router.put(
  "/:id",
  veterinarioValidationRules,
  veterinarioController.updateVeterinario
)
router.delete("/:id", veterinarioController.deleteVeterinario)

module.exports = router
