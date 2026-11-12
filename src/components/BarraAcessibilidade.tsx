import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { textoDaPagina, useLeitura } from '../hooks/UseLeitura'

const TAMANHOS_LETRA = [100, 112.5, 125, 137.5]

// O localStorage pode falhar em alguns navegadores, por isso o try/catch
function lerPreferencia(chave: string) {
  try {
    return localStorage.getItem(chave)
  } catch {
    return null
  }
}

function salvarPreferencia(chave: string, valor: string) {
  try {
    localStorage.setItem(chave, valor)
  } catch {
    // Sem localStorage, a preferência só vale até fechar a página
  }
}

const estiloOpcao =
  'flex h-12 items-center rounded-2xl border-2 border-tinta/15 px-4 text-lg font-semibold hover:border-mare disabled:opacity-40'

export default function BarraAcessibilidade() {
  const [aberta, setAberta] = useState(false)
  const [nivelLetra, setNivelLetra] = useState(() => Number(lerPreferencia('ecoa-letra') ?? 0))
  const [altoContraste, setAltoContraste] = useState(
    () => lerPreferencia('ecoa-contraste') === 'sim',
  )
  const leitura = useLeitura()
  const { pathname } = useLocation()
  const { parar } = leitura

  useEffect(() => {
    document.documentElement.style.fontSize = `${TAMANHOS_LETRA[nivelLetra]}%`
    salvarPreferencia('ecoa-letra', String(nivelLetra))
  }, [nivelLetra])

  useEffect(() => {
    document.documentElement.classList.toggle('alto-contraste', altoContraste)
    salvarPreferencia('ecoa-contraste', altoContraste ? 'sim' : 'nao')
  }, [altoContraste])

  // Ao trocar de página, para a leitura e fecha o painel
  useEffect(() => {
    parar()
    setAberta(false)
  }, [pathname, parar])

  function restaurarPadrao() {
    setNivelLetra(0)
    setAltoContraste(false)
    parar()
  }

  return (
    <div className="fixed bottom-6 left-6 z-30">
      {aberta && (
        <div
          id="painel-acessibilidade"
          className="absolute bottom-16 left-0 w-72 rounded-3xl border border-tinta/10 bg-white p-5 text-tinta shadow-xl"
        >
          <h2 className="text-xl font-extrabold">Acessibilidade</h2>

          <p className="mt-4 font-semibold">Tamanho da letra</p>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setNivelLetra(nivelLetra - 1)}
              disabled={nivelLetra === 0}
              aria-label="Diminuir a letra"
              className={`${estiloOpcao} justify-center`}
            >
              A−
            </button>
            <span className="flex-1 text-center text-lg" aria-live="polite">
              {TAMANHOS_LETRA[nivelLetra]}%
            </span>
            <button
              type="button"
              onClick={() => setNivelLetra(nivelLetra + 1)}
              disabled={nivelLetra === TAMANHOS_LETRA.length - 1}
              aria-label="Aumentar a letra"
              className={`${estiloOpcao} justify-center`}
            >
              A+
            </button>
          </div>

          <button
            type="button"
            onClick={() => setAltoContraste(!altoContraste)}
            aria-pressed={altoContraste}
            className={`${estiloOpcao} mt-4 w-full justify-between`}
          >
            Alto contraste
            <span aria-hidden="true">{altoContraste ? '✅' : '⬜'}</span>
          </button>

          {leitura.suportado && (
            <button
              type="button"
              onClick={() =>
                leitura.estado === 'parado' ? leitura.ler(textoDaPagina()) : leitura.parar()
              }
              className={`${estiloOpcao} mt-3 w-full justify-between`}
            >
              {leitura.estado === 'parado' ? 'Ouvir esta página' : 'Parar a leitura'}
              <span aria-hidden="true">{leitura.estado === 'parado' ? '🔊' : '⏹️'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={restaurarPadrao}
            className="mt-4 w-full text-center font-semibold text-mare underline underline-offset-4"
          >
            Restaurar padrão
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAberta(!aberta)}
        aria-expanded={aberta}
        aria-controls="painel-acessibilidade"
        aria-label={aberta ? 'Fechar opções de acessibilidade' : 'Abrir opções de acessibilidade'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-tinta text-3xl text-white shadow-lg hover:bg-mare"
      >
        <span aria-hidden="true">{aberta ? '✕' : '♿'}</span>
      </button>
    </div>
  )
}