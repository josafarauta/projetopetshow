// src/components/VeterinarioList.jsx
import React, { useState, useEffect, useCallback } from "react"
import {
  getVeterinarios,
  deleteVeterinario,
} from "../services/veterinarioService"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import LoadingSpinner from "./LoadingSpinner"
import NoResultsMessage from "./NoResultsMessage"
import "../App.css"

function VeterinarioList() {
  const [veterinarios, setVeterinarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchVeterinariosData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getVeterinarios()
      setVeterinarios(data)
    } catch (err) {
      toast.error(
        "Erro ao buscar veterinários: " +
          (err.response?.data?.message || err.message)
      )
      console.error("Erro ao buscar veterinários:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVeterinariosData()
  }, [fetchVeterinariosData])

  const handleDelete = async (id, nomeVeterinario) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o veterinário "${nomeVeterinario}"? Esta ação é irreversível.`
      )
    ) {
      try {
        await deleteVeterinario(id)
        toast.success(`Veterinário "${nomeVeterinario}" excluído com sucesso!`)
        fetchVeterinariosData() // Atualiza a lista
      } catch (err) {
        toast.error(
          `Erro ao excluir veterinário "${nomeVeterinario}": ` +
            (err.response?.data?.message || err.message)
        )
        console.error(`Erro ao excluir veterinário "${nomeVeterinario}":`, err)
      }
    }
  }

  const filteredVeterinarios = veterinarios.filter((veterinario) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      veterinario.nome.toLowerCase().includes(searchLower) ||
      veterinario.crmv.toLowerCase().includes(searchLower) ||
      (veterinario.especialidade &&
        veterinario.especialidade.toLowerCase().includes(searchLower)) ||
      (veterinario.telefone &&
        veterinario.telefone.toLowerCase().includes(searchLower)) ||
      (veterinario.email &&
        veterinario.email.toLowerCase().includes(searchLower)) ||
      String(veterinario.id).includes(searchLower)
    )
  })

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <h2>Lista de Veterinários</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar veterinários por nome, CRMV, especialidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredVeterinarios.length > 0 ? (
        <ul>
          {filteredVeterinarios.map((veterinario) => (
            <li key={veterinario.id}>
              <span>
                **ID: {veterinario.id}** - Dr(a). {veterinario.nome} - CRMV:{" "}
                {veterinario.crmv} - Especialidade:{" "}
                {veterinario.especialidade || "N/A"} - Tel:{" "}
                {veterinario.telefone || "N/A"} - Email:{" "}
                {veterinario.email || "N/A"}
              </span>
              <div>
                <Link
                  to={`/veterinarios/editar/${veterinario.id}`}
                  className="edit-button"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(veterinario.id, veterinario.nome)}
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
              ? `Nenhum veterinário encontrado com o termo "${searchTerm}".`
              : "Nenhum veterinário cadastrado."
          }
        />
      )}
    </div>
  )
}

export default VeterinarioList
