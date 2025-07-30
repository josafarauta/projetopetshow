// routes/animalRoutes.js

const express = require("express")
const { body, param } = require("express-validator")
const animalController = require("../controllers/animalController")

const router = express.Router()

// Validações para criação e atualização de animal
const animalValidationRules = [
  body("nome")
    .notEmpty()
    .withMessage("O nome do animal é obrigatório.")
    .isString()
    .withMessage("O nome deve ser uma string."),
  body("especie")
    .notEmpty()
    .withMessage("A espécie do animal é obrigatória.")
    .isString()
    .withMessage("A espécie deve ser uma string."),
  body("raca")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("A raça deve ser uma string."),
  body("idade")
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0, max: 30 })
    .withMessage("A idade deve ser um número inteiro entre 0 e 30."),
  body("peso")
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0.1 })
    .withMessage("O peso deve ser um número decimal maior que 0."),
  body("dataNascimento")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage("Formato de data de nascimento inválido. Use AAAA-MM-DD."),
  body("observacoes")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("As observações devem ser um texto."),
  body("veterinarioId")
    .optional({ nullable: true, checkFalsy: true })
    .isInt()
    .withMessage("O ID do veterinário deve ser um número inteiro."),
]

// Rotas para Animais
router.get("/", animalController.getAllAnimais)
router.get("/:id", animalController.getAnimalById)
router.post("/", animalValidationRules, animalController.createAnimal)
router.put("/:id", animalValidationRules, animalController.updateAnimal)
router.delete("/:id", animalController.deleteAnimal)

module.exports = router
