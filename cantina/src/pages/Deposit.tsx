import API_BASE_URL from "../config.ts";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import backIcon from "../assets/Icons/back.png";
import {
  BanknotesIcon,
  ArrowDownCircleIcon,
} from "@heroicons/react/24/outline";

interface Usuario {
  id: string;
  nome: string;
}

const OperacaoConta: React.FC = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [operacao, setOperacao] = useState<"deposito" | "retirada">("deposito");
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"error" | "success">("success");

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/usuarios/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Usuário não encontrado");
        return res.json();
      })
      .then((data: Usuario) => setUsuario(data))
      .catch((err) => {
        setModalType("error");
        setModalMessage(err.message);
        setIsModalOpen(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(valor.replace(",", "."));
    if (isNaN(amount) || amount <= 0) {
      setModalType("error");
      setModalMessage("Insira um valor válido");
      setIsModalOpen(true);
      return;
    }
    if (!id) {
      setModalType("error");
      setModalMessage("ID de usuário inválido");
      setIsModalOpen(true);
      return;
    }

    const endpoint = operacao === "deposito" ? "deposit" : "withdraw";
    const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valor: amount }),
    });
    const data = await response.json();

    setModalType(response.ok ? "success" : "error");
    setModalMessage(
      data.message ||
        (response.ok ? "Operação realizada!" : "Falha na operação"),
    );
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Carregando usuário...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
      {/* Back Button */}
      <img
        src={backIcon}
        alt="Voltar"
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 h-8 w-8 cursor-pointer hover:opacity-80 transition"
      />

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border-l-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 250 }}
            style={{
              borderColor: modalType === "error" ? "#ef4444" : "#10b981",
            }}
          >
            <h3
              className={`text-lg font-bold mb-2 ${modalType === "error" ? "text-red-600" : "text-green-600"}`}
            >
              {modalType === "error" ? "Ops!" : "Legal!"}
            </h3>
            <p className="text-gray-700 mb-4">{modalMessage}</p>
            <button
              onClick={() => {
                setIsModalOpen(false);
                if (modalType === "success") navigate("/users");
              }}
              className="w-full py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition"
            >
              Fechar
            </button>
          </motion.div>
        </div>
      )}

      {/* Form Card */}
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-indigo-600">
              {usuario?.nome.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="px-4 py-1 bg-indigo-100 rounded-full text-indigo-700 font-semibold">
            {usuario?.nome}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Operation Selection */}
          <div>
            <span className="block text-sm font-medium text-gray-600 mb-2">
              Operação
            </span>
            <div className="mt-1 flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setOperacao("deposito")}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg border ${
                  operacao === "deposito"
                    ? "bg-green-50 border-green-400"
                    : "border-gray-300 hover:border-gray-400"
                } transition`}
              >
                <BanknotesIcon className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Depósito</span>
              </button>
              <button
                type="button"
                onClick={() => setOperacao("retirada")}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg border ${
                  operacao === "retirada"
                    ? "bg-red-50 border-red-400"
                    : "border-gray-300 hover:border-gray-400"
                } transition`}
              >
                <ArrowDownCircleIcon className="h-5 w-5 text-red-600" />
                <span className="text-gray-700">Retirada</span>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label
              htmlFor="valor"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Valor (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                R$
              </span>
              <input
                type="text"
                id="valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 text-white font-semibold shadow-lg hover:from-green-500 hover:to-blue-500 transition"
          >
            Confirmar {operacao === "deposito" ? "Depósito" : "Retirada"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default OperacaoConta;
