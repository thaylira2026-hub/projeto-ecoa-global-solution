import type { Servico } from '../types/Servico'
import { requisicao } from './api'

// GET /servicos
export async function listarServicos(): Promise<Servico[]> {
  return requisicao<Servico[]>('/servicos')
}

// GET /servicos/{id}
export async function buscarServico(id: number): Promise<Servico> {
  return requisicao<Servico>(`/servicos/${id}`)
}