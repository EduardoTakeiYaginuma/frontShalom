// src/pages/CreateUser.tsx
import API_BASE_URL from "../config.ts";
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backIcon from '../assets/Icons/back.png'

interface Usuario {
  nome: string
  sobrenome: string
  nickname?: string
  quarto: string
  tipo_usuario: number
  saldo?: number
}

const tipoUsuarioMap: Record<string, number> = {
  Acampante: 1,
  Equipe: 2,
  Cantina: 3,
}

const CreateUser: React.FC = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    nickname: '',
    quarto: '',
    tipo_usuario: 'Acampante',
    saldo: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload: Usuario = {
      nome: formData.nome,
      sobrenome: formData.sobrenome,
      nickname: formData.nickname || undefined,
      quarto: formData.quarto,
      tipo_usuario: tipoUsuarioMap[formData.tipo_usuario],
      saldo: formData.saldo ? parseFloat(formData.saldo) : undefined,
    }

    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Erro ao criar usuário: ${response.statusText}`)
      }

      navigate('/users')
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <main className="relative w-full h-full flex items-center justify-center px-4">
      {/* Botão de voltar */}
      <button
        onClick={() => navigate('/users')}
        className="absolute top-6 left-6 z-10 hover:scale-105 transition-transform"
      >
        <img src={backIcon} alt="Voltar" className="w-7 h-7" />
      </button>

      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#00AB4F]">
          Criar Usuário
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {['nome', 'sobrenome', 'nickname', 'quarto'].map(field => (
            <input
              key={field}
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              required={field !== 'nickname'}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AB4F]"
            />
          ))}

          <select
            name="tipo_usuario"
            value={formData.tipo_usuario}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AB4F]"
          >
            <option>Acampante</option>
            <option>Equipe</option>
            <option>Cantina</option>
          </select>

          <input
            name="saldo"
            type="number"
            value={formData.saldo}
            onChange={handleChange}
            placeholder="Saldo (opcional)"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AB4F]"
          />

          <button
            type="submit"
            className="w-full bg-[#00AB4F] text-white font-semibold py-2 rounded-2xl hover:bg-[#008f43] transition-colors duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Usuário'}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </form>
      </div>
    </main>
  )
}

export default CreateUser
