import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AvisoErro from '../components/AvisoErro'
import BotaoLink from '../components/BotaoLink'
import Carregando from '../components/Carregando'
import TituloPagina from '../components/TituloPagina'
import { iconeDoDocumento, iconeDoServico, nomesCategoria } from '../data/icones'
import { ErroRequisicao, mensagemDeErro } from '../services/api'
import { buscarServico } from '../services/servicoService'
import type { Servico } from '../types/Servico'

export default function ServicoDetalhe() {
  // Pega o id da URL: /servicos/3 -> "3"
  const { id } = useParams()
  const idServico = Number(id)
  const idValido = Number.isInteger(idServico) && idServico > 0

  const [servico, setServico] = useState<Servico | null>(null)
  const [carregando, setCarregando] = useState(idValido)
  const [erro, setErro] = useState(idValido ? '' : 'Serviço não encontrado.')
  const [naoEncontrado, setNaoEncontrado] = useState(!idValido)
  const [tentativa, setTentativa] = useState(0)

  // Busca o serviço na API (GET /servicos/{id})
  useEffect(() => {
    if (!idValido) return
    let ativo = true
    buscarServico(idServico)
      .then((resultado) => {
        if (ativo) setServico(resultado)
      })
      .catch((problema: unknown) => {
        if (!ativo) return
        setErro(mensagemDeErro(problema))
        // 404: o serviço não existe, então não adianta tentar de novo
        setNaoEncontrado(problema instanceof ErroRequisicao && problema.status === 404)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => {
      ativo = false
    }
  }, [idServico, idValido, tentativa])

  function tentarDeNovo() {
    setErro('')
    setCarregando(true)
    setTentativa(tentativa + 1)
  }

  return (
    <div>
      <Link
        to="/servicos"
        className="mb-6 inline-block font-semibold text-mare underline underline-offset-4 hover:text-tinta"
      >
        Voltar para todos os serviços
      </Link>

      {carregando && <Carregando texto="Carregando o serviço..." />}

      {!carregando && erro && (
        <AvisoErro mensagem={erro} onTentarDeNovo={naoEncontrado ? undefined : tentarDeNovo}>
          <BotaoLink to="/servicos" variante="secundario">
            Ver todos os serviços
          </BotaoLink>
        </AvisoErro>
      )}

      {!carregando && !erro && servico && (
        <>
          <TituloPagina
            etiqueta={nomesCategoria[servico.categoria]}
            icone={iconeDoServico(servico.pictograma)}
            titulo={servico.nome}
            descricao={servico.descricao}
          />

          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <section aria-labelledby="titulo-documentos">
              <h2 id="titulo-documentos" className="text-3xl font-extrabold tracking-tight">
                O que levar
              </h2>
              {servico.documentos && servico.documentos.length > 0 ? (
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {servico.documentos.map((documento) => (
                    <li
                      key={documento}
                      className="flex items-center gap-4 rounded-2xl border border-tinta/10 bg-white p-4"
                    >
                      <span
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-mare-clara text-3xl"
                        aria-hidden="true"
                      >
                        {iconeDoDocumento(documento)}
                      </span>
                      <span className="text-lg font-semibold">{documento}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-lg text-tinta/80">
                  Confirme os documentos necessários com a unidade de atendimento.
                </p>
              )}
              <p className="mt-8 rounded-2xl bg-mare-clara/50 p-5 text-lg">
                <span className="font-semibold">Prefere em Libras?</span> Use o botão azul do VLibras,
                na lateral da tela, e clique em qualquer texto desta página.
              </p>
            </section>

            <aside className="h-fit rounded-3xl bg-tinta p-8 text-nevoa">
              <p className="text-lg text-nevoa/80">Quanto tempo leva</p>
              <p className="mt-1 text-3xl font-extrabold text-white">
                Cerca de {servico.duracaoMin} minutos
              </p>
              <p className="mt-6 text-lg leading-relaxed text-nevoa/80">
                Agende pelo site, sem precisar ligar. Você escolhe a unidade, o dia e o horário.
              </p>
              <div className="mt-6">
                <BotaoLink to={`/agendar/${servico.id}`} variante="claro">
                  Agendar atendimento
                </BotaoLink>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  )
}