import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpIcon, ArrowDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import IconNome from '../assets/Icons/NomeProduto.png';
import IconQuantidade from '../assets/Icons/Quantidade.png';
import IconTipo from '../assets/Icons/Tipo.png';
import IconPreco from '../assets/Icons/Preco.png';
import IconAcao from '../assets/Icons/Ação.png';

interface Produto {
  _id: string;
  id: string;
  nome: any;
  quantidade: number;
  tipo: string;
  preco: number;
}

const Products: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<'nome' | 'quantidade' | 'tipo' | 'preco'>('nome');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/produtos')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar produtos');
        return res.json();
      })
      .then(setProdutos)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return produtos
      .filter(p =>
        p.nome.toLowerCase().includes(search.toLowerCase()) ||
        p.tipo.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        let cmp = 0;
        switch (sortKey) {
          case 'nome':
            cmp = a.nome.localeCompare(b.nome);
            break;
          case 'quantidade':
            cmp = a.quantidade - b.quantidade;
            break;
          case 'tipo':
            cmp = a.tipo.localeCompare(b.tipo);
            break;
          case 'preco':
            cmp = a.preco - b.preco;
            break;
        }
        return sortAsc ? cmp : -cmp;
      });
  }, [produtos, search, sortKey, sortAsc]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.p
          className="text-gray-600 text-xl"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Carregando produtos...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1
          className="text-5xl font-extrabold text-center mb-8 text-[#00AB4F]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Lista de Produtos
        </motion.h1>

        <div className="bg-white shadow-xl rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-1/2">
              <label htmlFor="search" className="sr-only">Buscar produtos</label>
              <input
                id="search"
                type="text"
                placeholder="Buscar por nome ou tipo..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#00AB4F] focus:outline-none text-sm shadow-sm transition"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortKey}
                onChange={e => setSortKey(e.target.value as any)}
                className="text-sm px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#00AB4F] focus:outline-none text-gray-700 shadow-sm transition"
              >
                <option value="nome">Ordenar por Nome</option>
                <option value="quantidade">Ordenar por Quantidade</option>
                <option value="tipo">Ordenar por Tipo</option>
                <option value="preco">Ordenar por Preço</option>
              </select>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="border border-gray-300 px-3 py-2 rounded-full hover:bg-gray-50 shadow-sm transition flex items-center"
                title="Alternar ordem"
              >
                {sortAsc ? (
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
                  {[
                    { icon: IconNome, label: 'Nome' },
                    { icon: IconQuantidade, label: 'Quantidade' },
                    { icon: IconTipo, label: 'Tipo' },
                    { icon: IconPreco, label: 'Preço (R$)' },
                    { icon: IconAcao, label: 'Ações' },
                  ].map(({ icon, label }) => (
                    <th key={label} className="px-6 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <img src={icon} alt={label} className="w-5 h-5" />
                        <span className="font-semibold">{label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-500 py-6">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p, i) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      whileHover={{ scale: 1.02 }}
                      className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f9fdfb]'} shadow-sm rounded-xl hover:shadow-md transition-all duration-300`}
                    >
                      <td className="text-center py-4 px-6 font-medium text-gray-800">{p.nome}</td>
                      <td className="text-center py-4 px-6 text-gray-700">{p.quantidade}</td>
                      <td className="text-center py-4 px-6 text-gray-700">{p.tipo}</td>
                      <td className="text-center py-4 px-6 text-[#00AB4F] font-semibold">
                        R$ {p.preco.toFixed(2)}
                      </td>
                      <td className="text-center py-4 px-6">
                        <button
                          className="bg-[#00AB4F] hover:bg-[#009846] text-white px-4 py-2 rounded-full text-sm font-semibold transition shadow-sm transform hover:scale-105"
                          onClick={() => navigate(`/edit/product/${p.id}`)}
                        >
                          Editar
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
              onClick={() => navigate('/create/products')}
            >
              Criar Produto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;