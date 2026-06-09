import { Outlet } from "react-router-dom"
import { Sidebar } from "./sistem-sidebar"

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />

      {/* O conteúdo principal empurra a margem para não ficar embaixo da Sidebar fixa */}
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-6xl">
          {/* O Outlet é a "janela" onde o React Router vai renderizar a página atual */}
          <Outlet />
        </div>
      </main>
    </div>
  )
}
