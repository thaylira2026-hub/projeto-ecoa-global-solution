import TituloPagina from '../components/TituloPagina'
import { integrantes } from '../data/integrante'
import type { Integrante } from '../types/Integrante'

function iniciais(nome: string) {
  const partes = nome.split(' ')
  const primeira = partes[0]?.[0] ?? ''
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}

function FotoIntegrante({ integrante }: { integrante: Integrante }) {
  const estilo = 'mx-auto h-44 w-44 rounded-full ring-4 ring-mare-clara ring-offset-4'

  if (integrante.foto) {
    return (
      <img
        src={integrante.foto}
        alt={`Foto de ${integrante.nome}`}
        className={`${estilo} object-cover`}
      />
    )
  }

  return (
    <div
      className={`${estilo} flex items-center justify-center bg-mare text-4xl font-extrabold text-white`}
      aria-hidden="true"
    >
      {iniciais(integrante.nome)}
    </div>
  )
}

export default function Integrantes() {
  return (
    <div>
      <TituloPagina
        etiqueta="Nossa equipe"
        icone="👥"
        titulo="Quem somos"
        destaque="Integrantes"
        descricao="Conheça a equipe da Inova Lab que criou o Ecoa+ para tornar os serviços públicos acessíveis a pessoas surdas e com deficiência auditiva."
      />

      <section aria-labelledby="titulo-turma" className="text-center">
        <h2 id="titulo-turma" className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Turma: <span className="text-mare">1TDSR-2026</span>
        </h2>
        <p className="mt-3 text-lg text-tinta/70">
          FIAP · Análise e Desenvolvimento de Sistemas · Global Solution 2026
        </p>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {integrantes.map((integrante) => (
            <li
              key={integrante.github}
              className="rounded-3xl border border-tinta/10 bg-white px-6 py-8"
            >
              <FotoIntegrante integrante={integrante} />
              <h3 className="mt-6 text-xl font-bold">{integrante.nome}</h3>
              <p className="mt-1 font-semibold text-mare">{integrante.funcao}</p>
              <p className="mt-1 text-tinta/70">{integrante.rm}</p>
              <div className="mt-5 flex justify-center gap-3">
                <a
                  href={integrante.github}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border-2 border-tinta px-4 py-2 font-semibold hover:bg-tinta hover:text-white"
                >
                  GitHub
                </a>
                {integrante.linkedin && (
                  <a
                    href={integrante.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-mare px-4 py-2 font-semibold text-white hover:bg-tinta"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}