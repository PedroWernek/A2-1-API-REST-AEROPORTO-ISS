import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { routes } from "./routes/route-config"
import { AppShell } from "./components/layout/app-shell"
import { Toaster } from "./components/ui/sonner" // <-- 1. Adicione a importação

// Importação das suas páginas...
import { AeronavesPage } from "./pages/AeronavesPage"
import { VoosPage } from "./pages/VoosPage"
import { PassageirosPage } from "./pages/PassageirosPage"
import { PassagensPage } from "./pages/PassagensPage"

export default function App() {
  return (
    <BrowserRouter>
      {/* 2. Coloque o Toaster fora das rotas para ele existir sempre */}
      <Toaster position="top-right" richColors />

      <Routes>
        <Route element={<AppShell />}>
          <Route
            path="/"
            element={<Navigate to={routes.aeronaves} replace />}
          />
          <Route path={routes.aeronaves} element={<AeronavesPage />} />
          <Route path={routes.voos} element={<VoosPage />} />
          <Route path={routes.passageiros} element={<PassageirosPage />} />
          <Route path={routes.passagens} element={<PassagensPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
