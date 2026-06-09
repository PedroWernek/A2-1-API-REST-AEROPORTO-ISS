import { Plane, Calendar, Users, Ticket } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { routes } from "../../routes/route-config"

export function Sidebar() {
  const location = useLocation() // Pega a URL atual para saber qual menu está ativo

  const navItems = [
    { path: routes.voos, label: "Voos", icon: Calendar },
    { path: routes.passagens, label: "Passagens", icon: Ticket },
    { path: routes.passageiros, label: "Passageiros", icon: Users },
    { path: routes.aeronaves, label: "Aeronaves", icon: Plane },
  ]

  return (
    <aside className="fixed top-0 left-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-50">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          AeroCWB
        </h1>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname.includes(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-200 text-slate-900" // Cor do item ativo
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
