import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Início' },
  { to: '/solucao', label: 'Solução' },
  { to: '/servicos', label: 'Serviços' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/integrantes', label: 'Integrantes' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contato', label: 'Contato' },
]

export default function Header() {
  const [aberto, setAberto] = useState(false)

  const estiloLink = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-4 py-3 text-lg font-medium ${
      isActive ? 'bg-white text-blue-700' : 'text-white hover:bg-blue-600'
    }`

  return (
    <header className="relative bg-blue-700">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="text-2xl font-bold text-white" onClick={() => setAberto(false)}>
          Ecoa+
        </NavLink>

        <button
          type="button"
          className="rounded-lg p-2 text-white lg:hidden"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setAberto(!aberto)}
        >
          <span className="text-3xl" aria-hidden="true">
            {aberto ? '✕' : '☰'}
          </span>
        </button>

        <nav
          id="menu-principal"
          aria-label="Menu principal"
          className={`${aberto ? 'block' : 'hidden'} absolute left-0 top-full z-10 w-full bg-blue-700 px-4 pb-4 lg:static lg:block lg:w-auto lg:p-0`}
        >
          <ul className="flex flex-col gap-1 lg:flex-row">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={estiloLink}
                  onClick={() => setAberto(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}