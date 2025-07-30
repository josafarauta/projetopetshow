// src/App.jsx
import React from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { ToastContainer } from "react-toastify" // <-- NOVO IMPORT: ToastContainer
import "react-toastify/dist/ReactToastify.css" // <-- NOVO IMPORT: CSS do react-toastify
import "./App.css"

// Importa os componentes de página e formulário para Animais
import HomePage from "./components/HomePage"
import AnimalList from "./components/AnimalList"
import AnimalForm from "./components/AnimalForm"

// Importa os componentes de página e formulário para Veterinários
import VeterinarioList from "./components/VeterinarioList"
import VeterinarioForm from "./components/VeterinarioForm"

// Importa os componentes de página e formulário para Consultas
import ConsultaList from "./components/ConsultaList"
import ConsultaForm from "./components/ConsultaForm"

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Clínica Veterinária PetShow</h1>
        </header>

        <nav>
          <ul>
            <li>
              <Link to="/">Início</Link>
            </li>
            <li>
              <Link to="/animais">Animais</Link>
            </li>
            <li>
              <Link to="/animais/novo">Adicionar Animal</Link>
            </li>
            <li>
              <Link to="/veterinarios">Veterinários</Link>
            </li>
            <li>
              <Link to="/veterinarios/novo">Adicionar Veterinário</Link>
            </li>
            <li>
              <Link to="/consultas">Consultas</Link>
            </li>
            <li>
              <Link to="/consultas/novo">Agendar Consulta</Link>
            </li>
          </ul>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/animais" element={<AnimalList />} />
            <Route path="/animais/novo" element={<AnimalForm />} />
            <Route path="/animais/editar/:id" element={<AnimalForm />} />
            <Route path="/veterinarios" element={<VeterinarioList />} />
            <Route path="/veterinarios/novo" element={<VeterinarioForm />} />
            <Route
              path="/veterinarios/editar/:id"
              element={<VeterinarioForm />}
            />
            <Route path="/consultas" element={<ConsultaList />} />
            <Route path="/consultas/novo" element={<ConsultaForm />} />
            <Route path="/consultas/editar/:id" element={<ConsultaForm />} />
          </Routes>
        </main>

        {/* ToastContainer: Onde as notificações de sucesso/erro serão exibidas */}
        <ToastContainer
          position="bottom-right" // Posição na tela
          autoClose={3000} // Fecha automaticamente após 3 segundos
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" // Tema claro ou escuro
        />
      </div>
    </Router>
  )
}

export default App
