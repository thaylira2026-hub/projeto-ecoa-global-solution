import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import AvisoErro from '../components/AvisoErro'
import BotaoLink from '../components/BotaoLink'
import Carregando from '../components/Carregando'
import TituloPagina from '../components/TituloPagina'
import { mensagemDeErro } from '../services/api'
import { buscarAtendimento } from '../services/atendimentoService'
import { buscarServico } from '../services/servicoService'
import { buscarUnidade } from '../services/unidadeService'
import type { Atendimento, StatusAtendimento } from '../types/Atendimento'
import type { Servico } from '../types/Servico'
import type { Unidade } from '../types/Unidade'
import { formatarDataHora } from '../utils/data'

const INTERVALO_ATUALIZACAO = 5000 // de 5 em 5 segundos

// Aviso que não depende de som: vibra o celular e muda o título da aba
function avisarQueChegouAVez() {
  if ('vibrate' in navigator) {
    navigator.vibrate([500, 200, 500, 200, 500])
  }
  document.title = 'Chegou a sua vez! | Ecoa+'
}

export default function Acompanhar() {
  const { id } = useParams()
  const idAtendimento = Number(id)
  const idValido = Number.isInteger(idAtendimento) && idAtendimento > 0

  const [atendimento, setAtendimento] = useState<Atendimento | null>(null)
  const [servico, setServico] = useState<Servico | null>(null)
  const [unidade, setUnidade] = useState<Unidade | null>(null)
  const [carregando, setCarregando] = useState(idValido)
  const [erro, setErro] = useState(idValido ? '' : 'Atendimento não encontrado.')
  const [vibracaoTestada, setVibracaoTestada] = useState(false)
  const statusAnterior = useRef<StatusAtendimento | null>(null)

  const idServico = atendimento?.idServico
  const idUnidade = atendimento?.idUnidade

  // Consulta o atendimento na API (GET /atendimentos/{id}) a cada 5 segundos
  useEffect(() => {
    if (!idValido) return
    let ativo = true

    async function atualizar() {
      try {
        const atual = await buscarAtendimento(idAtendimento)
        if (!ativo) return
        setAtendimento(atual)
        setErro('')
        if (atual.status === 'CHAMADO' && statusAnterior.current !== 'CHAMADO') {
          avisarQueChegouAVez()
        }
        statusAnterior.current = atual.status
      } catch (problema: unknown) {
        if (ativo) setErro(mensagemDeErro(problema))
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    atualizar()
    const intervalo = setInterval(atualizar, INTERVALO_ATUALIZACAO)
    return () => {
      ativo = false
      clearInterval(intervalo)
      document.title = 'Ecoa+'
    }
  }, [idAtendimento, idValido])

  // Busca o nome do serviço e da unidade, só para mostrar na tela
  useEffect(() => {
    if (idServico === undefined || idUnidade === undefined) return
    let ativo = true
    buscarServico(idServico)
      .then((resultado) => {
        if (ativo) setServico(resultado)
      })
      .catch(() => {})
    buscarUnidade(idUnidade)
      .then((resultado) => {
        if (ativo) setUnidade(resultado)
      })
      .catch(() => {})
    return () => {
      ativo = false
    }
  }, [idServico, idUnidade])

  function testarVibracao() {
    if ('vibrate' in navigator) navigator.vibrate(300)
    setVibracaoTestada(true)
  }

  if (carregando) {
    return <Carregando texto="Buscando o seu atendimento..." />
  }

  if (!atendimento) {
    return (
      <AvisoErro mensagem={erro || 'Atendimento não encontrado.'}>
        <BotaoLink to="/servicos" variante="secundario">
          Ver os serviços
        </BotaoLink>
      </AvisoErro>
    )
  }

  const chamado = atendimento.status === 'CHAMADO'

  return (
    <div>
      <TituloPagina
        etiqueta={`Protocolo ${atendimento.id}`}
        icone="📳"
        titulo="Acompanhar atendimento"
        descricao="Deixe esta página aberta. Quando chegar a sua vez, a tela pisca e o celular vibra. Ninguém vai chamar seu nome em voz alta."
      />

      {erro && (
        <p role="alert" className="mx-auto mb-6 max-w-3xl rounded-2xl bg-white p-4 text-lg text-red-700">
          Não conseguimos atualizar agora: {erro} Vamos tentar de novo sozinhos.
        </p>
      )}

      {chamado && (
        <section
          role="alert"
          className="mx-auto max-w-3xl rounded-3xl bg-sinal p-10 text-center text-tinta motion-safe:animate-piscar md:p-14"
        >
          <span className="text-7xl" aria-hidden="true">
            📳
          </span>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
            Chegou a sua vez!
          </h2>
          <p className="mt-4 text-xl md:text-2xl">
            Vá até o balcão de atendimento{unidade ? ` da ${unidade.nome}` : ''}.
          </p>
        </section>
      )}

      {atendimento.status === 'AGENDADO' && (
        <section className="mx-auto max-w-3xl rounded-3xl border border-tinta/10 bg-white p-8 text-center md:p-12">
          <span
            className="mx-auto block h-12 w-12 rounded-full border-4 border-mare-clara border-t-mare motion-safe:animate-spin"
            aria-hidden="true"
          />
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight">Aguardando a sua vez</h2>
          <p className="mt-3 text-lg text-tinta/80">
            Esta página se atualiza sozinha a cada 5 segundos.
          </p>
          <button
            type="button"
            onClick={testarVibracao}
            className="mt-6 rounded-full border-2 border-tinta px-6 py-3 text-lg font-semibold hover:bg-tinta hover:text-white"
          >
            {vibracaoTestada ? 'Vibração ativada' : 'Testar a vibração do celular'}
          </button>
          <p className="mt-2 text-tinta/70">
            Alguns celulares só vibram depois que você toca na tela uma vez.
          </p>
        </section>
      )}

      {atendimento.status === 'CONCLUIDO' && (
        <AvisoErro mensagem="Este atendimento já foi concluído. Obrigado por usar o Ecoa+!" />
      )}

      {atendimento.status === 'CANCELADO' && (
        <AvisoErro mensagem="Este atendimento foi cancelado. Você pode fazer um novo agendamento.">
          <BotaoLink to="/servicos">Agendar de novo</BotaoLink>
        </AvisoErro>
      )}

      <dl className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-tinta/10 bg-white p-4">
          <dt className="text-tinta/70">Serviço</dt>
          <dd className="text-lg font-semibold">{servico?.nome ?? '...'}</dd>
        </div>
        <div className="rounded-2xl border border-tinta/10 bg-white p-4">
          <dt className="text-tinta/70">Unidade</dt>
          <dd className="text-lg font-semibold">{unidade?.nome ?? '...'}</dd>
        </div>
        <div className="rounded-2xl border border-tinta/10 bg-white p-4">
          <dt className="text-tinta/70">Horário</dt>
          <dd className="text-lg font-semibold">{formatarDataHora(atendimento.dataHora)}</dd>
        </div>
      </dl>
    </div>
  )
}