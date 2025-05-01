import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/Icons/back.png';
import { PlusCircleIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Produto {
  id: number;
  nome: string;
  quantidade: number;
  tipo: string;
  preco: number;
}

const LOW_STOCK_THRESHOLD = 5;

const StockControl: React.FC = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [deltaQty, setDeltaQty] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/produtos')
      .then(res => res.ok ? res.json() : Promise.reject('Falha ao carregar'))
      .then((data: Produto[]) => setProdutos(data))
      .catch(msg => setError(String(msg)))
      .finally(() => setLoading(false));
  }, []);

  const openEditor = (p: Produto) => {
    setActiveId(p.id);
    setDeltaQty('');
  };
  const closeEditor = () => setActiveId(null);

  const confirmAdd = async (id: number) => {
    const inc = parseInt(deltaQty, 10);
    if (isNaN(inc) || inc <= 0) return closeEditor();
    try {
      await fetch(`http://127.0.0.1:5000/produtos/${id}/adjust`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: inc }),
      });
      setProdutos(prev => prev.map(p => p.id === id ? { ...p, quantidade: p.quantidade + inc } : p));
    } catch (e: any) {
      setError(e.message);
    } finally {
      closeEditor();
    }
  };

  if (loading) return <p className="text-center py-20 text-gray-500">Carregando estoque...</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white shadow hover:bg-gray-200 transition">
          <img src={backIcon} alt="Voltar" className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-3xl font-bold text-center text-gray-800">Controle de Estoque</h1>
      </div>

      <div className="space-y-4">
        {produtos.map(p => {
          const low = p.quantidade <= LOW_STOCK_THRESHOLD;
          const isActive = p.id === activeId;
          return (
            <motion.div
              key={p.id}
              className={`bg-white rounded-xl shadow-md flex items-center justify-between p-4 border-l-4 ${low ? 'border-red-500' : 'border-green-500'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{p.nome}</h2>
                <p className="text-sm text-gray-500">Tipo: {p.tipo}</p>
                <p className="text-sm text-gray-500">Preço: R$ {p.preco.toFixed(2)}</p>
              </div>

              <div className="flex items-center">
                <span className={`text-lg font-bold ${low ? 'text-red-600' : 'text-green-600'}`}>{p.quantidade}</span>
                {isActive ? (
                  <div className="ml-4 flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      value={deltaQty}
                      onChange={e => setDeltaQty(e.target.value)}
                      className="w-20 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-300"
                      placeholder="+Qtd"
                    />
                    <button onClick={() => confirmAdd(p.id)} className="text-green-600 hover:text-green-800">
                      <CheckIcon className="w-6 h-6" />
                    </button>
                    <button onClick={closeEditor} className="text-gray-500 hover:text-gray-700">
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => openEditor(p)} className="ml-4 text-blue-600 hover:text-blue-800">
                    <PlusCircleIcon className="w-6 h-6" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StockControl;
