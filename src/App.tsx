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
import { ProfilePage } from './pages/store/ProfilePage';
import { ReceiptPage } from './pages/store/ReceiptPage';

import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

import { DashboardPage } from './pages/admin/DashboardPage';
import { InventoryPage } from './pages/admin/InventoryPage';
import { UsersPage } from './pages/admin/UsersPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { OrdersPage } from './pages/admin/OrdersPage';
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage';
import { CriticalStockPage } from './pages/admin/CriticalStockPage';
import { CategoriesAdminPage } from './pages/admin/CategoriesAdminPage';

function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
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

        <Route element={<ProtectedRoute allowedRoles={['Cliente']} />}>
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/pedido/:orderId" element={<OrderResultPage />} />
          <Route path="/pedido/:orderId/boleta" element={<ReceiptPage />} />
        </Route>
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={['Administrador', 'Vendedor']} />
        }
      >
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/ordenes" element={<OrdersPage />} />
          <Route
            path="/admin/ordenes/:orderId"
            element={<AdminOrderDetailPage />}
          />
          <Route path="/admin/productos" element={<InventoryPage />} />
          <Route path="/admin/categorias" element={<CategoriesAdminPage />} />
          <Route path="/admin/stock-critico" element={<CriticalStockPage />} />
          <Route path="/admin/reportes" element={<ReportsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['Administrador']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/usuarios" element={<UsersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
