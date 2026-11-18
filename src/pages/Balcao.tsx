import { useState } from 'react'
import type { FormEvent } from 'react'
import TituloPagina from '../components/TituloPagina'
import { useReconhecimentoFala } from '../hooks/useReconhecimentoFala'
import { mensagemDeErro } from '../services/api'
import { buscarAtendimento, chamarAtendimento } from '../services/atendimentoService'
import type { Atendimento } from '../types/Atendimento'
import { formatarDataHora } from '../utils/data'

const nomesStatus: Record<Atendimento['status'], string> = {
  AGENDADO: 'Aguardando',
  CHAMADO: 'Já foi chamado',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
}

const estiloBotao = 'rounded-full px-6 py-3 text-lg font-semibold disabled:opacity-50'

function LegendaAoVivo() {
  const { suportado, ouvindo, textoFinal, textoParcial, erro, iniciar, parar, limpar } =
    useReconhecimentoFala()

  // Mostra só o fim da conversa, para a letra continuar grande
  const textoNaTela = `${textoFinal} ${textoParcial}`.trim().slice(-280)

  return (
    <section aria-labelledby="titulo-legenda" className="rounded-3xl border border-tinta/10 bg-white p-6 md:p-10">
      <h2 id="titulo-legenda" className="text-3xl font-extrabold tracking-tight">
        Legenda ao vivo
      </h2>
      <p className="mt-2 text-lg text-tinta/80">
        Fale normalmente: o texto aparece em letras grandes para o cidadão ler. Selecione o texto e use o
        VLibras para ver em Libras.
      </p>

      {!suportado ? (
        <p role="alert" className="mt-6 rounded-2xl bg-nevoa p-4 text-lg">
          Este navegador não tem reconhecimento de fala. Abra o balcão no Google Chrome ou no Microsoft Edge.
        </p>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-3">
            {!ouvindo ? (
              <button type="button" onClick={iniciar} className={`${estiloBotao} bg-mare text-white hover:bg-tinta`}>
                Começar a legenda
              </button>
            ) : (
              <button type="button" onClick={parar} className={`${estiloBotao} bg-tinta text-white hover:bg-mare`}>
                Parar a legenda
              </button>
            )}
            <button
              type="button"
              onClick={limpar}
              disabled={!textoNaTela}
              className={`${estiloBotao} border-2 border-tinta hover:bg-tinta hover:text-white`}
            >
              Limpar
            </button>
          </div>

          {erro && (
            <p role="alert" className="mt-4 text-lg text-red-700">
              {erro}
            </p>
          )}

          <div
            aria-live="polite"
            className="mt-6 flex min-h-56 items-end rounded-3xl bg-tinta p-6 text-3xl font-semibold leading-snug text-white md:text-5xl"
          >
            {textoNaTela || (
              <span className="text-white/60">
                {ouvindo ? 'Ouvindo... pode falar.' : 'A legenda aparece aqui.'}
              </span>
            )}
          </div>
        </>
      )}
    </section>
  )
}

function ChamarPessoa() {
  const [protocolo, setProtocolo] = useState('')
  const [atendimento, setAtendimento] = useState<Atendimento | null>(null)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setMensagem('')
    setAtendimento(null)
    const numero = Number(protocolo)
    if (!Number.isInteger(numero) || numero <= 0) {
      setErro('Digite o número do protocolo, por exemplo: 12.')
      return
    }
    setErro('')
    setCarregando(true)
    try {
      setAtendimento(await buscarAtendimento(numero))
    } catch (problema: unknown) {
      setErro(mensagemDeErro(problema))
    } finally {
      setCarregando(false)
    }
  }

  async function chamar() {
    if (!atendimento) return
    setCarregando(true)
    setErro('')
    try {
      // PUT /atendimentos/{id} com status CHAMADO
      const atualizado = await chamarAtendimento(atendimento)
      setAtendimento(atualizado)
      setMensagem(`Protocolo ${atualizado.id} chamado. O celular da pessoa vai vibrar.`)
    } catch (problema: unknown) {
      setErro(mensagemDeErro(problema))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section aria-labelledby="titulo-chamar" className="rounded-3xl border border-tinta/10 bg-white p-6 md:p-10">
      <h2 id="titulo-chamar" className="text-3xl font-extrabold tracking-tight">
        Chamar a próxima pessoa
      </h2>
      <p className="mt-2 text-lg text-tinta/80">
        Em vez de chamar o nome em voz alta, digite o protocolo. A tela da pessoa pisca e o celular vibra.
      </p>

      <form onSubmit={buscar} noValidate className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="protocolo" className="font-semibold">
            Número do protocolo
          </label>
          <input
            id="protocolo"
            type="text"
            inputMode="numeric"
            value={protocolo}
            onChange={(evento) => setProtocolo(evento.target.value)}
            aria-invalid={Boolean(erro)}
            aria-describedby={erro ? 'erro-protocolo' : undefined}
            className="mt-2 w-full rounded-2xl border-2 border-tinta/15 bg-white px-4 py-3 text-lg focus:border-mare"
          />
        </div>
        <button type="submit" disabled={carregando} className={`${estiloBotao} bg-tinta text-white hover:bg-mare`}>
          Buscar
        </button>
      </form>

      {erro && (
        <p id="erro-protocolo" role="alert" className="mt-3 text-lg text-red-700">
          {erro}
        </p>
      )}

      {atendimento && (
        <div className="mt-6 rounded-2xl bg-nevoa p-5">
          <p className="text-lg">
            <span className="font-semibold">Protocolo {atendimento.id}</span> ·{' '}
            {formatarDataHora(atendimento.dataHora)}
          </p>
          <p className="mt-1 text-tinta/80">Situação: {nomesStatus[atendimento.status]}</p>
          <button
            type="button"
            onClick={chamar}
            disabled={carregando || atendimento.status !== 'AGENDADO'}
            className={`${estiloBotao} mt-4 bg-sinal text-tinta hover:bg-white`}
          >
            Chamar esta pessoa
          </button>
        </div>
      )}

      {mensagem && (
        <p role="status" className="mt-4 rounded-2xl bg-mare-clara p-4 text-lg font-semibold text-mare">
          {mensagem}
        </p>
      )}
    </section>
  )
}

export default function Balcao() {
  return (
    <div>
      <TituloPagina
        etiqueta="Área do atendente"
        icone="🧑‍💼"
        titulo="Balcão de atendimento"
        descricao="Para o servidor da unidade: converse com legenda ao vivo e chame cada pessoa sem depender da voz."
      />
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <LegendaAoVivo />
        <ChamarPessoa />
      </div>
    </div>
  )
}