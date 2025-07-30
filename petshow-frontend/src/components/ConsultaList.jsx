// src/components/ConsultaList.jsx
import React, { useState, useEffect, useCallback } from "react"
import { getConsultas, deleteConsulta } from "../services/consultaService"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import LoadingSpinner from "./LoadingSpinner"
import NoResultsMessage from "./NoResultsMessage"
import "../App.css"

function ConsultaList() {
  const [consultas, setConsultas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchConsultasData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getConsultas()
      setConsultas(data)
    } catch (err) {
      toast.error(
        "Erro ao buscar consultas: " +
          (err.response?.data?.message || err.message)
      )
      console.error("Erro ao buscar consultas:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConsultasData()
  }, [fetchConsultasData])

  const handleDelete = async (id) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir esta consulta? Esta ação é irreversível.`
      )
    ) {
      try {
        await deleteConsulta(id)
        toast.success(`Consulta excluída com sucesso!`)
        fetchConsultasData() // Atualiza a lista
      } catch (err) {
        toast.error(
          `Erro ao excluir consulta: ` +
            (err.response?.data?.message || err.message)
        )
        console.error(`Erro ao excluir consulta:`, err)
      }
    }
  }

  const filteredConsultas = consultas.filter((consulta) => {
    const searchLower = searchTerm.toLowerCase()

    const formattedDate = consulta.data
      ? new Date(consulta.data).toLocaleDateString("pt-BR")
      : ""
    const formattedTime = consulta.hora || ""

    return (
      String(consulta.id).includes(searchLower) ||
      formattedDate.includes(searchLower) ||
      formattedTime.includes(searchLower) ||
      (consulta.descricao &&
        consulta.descricao.toLowerCase().includes(searchLower)) ||
      consulta.status.toLowerCase().includes(searchLower) ||
      (consulta.Animal &&
        consulta.Animal.nome.toLowerCase().includes(searchLower)) ||
      (consulta.Veterinario &&
        consulta.Veterinario.nome.toLowerCase().includes(searchLower))
    )
  })

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <h2>Lista de Consultas</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar consultas por data, animal, veterinário, status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredConsultas.length > 0 ? (
        <ul>
          {filteredConsultas.map((consulta) => (
            <li key={consulta.id}>
              <span>
                **Consulta ID: {consulta.id}** - Data:{" "}
                {consulta.data
                  ? new Date(consulta.data).toLocaleDateString("pt-BR")
                  : "N/A"}{" "}
                {consulta.hora} - Status: {consulta.status}
                <br />
                Animal:{" "}
                {consulta.Animal
                  ? `${consulta.Animal.nome} (ID: ${consulta.Animal.id})`
                  : "N/A"}
                {consulta.Veterinario &&
                  ` - Veterinário: Dr(a). ${consulta.Veterinario.nome} (CRMV: ${consulta.Veterinario.crmv})`}
                <br />
                Descrição: {consulta.descricao || "N/A"}
              </span>
              <div>
                <Link
                  to={`/consultas/editar/${consulta.id}`}
                  className="edit-button"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(consulta.id)}
                  className="delete-button"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <NoResultsMessage
          message={
            searchTerm
              ? `Nenhuma consulta encontrada com o termo "${searchTerm}".`
              : "Nenhuma consulta agendada."
          }
        />
      )}
    </div>
  )
}

export default ConsultaList
