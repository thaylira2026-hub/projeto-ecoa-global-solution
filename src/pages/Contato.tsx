import { useState } from 'react'
import type { FormEvent } from 'react'
import TituloPagina from '../components/TituloPagina'

type DadosContato = {
  nome: string
  email: string
  mensagem: string
}

type ErrosContato = Partial<Record<keyof DadosContato, string>>

const dadosIniciais: DadosContato = { nome: '', email: '', mensagem: '' }

function validar(dados: DadosContato): ErrosContato {
  const erros: ErrosContato = {}
  if (dados.nome.trim().length < 3) {
    erros.nome = 'Digite seu nome com pelo menos 3 letras.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
    erros.email = 'Digite um e-mail válido, por exemplo: nome@email.com.'
  }
  if (dados.mensagem.trim().length < 10) {
    erros.mensagem = 'Escreva uma mensagem com pelo menos 10 caracteres.'
  }
  return erros
}

export default function Contato() {
  const [dados, setDados] = useState<DadosContato>(dadosIniciais)
  const [erros, setErros] = useState<ErrosContato>({})
  const [enviado, setEnviado] = useState(false)

  function atualizarCampo(campo: keyof DadosContato, valor: string) {
    setDados({ ...dados, [campo]: valor })
    setEnviado(false)
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const errosEncontrados = validar(dados)
    setErros(errosEncontrados)
    if (Object.keys(errosEncontrados).length === 0) {
      setEnviado(true)
      setDados(dadosIniciais)
    }
  }

  const estiloCampo = (temErro: boolean) =>
    `mt-1 w-full rounded-xl border-2 p-3 text-lg ${temErro ? 'border-red-600' : 'border-slate-300'}`

  return (
    <section>
      <TituloPagina
        titulo="Contato"
        descricao="Tem uma dúvida ou sugestão? Escreva para a equipe do Ecoa+."
      />

      {enviado && (
        <p role="status" className="mb-6 rounded-xl bg-green-100 p-4 text-lg font-semibold text-green-800">
          Mensagem enviada! Vamos responder no seu e-mail.
        </p>
      )}

      <form onSubmit={enviar} noValidate className="max-w-xl space-y-5 rounded-2xl bg-white p-6 shadow">
        <div>
          <label htmlFor="nome" className="text-lg font-semibold">
            Nome
          </label>
          <input
            id="nome"
            type="text"
            value={dados.nome}
            onChange={(e) => atualizarCampo('nome', e.target.value)}
            aria-invalid={Boolean(erros.nome)}
            aria-describedby={erros.nome ? 'erro-nome' : undefined}
            className={estiloCampo(Boolean(erros.nome))}
          />
          {erros.nome && (
            <p id="erro-nome" className="mt-1 text-red-700">
              {erros.nome}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="text-lg font-semibold">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={dados.email}
            onChange={(e) => atualizarCampo('email', e.target.value)}
            aria-invalid={Boolean(erros.email)}
            aria-describedby={erros.email ? 'erro-email' : undefined}
            className={estiloCampo(Boolean(erros.email))}
          />
          {erros.email && (
            <p id="erro-email" className="mt-1 text-red-700">
              {erros.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="mensagem" className="text-lg font-semibold">
            Mensagem
          </label>
          <textarea
            id="mensagem"
            rows={5}
            value={dados.mensagem}
            onChange={(e) => atualizarCampo('mensagem', e.target.value)}
            aria-invalid={Boolean(erros.mensagem)}
            aria-describedby={erros.mensagem ? 'erro-mensagem' : undefined}
            className={estiloCampo(Boolean(erros.mensagem))}
          />
          {erros.mensagem && (
            <p id="erro-mensagem" className="mt-1 text-red-700">
              {erros.mensagem}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-700 px-6 py-4 text-lg font-bold text-white hover:bg-blue-800"
        >
          Enviar mensagem
        </button>
      </form>
    </section>
  )
}