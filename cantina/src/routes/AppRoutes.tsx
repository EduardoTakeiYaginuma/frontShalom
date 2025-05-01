import { Routes, Route, Navigate } from 'react-router-dom'
import Users from '../pages/Users'
import MainLayout from '../layouts/MainLayout'
import Products from '../pages/Products'
import CreateUser from '../pages/CreateUser'
import OperacaoConta from '../pages/Deposit'
import CreateProduct from '../pages/CreateProduct'
import EditProduct from '../pages/EditProduct'
import StockControl from '../pages/Estoque'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="/users" element={<Users/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/create/users" element={<CreateUser/>} />
        <Route path="/create/products" element={<CreateProduct/>} />
        <Route path="/deposit/:id" element={<OperacaoConta/>} />
        <Route path='/edit/product/:id' element={<EditProduct/>} />
        <Route path='/stock' element={<StockControl/>} />
      </Route>
    </Routes>
  )
}
