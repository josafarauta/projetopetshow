// routes/consultaRoutes.js

const express = require("express")
const { body, param } = require("express-validator")
const consultaController = require("../controllers/consultaController")

const router = express.Router()

// Validações para criação e atualização de consulta
const consultaValidationRules = [
  body("data")
    .notEmpty()
    .withMessage("A data da consulta é obrigatória.")
    .isISO8601()
    .toDate()
    .withMessage("Formato de data inválido. Use AAAA-MM-DD."),
  body("hora")
    .notEmpty()
    .withMessage("A hora da consulta é obrigatória.")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .withMessage("Formato de hora inválido. Use HH:MM ou HH:MM:SS."),
  body("descricao")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("A descrição deve ser um texto."),
  body("status")
    .notEmpty()
    .withMessage("O status da consulta é obrigatório.")
    .isIn(["agendada", "concluida", "cancelada"])
    .withMessage(
      'Status inválido. Use "agendada", "concluida" ou "cancelada".'
    ),
  body("animalId")
    .notEmpty()
    .withMessage("O ID do animal é obrigatório para a consulta.")
    .isInt()
    .withMessage("O ID do animal deve ser um número inteiro."),
  body("veterinarioId")
    .optional({ nullable: true, checkFalsy: true })
    .isInt()
    .withMessage("O ID do veterinário deve ser um número inteiro."),
]

// Rotas para Consultas
router.get("/", consultaController.getAllConsultas)
router.get("/:id", consultaController.getConsultaById)
router.post("/", consultaValidationRules, consultaController.createConsulta)
router.put("/:id", consultaValidationRules, consultaController.updateConsulta)
router.delete("/:id", consultaController.deleteConsulta)

module.exports = router
