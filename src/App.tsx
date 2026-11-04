
import { Navigate, Route, Routes } from 'react-router-dom';

import { StoreLayout } from './components/templates/StoreLayout/StoreLayout';
import { AdminLayout } from './components/templates/AdminLayout/AdminLayout';

import { ProtectedRoute } from './routes/ProtectedRoute';

import { HomePage } from './pages/store/HomePage';
import { ProductsPage } from './pages/store/ProductsPage';
import { ProductDetailPage } from './pages/store/ProductDetailPage';
import { CategoriesPage } from './pages/store/CategoriesPage';
import { OffersPage } from './pages/store/OffersPage';
import { CartPage } from './pages/store/CartPage';
import { AboutPage } from './pages/store/AboutPage';
import { BlogsPage } from './pages/store/BlogsPage';
import { BlogDetailPage } from './pages/store/BlogDetailPage';
import { CheckoutPage } from './pages/store/CheckoutPage';
import { OrderResultPage } from './pages/store/OrderResultPage';

import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

import { DashboardPage } from './pages/admin/DashboardPage';
import { InventoryPage } from './pages/admin/InventoryPage';
import { UsersPage } from './pages/admin/UsersPage';

function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        {/* Rutas públicas de la tienda */}
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/productos/:id" element={<ProductDetailPage />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/ofertas" element={<OffersPage />} />
        <Route path="/carrito" element={<CartPage />} />

        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        {/* Rutas privadas de clientes */}
        <Route element={<ProtectedRoute allowedRoles={['Cliente']} />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/pedido/:orderId" element={<OrderResultPage />} />
        </Route>
      </Route>

      {/* Rutas privadas de administrador y vendedor */}
      <Route element={<ProtectedRoute allowedRoles={['Administrador', 'Vendedor']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/productos" element={<InventoryPage />} />
        </Route>
      </Route>

      {/* Rutas exclusivas del administrador */}
      <Route element={<ProtectedRoute allowedRoles={['Administrador']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/usuarios" element={<UsersPage />} />
        </Route>
      </Route>

      {/* Ruta no encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
