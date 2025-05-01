import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import backIcon from '../assets/Icons/back.png';

interface Product {
  nome: string;
  quantidade: number;
  tipo: string;
  preco: number;
}

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    quantidade: '',
    tipo: '',
    preco: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: Product = {
      nome: formData.nome,
      quantidade: parseInt(formData.quantidade, 10),
      tipo: formData.tipo,
      preco: parseFloat(formData.preco),
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Erro ao criar produto: ${response.statusText}`);
      navigate('/products');
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
      {/* Botão Voltar */}
      <button
        onClick={() => navigate('/products')}
        className="absolute top-6 left-6 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
      >
        <img src={backIcon} alt="Voltar" className="w-6 h-6" />
      </button>

      {/* Card de Formulário */}
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center text-green-600">
          Criar Produto
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <input
            name="quantidade"
            type="number"
            value={formData.quantidade}
            onChange={handleChange}
            placeholder="Quantidade"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <input
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            placeholder="Tipo"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              R$
            </span>
            <input
              name="preco"
              type="text"
              value={formData.preco}
              onChange={handleChange}
              placeholder="Preço"
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-lg hover:from-green-600 hover:to-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Produto'}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </form>
      </motion.div>
    </main>
  );
};

export default CreateProduct;