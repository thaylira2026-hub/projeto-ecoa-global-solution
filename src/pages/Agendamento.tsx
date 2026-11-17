import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import AvisoErro from '../components/AvisoErro'
import BotaoLink from '../components/BotaoLink'
import Carregando from '../components/Carregando'
import TituloPagina from '../components/TituloPagina'
import { iconeDoServico, nomesCategoria } from '../data/icones'
import { ErroRequisicao, mensagemDeErro } from '../services/api'
import { agendarAtendimento } from '../services/atendimentoService'
import { cadastrarCidadao } from '../services/cidadaoService'
import { buscarServico } from '../services/servicoService'
import { listarUnidadesPorServico } from '../services/unidadeService'
import type { Atendimento } from '../types/Atendimento'
import type { Servico } from '../types/Servico'
import type { Unidade } from '../types/Unidade'
import { HORARIOS, dataDeAmanha, formatarDataHora } from '../utils/data'

type DadosAgendamento = {
  nome: string
  telefone: string
  idUnidade: string
  data: string
  horario: string
  aceite: boolean
}

type ErrosAgendamento = Partial<Record<keyof DadosAgendamento, string>>

const dadosIniciais: DadosAgendamento = {
  nome: '',
  telefone: '',
  idUnidade: '',
  data: '',
  horario: '',
  aceite: false,
}

function validar(dados: DadosAgendamento): ErrosAgendamento {
  const erros: ErrosAgendamento = {}
  const digitosTelefone = dados.telefone.replace(/\D/g, '')

  if (dados.nome.trim().length < 3) {
    erros.nome = 'Digite seu nome com pelo menos 3 letras.'
  }
  if (digitosTelefone && (digitosTelefone.length < 10 || digitosTelefone.length > 11)) {
    erros.telefone = 'Digite o telefone com DDD, por exemplo: 11 91234-5678. Ou deixe em branco.'
  }
  if (!dados.idUnidade) {
    erros.idUnidade = 'Escolha a unidade onde quer ser atendido.'
  }
  if (!dados.data) {
    erros.data = 'Escolha o dia do atendimento.'
  } else if (dados.data < dataDeAmanha()) {
    erros.data = 'Escolha uma data a partir de amanhã.'
  }
  if (!dados.horario) {
    erros.horario = 'Escolha um horário.'
  }
  if (!dados.aceite) {
    erros.aceite = 'Marque a caixa para concordar com o uso dos seus dados.'
  }
  return erros
}

function MensagemCampo({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null
  return (
    <p id={id} className="mt-1 text-red-700">
      {texto}
    </p>
  )
}

const estiloCampo = (temErro: boolean) =>
  `mt-2 w-full rounded-2xl border-2 bg-white px-4 py-3 text-lg placeholder:text-tinta/40 ${
    temErro ? 'border-red-600' : 'border-tinta/15 focus:border-mare'
  }`

export default function Agendamento() {
  const { servicoId } = useParams()
  const idServico = Number(servicoId)
  const idValido = Number.isInteger(idServico) && idServico > 0

  const [servico, setServico] = useState<Servico | null>(null)
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [carregando, setCarregando] = useState(idValido)
  const [erroCarga, setErroCarga] = useState(idValido ? '' : 'Serviço não encontrado.')
  const [tentativa, setTentativa] = useState(0)

  const [dados, setDados] = useState<DadosAgendamento>(dadosIniciais)
  const [erros, setErros] = useState<ErrosAgendamento>({})
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState('')
  const [idCidadao, setIdCidadao] = useState<number | null>(null)
  const [agendado, setAgendado] = useState<Atendimento | null>(null)

  useEffect(() => {
    if (!idValido) return
    let ativo = true
    Promise.all([buscarServico(idServico), listarUnidadesPorServico(idServico)])
      .then(([servicoEncontrado, listaUnidades]) => {
        if (!ativo) return
        setServico(servicoEncontrado)
        setUnidades(listaUnidades)
      })
      .catch((problema: unknown) => {
        if (ativo) setErroCarga(mensagemDeErro(problema))
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => {
      ativo = false
    }
  }, [idServico, idValido, tentativa])

  function tentarDeNovo() {
    setErroCarga('')
    setCarregando(true)
    setTentativa(tentativa + 1)
  }

  function atualizarCampo(evento: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = evento.target
    const valor =
      evento.target instanceof HTMLInputElement && evento.target.type === 'checkbox'
        ? evento.target.checked
        : value
    setDados({ ...dados, [name]: valor })
    setErros({ ...erros, [name]: undefined })
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const errosEncontrados = validar(dados)
    setErros(errosEncontrados)
    if (Object.keys(errosEncontrados).length > 0) return

    setEnviando(true)
    setErroEnvio('')
    try {
      let id = idCidadao
      if (id === null) {
        const digitos = dados.telefone.replace(/\D/g, '')
        const cidadao = await cadastrarCidadao({
          nome: dados.nome.trim(),
          telefone: digitos || undefined,
        })
        id = cidadao.id
        setIdCidadao(cidadao.id)
      }

      const atendimento = await agendarAtendimento(id, {
        idServico,
        idUnidade: Number(dados.idUnidade),
        dataHora: `${dados.data}T${dados.horario}:00`,
      })
      setAgendado(atendimento)
    } catch (problema: unknown) {
      if (problema instanceof ErroRequisicao && problema.status === 409) {
        setErros({ horario: problema.message })
      } else {
        setErroEnvio(mensagemDeErro(problema))
      }
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) {
    return <Carregando texto="Carregando o agendamento..." />
  }

  if (erroCarga || !servico) {
    return (
      <AvisoErro mensagem={erroCarga || 'Serviço não encontrado.'} onTentarDeNovo={idValido ? tentarDeNovo : undefined}>
        <BotaoLink to="/servicos" variante="secundario">
          Ver todos os serviços
        </BotaoLink>
      </AvisoErro>
    )
  }

  if (agendado) {
    const unidade = unidades.find((item) => item.id === agendado.idUnidade)
    return (
      <section
        aria-labelledby="titulo-confirmacao"
        className="mx-auto max-w-3xl rounded-3xl border border-tinta/10 bg-white p-8 text-center md:p-12"
      >
        <span className="text-6xl" aria-hidden="true">
          ✅
        </span>
        <h1 id="titulo-confirmacao" className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
          Atendimento agendado!
        </h1>
        <p role="status" className="mt-3 text-lg text-tinta/80">
          Guarde o número do protocolo. Com ele, você acompanha sua vez pelo celular.
        </p>
        <p className="mt-8 text-lg text-tinta/70">Protocolo</p>
        <p className="text-6xl font-extrabold text-mare">{agendado.id}</p>

        <dl className="mx-auto mt-8 grid max-w-xl gap-4 text-left sm:grid-cols-2">
          <div className="rounded-2xl bg-nevoa p-4">
            <dt className="text-tinta/70">Serviço</dt>
            <dd className="text-lg font-semibold">{servico.nome}</dd>
          </div>
          <div className="rounded-2xl bg-nevoa p-4">
            <dt className="text-tinta/70">Quando</dt>
            <dd className="text-lg font-semibold">{formatarDataHora(agendado.dataHora)}</dd>
          </div>
          {unidade && (
            <div className="rounded-2xl bg-nevoa p-4 sm:col-span-2">
              <dt className="text-tinta/70">Onde</dt>
              <dd className="text-lg font-semibold">
                {unidade.nome}, {unidade.endereco}, {unidade.bairro}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <BotaoLink to={`/atendimento/${agendado.id}`}>Acompanhar meu atendimento</BotaoLink>
          <BotaoLink to={`/servicos/${servico.id}`} variante="secundario">
            Ver os documentos
          </BotaoLink>
        </div>
      </section>
    )
  }

  return (
    <div>
      <Link
        to={`/servicos/${servico.id}`}
        className="mb-6 inline-block font-semibold text-mare underline underline-offset-4 hover:text-tinta"
      >
        Voltar para o serviço
      </Link>

      <TituloPagina
        etiqueta={nomesCategoria[servico.categoria]}
        icone={iconeDoServico(servico.pictograma)}
        titulo="Agendar atendimento"
        descricao={`${servico.nome}. Escolha a unidade, o dia e o horário. Não precisa ligar para ninguém.`}
      />

      {erroEnvio && (
        <div className="mb-8">
          <AvisoErro mensagem={erroEnvio} />
        </div>
      )}

      <form
        onSubmit={enviar}
        noValidate
        className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-tinta/10 bg-white p-6 md:p-10"
      >
        <p className="text-tinta/70">Os campos com * são obrigatórios.</p>

        <fieldset aria-describedby={erros.idUnidade ? 'erro-unidade' : undefined}>
          <legend className="text-xl font-bold">Unidade de atendimento *</legend>
          {unidades.length === 0 ? (
            <p className="mt-3 text-lg text-tinta/80">
              Nenhuma unidade oferece este serviço no momento. Tente outro serviço.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {unidades.map((unidade) => (
                <label
                  key={unidade.id}
                  className={`flex cursor-pointer gap-3 rounded-2xl border-2 p-4 ${
                    dados.idUnidade === String(unidade.id)
                      ? 'border-mare bg-mare-clara/40'
                      : 'border-tinta/15 hover:border-mare'
                  }`}
                >
                  <input
                    type="radio"
                    name="idUnidade"
                    value={unidade.id}
                    checked={dados.idUnidade === String(unidade.id)}
                    onChange={atualizarCampo}
                    className="mt-1 h-5 w-5 shrink-0 accent-mare"
                  />
                  <span>
                    <span className="block text-lg font-semibold">{unidade.nome}</span>
                    <span className="block text-tinta/70">
                      {unidade.endereco}, {unidade.bairro}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}
          <MensagemCampo id="erro-unidade" texto={erros.idUnidade} />
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="data" className="font-semibold">
              Dia *
            </label>
            <input
              id="data"
              name="data"
              type="date"
              min={dataDeAmanha()}
              value={dados.data}
              onChange={atualizarCampo}
              aria-required="true"
              aria-invalid={Boolean(erros.data)}
              aria-describedby={erros.data ? 'erro-data' : undefined}
              className={estiloCampo(Boolean(erros.data))}
            />
            <MensagemCampo id="erro-data" texto={erros.data} />
          </div>

          <div>
            <label htmlFor="horario" className="font-semibold">
              Horário *
            </label>
            <select
              id="horario"
              name="horario"
              value={dados.horario}
              onChange={atualizarCampo}
              aria-required="true"
              aria-invalid={Boolean(erros.horario)}
              aria-describedby={erros.horario ? 'erro-horario' : undefined}
              className={estiloCampo(Boolean(erros.horario))}
            >
              <option value="">Escolha um horário</option>
              {HORARIOS.map((horario: string) => (
                <option key={horario} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
            <MensagemCampo id="erro-horario" texto={erros.horario} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="nome" className="font-semibold">
              Nome completo *
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              autoComplete="name"
              placeholder="Seu nome"
              value={dados.nome}
              onChange={atualizarCampo}
              aria-required="true"
              aria-invalid={Boolean(erros.nome)}
              aria-describedby={erros.nome ? 'erro-nome' : undefined}
              className={estiloCampo(Boolean(erros.nome))}
            />
            <MensagemCampo id="erro-nome" texto={erros.nome} />
          </div>

          <div>
            <label htmlFor="telefone" className="font-semibold">
              Telefone (opcional)
            </label>
            <input
              id="telefone"
              name="telefone"
              type="tel"
              autoComplete="tel"
              placeholder="11 91234-5678"
              value={dados.telefone}
              onChange={atualizarCampo}
              aria-invalid={Boolean(erros.telefone)}
              aria-describedby={erros.telefone ? 'erro-telefone' : 'dica-telefone'}
              className={estiloCampo(Boolean(erros.telefone))}
            />
            {erros.telefone ? (
              <MensagemCampo id="erro-telefone" texto={erros.telefone} />
            ) : (
              <p id="dica-telefone" className="mt-1 text-tinta/70">
                Não tem celular? Pode deixar em branco.
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="aceite" className="flex items-start gap-3 text-tinta/80">
            <input
              id="aceite"
              name="aceite"
              type="checkbox"
              checked={dados.aceite}
              onChange={atualizarCampo}
              aria-invalid={Boolean(erros.aceite)}
              aria-describedby={erros.aceite ? 'erro-aceite' : undefined}
              className="mt-1 h-5 w-5 shrink-0 accent-mare"
            />
            Concordo que meus dados serão usados somente para este atendimento, conforme a LGPD.
          </label>
          <MensagemCampo id="erro-aceite" texto={erros.aceite} />
        </div>

        <button
          type="submit"
          disabled={enviando || unidades.length === 0}
          className="w-full rounded-full bg-mare px-6 py-4 text-lg font-semibold text-white hover:bg-tinta disabled:opacity-50"
        >
          {enviando ? 'Agendando...' : 'Confirmar agendamento'}
        </button>
      </form>
    </div>
  )
}