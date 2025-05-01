import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowUpIcon, ArrowDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

import IconNome from '../assets/Icons/Nome.png'
import IconPermissao from '../assets/Icons/Permissão.png'
import IconQuarto from '../assets/Icons/Quarto.png'
import IconSaldo from '../assets/Icons/Saldo.png'
import IconAcao from '../assets/Icons/Ação.png'

interface Usuario {
  id: any
  _id: string
  nome: string
  sobrenome: string
  tipo_usuario: string
  quarto: string
  saldo: number
}

const permissoes: Record<string, string> = {
  '1': 'Acampante',
  '2': 'Equipe',
  '3': 'Cantina',
}

const Users: React.FC = (): JSX.Element => {
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<'nome' | 'saldo' | 'tipo_usuario' | 'quarto'>('nome')
  const [sortOrderAsc, setSortOrderAsc] = useState<boolean>(true)

  useEffect(() => {
    fetch('http://127.0.0.1:5000/usuarios')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar usuários')
        return res.json()
      })
      .then(setUsuarios)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const result = usuarios.filter(u =>
      (`${u.nome} ${u.sobrenome}`.toLowerCase().includes(search.toLowerCase()) ||
        (permissoes[u.tipo_usuario] || '').toLowerCase().includes(search.toLowerCase()))
    )

    return result.sort((a, b) => {
      let compare = 0
      switch (sortKey) {
        case 'nome':
          compare = `${a.nome} ${a.sobrenome}`.localeCompare(`${b.nome} ${b.sobrenome}`)
          break
        case 'saldo':
          compare = a.saldo - b.saldo
          break
        case 'tipo_usuario':
          compare = (permissoes[a.tipo_usuario] || '').localeCompare(permissoes[b.tipo_usuario] || '')
          break
        case 'quarto':
          compare = a.quarto.localeCompare(b.quarto)
          break
      }
      return sortOrderAsc ? compare : -compare
    })
  }, [usuarios, search, sortKey, sortOrderAsc])

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <motion.p
        className="text-gray-600 text-xl"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Carregando usuários...
      </motion.p>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <p className="text-red-500 text-lg">{error}</p>
    </div>
  )

  const columns = [
    { key: 'nome', icon: IconNome, label: 'Nome', sortable: true },
    { key: 'tipo_usuario', icon: IconPermissao, label: 'Permissão', sortable: true },
    { key: 'quarto', icon: IconQuarto, label: 'Quarto', sortable: true },
    { key: 'saldo', icon: IconSaldo, label: 'Saldo (R$)', sortable: true },
    { key: 'acoes', icon: IconAcao, label: 'Ações', sortable: false }
  ]

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1
          className="text-5xl font-extrabold text-center mb-8 text-[#00AB4F]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Lista de Clientes
        </motion.h1>

        <div className="bg-white shadow-xl rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-1/2">
              <label htmlFor="search" className="sr-only">Buscar usuários</label>
              <input
                id="search"
                type="text"
                placeholder="Buscar por nome ou permissão..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#00AB4F] focus:outline-none text-sm shadow-sm"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortKey}
                onChange={e => setSortKey(e.target.value as any)}
                className="text-sm px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#00AB4F] focus:outline-none text-gray-700 shadow-sm"
              >
                <option value="nome">Ordenar por Nome</option>
                <option value="saldo">Ordenar por Saldo</option>
                <option value="tipo_usuario">Ordenar por Permissão</option>
                <option value="quarto">Ordenar por Quarto</option>
              </select>
              <button
                onClick={() => setSortOrderAsc(!sortOrderAsc)}
                className="border border-gray-300 px-3 py-2 rounded-full hover:bg-gray-50 transition text-sm flex items-center shadow-sm"
                title="Alternar ordem"
              >
                {sortOrderAsc ? (
                  <ArrowUpIcon className="w-4 h-4 text-gray-600" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full table-auto border-separate border-spacing-y-2">
              <thead className="bg-[#e9fff2] text-[#00AB4F] text-sm uppercase sticky top-0">
                <tr>
                  {columns.map(col => (
                    <th key={col.key} className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <img src={col.icon} alt="" className="w-5 h-5" aria-hidden="true" />
                        <span className="font-semibold">{col.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-500 py-6">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u, i) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white shadow-sm rounded-xl hover:shadow-md transition-all duration-300"
                    >
                      <td className="text-center py-4 px-6">{u.nome} {u.sobrenome}</td>
                      <td className="text-center py-4 px-6">{permissoes[u.tipo_usuario] || 'Desconhecido'}</td>
                      <td className="text-center py-4 px-6">{u.quarto}</td>
                      <td className="text-center py-4 px-6 font-semibold text-[#00AB4F]">R$ {u.saldo.toFixed(2)}</td>
                      <td className="text-center py-4 px-6">
                        <button
                          className="bg-[#00AB4F] hover:bg-[#009846] text-white px-4 py-2 rounded-full text-sm font-semibold transition shadow-sm transform hover:scale-105"
                          onClick={() => navigate(`/deposit/${(u.id)}`)}
                        >
                          Depósito/Retirada
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-8">
            <button
              className="bg-[#00AB4F] hover:bg-[#009846] text-white px-6 py-3 rounded-full text-base font-semibold transition shadow-lg transform hover:scale-105"
              onClick={() => navigate('/create/users')}
            >
              Criar Usuário
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users