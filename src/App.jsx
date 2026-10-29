import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import Home from "./pages/store/Home.jsx";
import Products from "./pages/store/Products.jsx";
import ProductDetail from "./pages/store/ProductDetail.jsx";
import Categories from "./pages/store/Categories.jsx";
import Offers from "./pages/store/Offers.jsx";
import About from "./pages/store/About.jsx";
import Blogs from "./pages/store/Blogs.jsx";
import BlogDetail from "./pages/store/BlogDetail.jsx";
import Contact from "./pages/store/Contact.jsx";
import Login from "./pages/store/Login.jsx";
import Register from "./pages/store/Register.jsx";
import Cart from "./pages/store/Cart.jsx";
import Checkout from "./pages/store/Checkout.jsx";
import PurchaseSuccess from "./pages/store/PurchaseSuccess.jsx";
import PurchaseError from "./pages/store/PurchaseError.jsx";
import NotFound from "./pages/store/NotFound.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminProductDetail from "./pages/admin/AdminProductDetail.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminUserDetail from "./pages/admin/AdminUserDetail.jsx";
import AdminUserHistory from "./pages/admin/AdminUserHistory.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail.jsx";
import AdminCriticalProducts from "./pages/admin/AdminCriticalProducts.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminReports from "./pages/admin/AdminReports.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";

function StoreLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/ofertas" element={<Offers />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/compra-exitosa" element={<PurchaseSuccess />} />
        <Route path="/compra-fallida" element={<PurchaseError />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="ordenes" element={<AdminOrders />} />
        <Route path="ordenes/:id" element={<AdminOrderDetail />} />
        <Route path="productos" element={<AdminProducts />} />
        <Route path="productos/:id" element={<AdminProductDetail />} />
        <Route path="criticos" element={<AdminCriticalProducts />} />
        <Route path="categorias" element={<AdminCategories />} />
        <Route path="reportes" element={<AdminReports />} />
        <Route path="perfil" element={<AdminProfile />} />
        <Route path="usuarios" element={<ProtectedRoute soloAdmin><AdminUsers /></ProtectedRoute>} />
        <Route path="usuarios/:run" element={<ProtectedRoute soloAdmin><AdminUserDetail /></ProtectedRoute>} />
        <Route path="usuarios/:run/compras" element={<ProtectedRoute soloAdmin><AdminUserHistory /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}