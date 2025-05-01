import { motion } from 'framer-motion'

interface SidebarProps {
  onClose: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed top-0 left-0 w-64 h-full bg-[#00AB4F] text-white shadow-2xl z-50"
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-white text-3xl hover:text-gray-200 transition"
            aria-label="Fechar menu"
          >
            &times;
          </button>
        </div>
        <nav className="mt-8 space-y-6 text-lg font-medium">
          <a href="/users" className="block hover:text-gray-200 transition">Clientes</a>
          <a href="/products" className="block hover:text-gray-200 transition">Produtos</a>
          <a href="/dashboard" className="block hover:text-gray-200 transition">Dashboard</a>
          <a href="/stock" className="block hover:text-gray-200 transition">Estoque</a>
          <a href="/logout" className="block hover:text-gray-200 transition">Sair</a>
        </nav>
      </div>
    </motion.div>
  )
}
