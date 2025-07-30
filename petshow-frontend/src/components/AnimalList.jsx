// src/components/AnimalList.jsx
import React, { useState, useEffect, useCallback } from "react"
import { getAnimais, deleteAnimal } from "../services/animalService"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import LoadingSpinner from "./LoadingSpinner"
import NoResultsMessage from "./NoResultsMessage"
import "../App.css"

function AnimalList() {
  const [animais, setAnimais] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchAnimaisData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAnimais()
      setAnimais(data)
    } catch (err) {
      toast.error(
        "Erro ao buscar animais: " +
          (err.response?.data?.message || err.message)
      )
      console.error("Erro ao buscar animais:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnimaisData()
  }, [fetchAnimaisData])

  const handleDelete = async (id, nomeAnimal) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o animal "${nomeAnimal}"? Esta ação é irreversível.`
      )
    ) {
      try {
        await deleteAnimal(id)
        toast.success(`Animal "${nomeAnimal}" excluído com sucesso!`)
        fetchAnimaisData() // Atualiza a lista
      } catch (err) {
        toast.error(
          `Erro ao excluir animal "${nomeAnimal}": ` +
            (err.response?.data?.message || err.message)
        )
        console.error(`Erro ao excluir animal "${nomeAnimal}":`, err)
      }
    }
  }

  const filteredAnimais = animais.filter((animal) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      animal.nome.toLowerCase().includes(searchLower) ||
      animal.especie.toLowerCase().includes(searchLower) ||
      animal.raca.toLowerCase().includes(searchLower) ||
      (animal.observacoes &&
        animal.observacoes.toLowerCase().includes(searchLower)) ||
      (animal.Veterinario &&
        animal.Veterinario.nome.toLowerCase().includes(searchLower)) ||
      String(animal.id).includes(searchLower)
    )
  })

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <h2>Lista de Animais</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar animais por nome, espécie, raça, ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredAnimais.length > 0 ? (
        <ul>
          {filteredAnimais.map((animal) => (
            <li key={animal.id}>
              <span>
                **ID: {animal.id}** - {animal.nome} ({animal.especie},{" "}
                {animal.raca}) - Idade: {animal.idade} - Peso: {animal.peso}kg -
                Nasc:{" "}
                {animal.dataNascimento
                  ? new Date(animal.dataNascimento).toLocaleDateString("pt-BR")
                  : "N/A"}
                {animal.Veterinario &&
                  ` - Veterinário: Dr(a). ${animal.Veterinario.nome}`}
              </span>
              <div>
                <Link
                  to={`/animais/editar/${animal.id}`}
                  className="edit-button"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(animal.id, animal.nome)}
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
              ? `Nenhum animal encontrado com o termo "${searchTerm}".`
              : "Nenhum animal cadastrado."
          }
        />
      )}
    </div>
  )
}

export default AnimalList
