// src/components/ConsultaForm.jsx
import React, { useState, useEffect } from "react" // <-- useCallback REMOVIDO DAQUI
import { useNavigate, useParams } from "react-router-dom"
import {
  addConsulta,
  getConsultaById,
  updateConsulta,
} from "../services/consultaService"
import { getAnimais } from "../services/animalService"
import { getVeterinarios } from "../services/veterinarioService"
import { toast } from "react-toastify"
import { useFormik } from "formik"
import * as Yup from "yup"
import LoadingSpinner from "./LoadingSpinner"
import "../App.css"

function ConsultaForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [animais, setAnimais] = useState([])
  const [veterinarios, setVeterinarios] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [loadingDependencies, setLoadingDependencies] = useState(true)

  const validationSchema = Yup.object({
    data: Yup.date()
      .required("Data da consulta é obrigatória.")
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        "Data da consulta não pode ser no passado."
      )
      .typeError("Data da consulta inválida."),
    hora: Yup.string().required("Hora da consulta é obrigatória."),
    descricao: Yup.string().max(
      255,
      "Descrição deve ter no máximo 255 caracteres."
    ),
    status: Yup.string()
      .oneOf(["agendada", "concluida", "cancelada"], "Status inválido.")
      .required("Status é obrigatório."),
    animalId: Yup.number()
      .required("Animal é obrigatório.")
      .integer("ID do Animal deve ser um número inteiro.")
      .typeError("ID do Animal inválido."),
    veterinarioId: Yup.number()
      .nullable()
      .integer("ID do Veterinário deve ser um número inteiro.")
      .typeError("ID do Veterinário inválido."),
  })

  const [initialFormValues, setInitialFormValues] = useState({
    data: "",
    hora: "",
    descricao: "",
    status: "agendada",
    animalId: "",
    veterinarioId: "",
  })

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const dataToSend = {
          ...values,
          animalId: parseInt(values.animalId, 10),
          veterinarioId: values.veterinarioId
            ? parseInt(values.veterinarioId, 10)
            : null,
        }

        if (id) {
          await updateConsulta(id, dataToSend)
          toast.success("Consulta atualizada com sucesso!")
        } else {
          await addConsulta(dataToSend)
          toast.success("Consulta adicionada com sucesso!")
        }

        setTimeout(() => {
          navigate("/consultas")
        }, 1500)
      } catch (err) {
        console.error("Erro ao salvar consulta:", err)
        const backendErrorMessage =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Verifique o console para mais detalhes."
        toast.error(`Erro ao salvar consulta: ${backendErrorMessage}`)
      }
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoadingDependencies(true)
      try {
        const animaisData = await getAnimais()
        setAnimais(animaisData)

        const veterinariosData = await getVeterinarios()
        setVeterinarios(veterinariosData)

        setLoadingDependencies(false)

        if (id) {
          setLoadingData(true)
          const consulta = await getConsultaById(id)
          const formattedDate = consulta.data
            ? new Date(consulta.data).toISOString().split("T")[0]
            : ""

          setInitialFormValues({
            data: formattedDate,
            hora: consulta.hora || "",
            descricao: consulta.descricao || "",
            status: consulta.status || "agendada",
            animalId: consulta.animalId || "",
            veterinarioId: consulta.veterinarioId || "",
          })
          setLoadingData(false)
        } else {
          setInitialFormValues({
            data: "",
            hora: "",
            descricao: "",
            status: "agendada",
            animalId: "",
            veterinarioId: "",
          })
        }
      } catch (err) {
        toast.error(
          "Erro ao carregar dados: " +
            (err.response?.data?.message || err.message)
        )
        console.error("Erro ao carregar dados em ConsultaForm:", err)
        setLoadingData(false)
        setLoadingDependencies(false)
        if (id) navigate("/consultas")
      }
    }
    fetchData()
  }, [id, navigate])

  if (loadingData || loadingDependencies) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <h2>{id ? "Editar Consulta" : "Agendar Nova Consulta"}</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="data">Data:</label>
          <input
            type="date"
            id="data"
            name="data"
            {...formik.getFieldProps("data")}
            required
          />
          {formik.touched.data && formik.errors.data ? (
            <div className="error-message">{formik.errors.data}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="hora">Hora:</label>
          <input
            type="time"
            id="hora"
            name="hora"
            {...formik.getFieldProps("hora")}
            required
          />
          {formik.touched.hora && formik.errors.hora ? (
            <div className="error-message">{formik.errors.hora}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            name="descricao"
            {...formik.getFieldProps("descricao")}
            rows="3"
          ></textarea>
          {formik.touched.descricao && formik.errors.descricao ? (
            <div className="error-message">{formik.errors.descricao}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            {...formik.getFieldProps("status")}
            required
          >
            <option value="agendada">Agendada</option>
            <option value="concluida">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
          {formik.touched.status && formik.errors.status ? (
            <div className="error-message">{formik.errors.status}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="animalId">Animal:</label>
          <select
            id="animalId"
            name="animalId"
            {...formik.getFieldProps("animalId")}
            required
          >
            <option value="">Selecione um animal</option>
            {animais.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.nome} (ID: {animal.id})
              </option>
            ))}
          </select>
          {formik.touched.animalId && formik.errors.animalId ? (
            <div className="error-message">{formik.errors.animalId}</div>
          ) : null}
          {animais.length === 0 && (
            <p style={{ color: "orange" }}>
              Nenhum animal cadastrado. Cadastre um animal primeiro!
            </p>
          )}
        </div>

        <div>
          <label htmlFor="veterinarioId">Veterinário:</label>
          <select
            id="veterinarioId"
            name="veterinarioId"
            {...formik.getFieldProps("veterinarioId")}
          >
            <option value="">Nenhum (Opcional)</option>
            {veterinarios.map((vet) => (
              <option key={vet.id} value={vet.id}>
                Dr(a). {vet.nome} (CRMV: {vet.crmv})
              </option>
            ))}
          </select>
          {formik.touched.veterinarioId && formik.errors.veterinarioId ? (
            <div className="error-message">{formik.errors.veterinarioId}</div>
          ) : null}
          {veterinarios.length === 0 && (
            <p style={{ color: "orange" }}>Nenhum veterinário cadastrado.</p>
          )}
        </div>

        <button type="submit">
          {id ? "Salvar Alterações" : "Agendar Consulta"}
        </button>
      </form>
    </div>
  )
}

export default ConsultaForm
