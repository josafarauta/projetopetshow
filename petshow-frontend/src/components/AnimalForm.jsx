// src/components/AnimalForm.jsx
import React, { useState, useEffect } from "react" // <-- useCallback REMOVIDO DAQUI
import { useNavigate, useParams } from "react-router-dom" // CORRIGIDO 'react-router-router-dom'
import {
  addAnimal,
  getAnimalById,
  updateAnimal,
} from "../services/animalService"
import { getVeterinarios } from "../services/veterinarioService"
import { toast } from "react-toastify"
import { useFormik } from "formik"
import * as Yup from "yup"
import LoadingSpinner from "./LoadingSpinner"
import "../App.css"

function AnimalForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [veterinarios, setVeterinarios] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [loadingDependencies, setLoadingDependencies] = useState(true)

  const validationSchema = Yup.object({
    nome: Yup.string()
      .required("Nome é obrigatório.")
      .min(2, "Nome deve ter no mínimo 2 caracteres.")
      .max(100, "Nome deve ter no máximo 100 caracteres."),
    especie: Yup.string()
      .required("Espécie é obrigatória.")
      .max(50, "Espécie deve ter no máximo 50 caracteres."),
    raca: Yup.string().max(50, "Raça deve ter no máximo 50 caracteres."),
    dataNascimento: Yup.date()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .max(new Date(), "Data de nascimento não pode ser futura.")
      .typeError("Data de nascimento inválida."),
    idade: Yup.number()
      .nullable()
      .transform((curr, orig) => (orig === "" || isNaN(orig) ? null : curr))
      .integer("Idade deve ser um número inteiro.")
      .min(0, "Idade não pode ser negativa."),
    peso: Yup.number()
      .nullable()
      .transform((curr, orig) => (orig === "" || isNaN(orig) ? null : curr))
      .positive("Peso deve ser um valor positivo."),
    observacoes: Yup.string().max(
      255,
      "Observações devem ter no máximo 255 caracteres."
    ),
    veterinarioId: Yup.number()
      .nullable()
      .integer("ID do Veterinário deve ser um número inteiro.")
      .typeError("ID do Veterinário inválido."),
  })

  const [initialFormValues, setInitialFormValues] = useState({
    nome: "",
    especie: "",
    raca: "",
    dataNascimento: "",
    idade: "",
    peso: "",
    observacoes: "",
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
          dataNascimento: values.dataNascimento || null,
          idade: values.idade === "" ? null : values.idade,
          peso: values.peso === "" ? null : values.peso,
          veterinarioId:
            values.veterinarioId === ""
              ? null
              : parseInt(values.veterinarioId, 10),
        }

        if (id) {
          await updateAnimal(id, dataToSend)
          toast.success("Animal atualizado com sucesso!")
        } else {
          await addAnimal(dataToSend)
          toast.success("Animal adicionado com sucesso!")
        }

        setTimeout(() => {
          navigate("/animais")
        }, 1500)
      } catch (err) {
        console.error("Erro ao salvar animal:", err)
        const backendErrorMessage =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Verifique o console para mais detalhes."
        toast.error(`Erro ao salvar animal: ${backendErrorMessage}`)
      }
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoadingDependencies(true)
      try {
        const vets = await getVeterinarios()
        setVeterinarios(vets)
        setLoadingDependencies(false)

        if (id) {
          setLoadingData(true)
          const animal = await getAnimalById(id)
          const formattedDate = animal.dataNascimento
            ? new Date(animal.dataNascimento).toISOString().split("T")[0]
            : ""

          setInitialFormValues({
            nome: animal.nome || "",
            especie: animal.especie || "",
            raca: animal.raca || "",
            dataNascimento: formattedDate,
            idade: animal.idade === null ? "" : animal.idade,
            peso: animal.peso === null ? "" : animal.peso,
            observacoes: animal.observacoes || "",
            veterinarioId: animal.veterinarioId || "",
          })
          setLoadingData(false)
        } else {
          setInitialFormValues({
            nome: "",
            especie: "",
            raca: "",
            dataNascimento: "",
            idade: "",
            peso: "",
            observacoes: "",
            veterinarioId: "",
          })
        }
      } catch (err) {
        toast.error(
          "Erro ao carregar dados: " +
            (err.response?.data?.message || err.message)
        )
        console.error("Erro ao carregar dados em AnimalForm:", err)
        setLoadingData(false)
        setLoadingDependencies(false)
        if (id) navigate("/animais")
      }
    }
    fetchData()
  }, [id, navigate])

  if (loadingData || loadingDependencies) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <h2>{id ? "Editar Animal" : "Adicionar Novo Animal"}</h2>
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
          <label htmlFor="especie">Espécie:</label>
          <input
            type="text"
            id="especie"
            name="especie"
            {...formik.getFieldProps("especie")}
          />
          {formik.touched.especie && formik.errors.especie ? (
            <div className="error-message">{formik.errors.especie}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="raca">Raça:</label>
          <input
            type="text"
            id="raca"
            name="raca"
            {...formik.getFieldProps("raca")}
          />
          {formik.touched.raca && formik.errors.raca ? (
            <div className="error-message">{formik.errors.raca}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="dataNascimento">Data de Nascimento:</label>
          <input
            type="date"
            id="dataNascimento"
            name="dataNascimento"
            {...formik.getFieldProps("dataNascimento")}
          />
          {formik.touched.dataNascimento && formik.errors.dataNascimento ? (
            <div className="error-message">{formik.errors.dataNascimento}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="idade">Idade (anos):</label>
          <input
            type="number"
            id="idade"
            name="idade"
            {...formik.getFieldProps("idade")}
          />
          {formik.touched.idade && formik.errors.idade ? (
            <div className="error-message">{formik.errors.idade}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="peso">Peso (kg):</label>
          <input
            type="number"
            step="0.01"
            id="peso"
            name="peso"
            {...formik.getFieldProps("peso")}
          />
          {formik.touched.peso && formik.errors.peso ? (
            <div className="error-message">{formik.errors.peso}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="observacoes">Observações:</label>
          <textarea
            id="observacoes"
            name="observacoes"
            {...formik.getFieldProps("observacoes")}
            rows="3"
          ></textarea>
          {formik.touched.observacoes && formik.errors.observacoes ? (
            <div className="error-message">{formik.errors.observacoes}</div>
          ) : null}
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
          {id ? "Salvar Alterações" : "Adicionar Animal"}
        </button>
      </form>
    </div>
  )
}

export default AnimalForm
