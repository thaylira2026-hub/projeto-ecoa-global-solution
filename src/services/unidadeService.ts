import type { Unidade } from '../types/Unidade'
import { requisicao } from './api'

// GET /unidades?servicoId={id}
export async function listarUnidadesPorServico(idServico: number): Promise<Unidade[]> {
  return requisicao<Unidade[]>(`/unidades?servicoId=${idServico}`)
}

// GET /unidades/{id}
export async function buscarUnidade(id: number): Promise<Unidade> {
  return requisicao<Unidade>(`/unidades/${id}`)
}