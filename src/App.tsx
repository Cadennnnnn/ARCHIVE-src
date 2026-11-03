

import { Navigate, Route, Routes } from 'react-router-dom';

import { StoreLayout } from './components/templates/StoreLayout/StoreLayout';

import { HomePage } from './pages/store/HomePage';
import { ProductsPage } from './pages/store/ProductsPage';
import { ProductDetailPage } from './pages/store/ProductDetailPage';
import { CategoriesPage } from './pages/store/CategoriesPage';
import { OffersPage } from './pages/store/OffersPage';
import { CartPage } from './pages/store/CartPage';

import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
