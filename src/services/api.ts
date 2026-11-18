// Endereço da API Java publicada no Render. Vem do arquivo .env (local) ou das variáveis da Vercel.
// O replace tira a barra do final, se alguém colocar: https://...onrender.com/ vira https://...onrender.com
export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

// Erro com a mensagem pronta para mostrar na tela e o status HTTP (0 = sem conexão)
export class ErroRequisicao extends Error {
  status: number

  constructor(mensagem: string, status: number) {
    super(mensagem)
    this.status = status
  }
}

// Função base: todas as chamadas para a API passam por aqui, usando fetch
export async function requisicao<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  let resposta: Response

  try {
    // O cabeçalho Content-Type só vai quando há corpo (POST e PUT).
    // Num GET ele faria o navegador mandar uma consulta extra de CORS antes.
      resposta = await fetch(`${API_URL}${caminho}`, {
      ...opcoes,
      headers: opcoes.body
        ? { 'Content-Type': 'application/json', ...opcoes.headers }
        : opcoes.headers,
    })
  } catch {
    throw new ErroRequisicao(
      'Não foi possível conectar ao servidor. Verifique sua internet e tente de novo.',
      0,
    )
  }

  if (!resposta.ok) {
    let mensagem = 'Algo deu errado. Tente de novo em alguns instantes.'
    try {
      // A API Java devolve os erros em JSON com o campo "mensagem"
      const corpo = await resposta.json()
      if (corpo?.mensagem) mensagem = corpo.mensagem
    } catch {
      // Resposta sem JSON: fica a mensagem padrão
    }
    throw new ErroRequisicao(mensagem, resposta.status)
  }

  // 204 = deu certo, mas sem conteúdo (por exemplo, depois de um DELETE)
  if (resposta.status === 204) {
    return undefined as T
  }

  return (await resposta.json()) as T
}

// Transforma qualquer erro em uma mensagem para mostrar na tela
export function mensagemDeErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : 'Algo deu errado. Tente de novo em alguns instantes.'
}