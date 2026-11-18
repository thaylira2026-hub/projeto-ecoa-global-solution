import type { Atendimento, AtendimentoNovo } from '../types/Atendimento'
import { requisicao } from './api'

// POST /cidadaos/{id}/atendimentos
// Se o horário já estiver ocupado, a API responde 409 e a tela mostra a mensagem no campo de horário
export async function agendarAtendimento(
  idCidadao: number,
  dados: AtendimentoNovo,
): Promise<Atendimento> {
  return requisicao<Atendimento>(`/cidadaos/${idCidadao}/atendimentos`, {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

// GET /atendimentos/{id}
export async function buscarAtendimento(id: number): Promise<Atendimento> {
  return requisicao<Atendimento>(`/atendimentos/${id}`)
}

// PUT /atendimentos/{id}: usado pelo balcão para chamar a pessoa
export async function chamarAtendimento(atendimento: Atendimento): Promise<Atendimento> {
  const atualizado: Atendimento = { ...atendimento, status: 'CHAMADO' }
  return requisicao<Atendimento>(`/atendimentos/${atendimento.id}`, {
    method: 'PUT',
    body: JSON.stringify(atualizado),
  })
}