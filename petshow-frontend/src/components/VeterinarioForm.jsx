// src/components/VeterinarioForm.jsx
import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  addVeterinario,
  getVeterinarioById,
  updateVeterinario,
} from "../services/veterinarioService"
import { toast } from "react-toastify"
import { useFormik } from "formik"
import * as Yup from "yup"
import LoadingSpinner from "./LoadingSpinner"
import "../App.css"

function VeterinarioForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [loadingData, setLoadingData] = useState(false)

  const validationSchema = Yup.object({
    nome: Yup.string()
      .required("Nome é obrigatório.")
      .min(2, "Nome deve ter no mínimo 2 caracteres.")
      .max(100, "Nome deve ter no máximo 100 caracteres."),
    crmv: Yup.string()
      .required("CRMV é obrigatório.")
      .min(5, "CRMV deve ter no mínimo 5 caracteres.")
      .max(20, "CRMV deve ter no máximo 20 caracteres."),
    especialidade: Yup.string().max(
      100,
      "Especialidade deve ter no máximo 100 caracteres."
    ),
    telefone: Yup.string().max(
      20,
      "Telefone deve ter no máximo 20 caracteres."
    ),
    email: Yup.string()
      .email("E-mail inválido.")
      .max(100, "E-mail deve ter no máximo 100 caracteres."),
  })

  const [initialFormValues, setInitialFormValues] = useState({
    nome: "",
    crmv: "",
    especialidade: "",
    telefone: "",
    email: "",
  })

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (id) {
          await updateVeterinario(id, values)
          toast.success("Veterinário atualizado com sucesso!")
        } else {
          await addVeterinario(values)
          toast.success("Veterinário adicionado com sucesso!")
        }

        setTimeout(() => {
          navigate("/veterinarios")
        }, 1500)
      } catch (err) {
        console.error("Erro ao salvar veterinário:", err)
        const backendErrorMessage =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Verifique o console para mais detalhes."
        toast.error(`Erro ao salvar veterinário: ${backendErrorMessage}`)
      }
    },
  })

  useEffect(() => {
    if (id) {
      setLoadingData(true)
      const fetchVeterinario = async () => {
        try {
          const veterinario = await getVeterinarioById(id)
          setInitialFormValues({
            nome: veterinario.nome || "",
            crmv: veterinario.crmv || "",
            especialidade: veterinario.especialidade || "",
            telefone: veterinario.telefone || "",
            email: veterinario.email || "",
          })
        } catch (err) {
          toast.error(
            "Erro ao carregar dados do veterinário para edição: " +
              (err.response?.data?.message || err.message)
          )
          console.error("Erro ao carregar veterinário para edição:", err)
          navigate("/veterinarios")
        } finally {
          setLoadingData(false)
        }
      }
      fetchVeterinario()
    } else {
      setInitialFormValues({
        nome: "",
        crmv: "",
        especialidade: "",
        telefone: "",
        email: "",
      })
    }
  }, [id, navigate])

  if (loadingData) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <h2>{id ? "Editar Veterinário" : "Adicionar Novo Veterinário"}</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            {...formik.getFieldProps("nome")}
          />
          {formik.touched.nome && formik.errors.nome ? (
            <div className="error-message">{formik.errors.nome}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="crmv">CRMV:</label>
          <input
            type="text"
            id="crmv"
            name="crmv"
            {...formik.getFieldProps("crmv")}
          />
          {formik.touched.crmv && formik.errors.crmv ? (
            <div className="error-message">{formik.errors.crmv}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="especialidade">Especialidade:</label>
          <input
            type="text"
            id="especialidade"
            name="especialidade"
            {...formik.getFieldProps("especialidade")}
          />
          {formik.touched.especialidade && formik.errors.especialidade ? (
            <div className="error-message">{formik.errors.especialidade}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="telefone">Telefone:</label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            {...formik.getFieldProps("telefone")}
          />
          {formik.touched.telefone && formik.errors.telefone ? (
            <div className="error-message">{formik.errors.telefone}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error-message">{formik.errors.email}</div>
          ) : null}
        </div>
        <button type="submit">
          {id ? "Salvar Alterações" : "Adicionar Veterinário"}
        </button>
      </form>
    </div>
  )
}

export default VeterinarioForm
