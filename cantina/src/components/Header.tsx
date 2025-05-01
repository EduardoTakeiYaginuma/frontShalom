import { motion } from 'framer-motion'
import logo from '../assets/logo.png'

type Props = {
  toggleSidebar: () => void
}

export default function Header({ toggleSidebar }: Props) {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-16 bg-[#00AB4F] text-white flex items-center justify-between px-4 shadow-md"
    >
      <button onClick={toggleSidebar} className="text-2xl">
        &#9776;
      </button>
      <img src={logo} alt="Logo" className="h-10" />
    </motion.header>
  )
}
