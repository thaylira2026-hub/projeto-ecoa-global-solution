import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type BotaoLinkProps = {
  to: string
  children: ReactNode
  variante?: 'primario' | 'claro' | 'contorno'
}

const estilos = {
  primario: 'bg-blue-700 text-white hover:bg-blue-800',
  claro: 'bg-white text-blue-700 hover:bg-blue-50',
  contorno: 'border-2 border-white text-white hover:bg-blue-600',
}

export default function BotaoLink({ to, children, variante = 'primario' }: BotaoLinkProps) {
  return (
    <Link
      to={to}
      className={`inline-block rounded-xl px-6 py-4 text-center text-lg font-bold ${estilos[variante]}`}
    >
      {children}
    </Link>
  )
}