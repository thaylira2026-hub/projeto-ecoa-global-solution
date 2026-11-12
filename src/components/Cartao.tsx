import type { ReactNode } from 'react'

type CartaoProps = {
  titulo: string
  icone?: string
  children: ReactNode
}

export default function Cartao({ titulo, icone, children }: CartaoProps) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow">
      {icone && (
        <span className="text-4xl" aria-hidden="true">
          {icone}
        </span>
      )}
      <h3 className="mt-2 text-xl font-bold text-blue-700">{titulo}</h3>
      <div className="mt-2 space-y-2 text-lg text-slate-700">{children}</div>
    </article>
  )
}