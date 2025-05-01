import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import backIcon from '../assets/Icons/back.png';

interface Product {
  id: number;
  nome: string;
  quantidade: number;
  tipo: string;
  preco: number;
}

// Form state uses strings for all inputs
interface FormData {
  nome: string;
  quantidade: string;
  tipo: string;
  preco: string;
}

const EditProduct: React.FC = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    nome: '',
    quantidade: '0',
    tipo: '',
    preco: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`http://127.0.0.1:5000/produtos/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Produto não encontrado');
        return res.json();
      })
      .then((data: Product) => {
        setFormData({
          nome: data.nome,
          quantidade: String(data.quantidade),
          tipo: data.tipo,
          preco: String(data.preco),
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        nome: formData.nome,
        tipo: formData.tipo,
        preco: parseFloat(formData.preco),
      };

      const response = await fetch(
        `http://127.0.0.1:5000/produtos/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error(`Falha ao atualizar: ${response.statusText}`);
      navigate('/products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Carregando produto...
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
      {/* Botão Voltar */}
      <button
        onClick={() => navigate('/products')}
        className="absolute top-6 left-6 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
      >
        <img src={backIcon} alt="Voltar" className="w-6 h-6" />
      </button>

      {/* Card de Edição */}
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center text-green-600">
          Editar Produto
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome do produto"
              required
              className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          {/* Quantidade */}
          <div>
            <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700">
              Quantidade (somente leitura)
            </label>
            <input
              id="quantidade"
              name="quantidade"
              type="number"
              value={formData.quantidade}
              readOnly
              className="mt-1 w-full border border-gray-200 bg-gray-100 rounded-xl px-4 py-2 cursor-not-allowed"
            />
          </div>

          {/* Tipo */}
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <input
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              placeholder="Tipo de produto"
              required
              className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          {/* Preço */}
          <div>
            <label htmlFor="preco" className="block text-sm font-medium text-gray-700">
              Preço
            </label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                R$
              </span>
              <input
                id="preco"
                name="preco"
                type="text"
                value={formData.preco}
                onChange={handleChange}
                placeholder="0,00"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-lg hover:from-green-600 hover:to-blue-600 transition disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </form>
      </motion.div>
    </main>
  );
};

export default EditProduct;