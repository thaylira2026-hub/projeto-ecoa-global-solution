import type { Cidadao, CidadaoNovo } from '../types/Cidadao'
import { requisicao } from './api'

// POST /cidadaos
export async function cadastrarCidadao(dados: CidadaoNovo): Promise<Cidadao> {
  return requisicao<Cidadao>('/cidadaos', { method: 'POST', body: JSON.stringify(dados) })
}