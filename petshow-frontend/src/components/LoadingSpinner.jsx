// src/components/LoadingSpinner.jsx
import React from "react"
import "../App.css" // Ou um arquivo CSS específico para o spinner, se preferir

function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
      <p>Carregando...</p>
    </div>
  )
}

export default LoadingSpinner
