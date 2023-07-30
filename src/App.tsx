import React from "react"
import { Helmet } from "react-helmet-async"
import { Navigate, Route, Routes } from "react-router-dom"
import GameWrapper from "./GameWrapper"
import Layout from "./Layout"
import CreateNFT from "./pages/CreateNFT"
import Dashboard from "./pages/Dashboard"
import Footer from "./pages/Footer"
import Game from "./pages/Game"
import Play from "./pages/Play"

const App: React.FC = () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return (
    <>
      <Helmet>
        <title>Hackathon game</title>
        <meta name="description" content="Game" />
        <meta name="theme-color" content="#E6E6FA" />
      </Helmet>
      <Routes>
        <Route path="/" element={<Dashboard isDark={prefersDark} />} />
        <Route path="/game" element={<Game isDark={prefersDark} />} />
        <Route path="/play" element={<Play isDark={prefersDark} />} />
        <Route path="/createnft" element={<Layout footer={<Footer />}><GameWrapper><CreateNFT /></GameWrapper></Layout>} />
        <Route path="*" element={<Navigate to="/" />} />/
      </Routes>
    </>
  )
}

export default App
