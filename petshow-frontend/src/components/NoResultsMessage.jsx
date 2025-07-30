// src/components/NoResultsMessage.jsx
import React from "react"
// import '../App.css'; // Pode usar App.css ou um arquivo específico para mensagens

function NoResultsMessage({ message }) {
  return (
    <p
      className="no-results-message"
      style={{ textAlign: "center", margin: "20px 0", color: "#555" }}
    >
      {message}
    </p>
  )
}

export default NoResultsMessage
