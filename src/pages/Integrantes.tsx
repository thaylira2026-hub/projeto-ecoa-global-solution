import TituloPagina from '../components/TituloPagina'
import { integrantes } from '../data/integrante'

function iniciais(nome: string) {
  const partes = nome.split(' ')
  const primeira = partes[0]?.[0] ?? ''
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}

export default function Integrantes() {
  return (
    <section>
      <TituloPagina titulo="Integrantes" descricao="Equipe Inova Lab, responsável pelo Ecoa+." />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrantes.map((integrante) => (
          <li key={integrante.github} className="rounded-2xl bg-white p-6 text-center shadow">
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-700 text-2xl font-bold text-white"
              aria-hidden="true"
            >
              {iniciais(integrante.nome)}
            </div>
            <h2 className="mt-4 text-xl font-bold">{integrante.nome}</h2>
            <p className="text-slate-700">
              {integrante.rm} · {integrante.turma}
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <a
                href={integrante.github}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-700 underline"
              >
                GitHub
              </a>
              {integrante.linkedin && (
                <a
                  href={integrante.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-blue-700 underline"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}